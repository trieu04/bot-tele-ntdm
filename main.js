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
const log = require("loglevel").getLogger("MAIN")

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

    const DEV_MODE = true
    const token = DEV_MODE ? process.env.BOT_DEV_TOKEN : process.env.BOT_TOKEN
    const {Telegraf} = require("telegraf")
    const bot = new Telegraf(token);
    bot.use(createDatabase);
    bot.on("message", (ctx) => {
        handleMessage({ctx})
    });
    bot.launch()
}
async function startWeb(){
    const express = require('express')
    const app = express()
    const port = 9001

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
       log.info(`Example app listening on port ${port}: http://localhost:${port}`)
    })
}

async function startApp(){
    if(!await startConnectDB()){
        return;
    }
    await startBot()
    await startWeb()
}
startApp()
