const process = require('process')
require('dotenv').config()

/// Global varible
globalThis.client = new Object({
    version: '1.2.14',
    timeStart: new Date(),
    mainPath: process.cwd(),
    configPath: new String()
});
globalThis.bot = new Object()
globalThis.cron = new Array()
const NodeCache = require( "node-cache" );
globalThis.caches = {
    users: new NodeCache( { stdTTL: 100, checkperiod: 120 } ),
    groups: new NodeCache( { stdTTL: 100, checkperiod: 120 } ),
    commands: new NodeCache( { stdTTL: 100, checkperiod: 120 } )
}

/// logger
require("./includes/main/logger")
const logger = require("loglevel")
const log = logger.getLogger("START")

/// Module load status
globalThis.loadStatus = []
const handleStatus = require("./includes/main/handle-module-status")

///  Find and get variable from Config
const getConfig = require("./includes/main/get-config")
globalThis.config = getConfig.config
handleStatus(getConfig.status)

/// Get language
const language = require("./includes/languages/language")
globalThis.text = language.text
handleStatus(language.status)

/// Load modules
require("./includes/main/load-modules")();

/// Error notification

const ErrorNotification = require("./includes/main/error-notification")

async function startConnectDB(){
    const db = require("./includes/database/db-mysql");
    const text = globalThis.text
    try {
        await db.sequelize.authenticate()
        await db.sequelize.sync()
        log.info(text.get('success_connect_database'))
        globalThis.db = db
        globalThis.models = db.models   
        return true;
    } catch (error) {
        log.error(text.get('failed_connect_database'))
        log.error(error)
        exit(1)
    }
}
async function startBot(){
    const handleMessage = require("./includes/handle/handleMessage")
    const handleCallbackQuery = require("./includes/handle/handleCallbackQuery")
    const createDatabase = require("./includes/handle/createDatabase")
    const saveSendedMessage = require("./includes/bot/applySaveMessage")

    const mode = process.env.MODE

    const token = (() => {
        switch(mode.toLowerCase()){
            case "prod": return process.env.PROD_BOT_TOKEN
            case "dev": return process.env.DEV_BOT_TOKEN
            case "prev": return process.env.PREV_BOT_TOKEN
        }
    })()

    const {Telegraf, Telegram} = require("telegraf")

    const bot = new Telegraf(token)
    
    saveSendedMessage(bot, Telegram)

    const errorNotification = new ErrorNotification({sendTo:{
        telegram: {
            ctx: bot,
            chatID: globalThis.config.GROUP_STATUS
        }
    }})
    globalThis.errorNotification = errorNotification

    bot.use(createDatabase)
    bot.on("message",  (ctx) => handleMessage({ctx}))
    bot.on("callback_query", (ctx) => handleCallbackQuery({ctx}))

    bot.launch().catch(err => {
        log.error(err)
        throw err
    })
}

async function App(){
    await startConnectDB()
    await startBot()
}
App()
