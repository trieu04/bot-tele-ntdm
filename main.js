const process = require('process')
require('dotenv').config()

/// Global varible
globalThis.client = new Object({
    version: '1.2.14',
    timeStart: Date.now(),
    mainPath: process.cwd(),
    configPath: new String()
});
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
const log = logger.getLogger("MAIN")

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

async function startConnectDB(){
    const db = require("./includes/database/db-mysql");
    const text = globalThis.text
    try {
        await db.sequelize.authenticate()
        await db.sequelize.sync()
        log.info(text.render('success_connect_database'))
        globalThis.db = db
        globalThis.models = db.models   
        return true;
    } catch (error) {
        log.error(text.render('failed_connect_database'))
        log.error(error)
        return false
    }
}
async function startBot(){
    const handleMessage = require("./includes/handle/handleMessage")
    const createDatabase = require("./includes/middleware/createDatabase")
    const saveSendedMessage = require("./includes/bot/applySaveMessage")

    const DEV_MODE = true
    const token = DEV_MODE ? process.env.BOT_DEV_TOKEN : process.env.BOT_TOKEN
    const {Telegraf, Telegram} = require("telegraf")

    const bot = new Telegraf(token);
    saveSendedMessage(bot, Telegram)

    bot.use(createDatabase);
    bot.on("message", async (ctx) => {
        return handleMessage({ctx})
    });

    bot.launch().catch(err => {
        log.error(err)
        throw err
    })
}

async function START(){
    if(!await startConnectDB()){
        exit(1)
    }
 
    await startBot()
}
START()
