const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')
const axios = require('axios').default;
const process = require('process');
const os = require("os");
const fs = require('fs');
const ytdl = require('ytdl-core');
require('dotenv').config();

const express = require('express')

// Start app for Heroku
const app = express()
app.use(express.static('public'))
app.get('/', function (req, res) {
    res.send("QuocTrieuIT")
})
app.post('/telegram', function (req, res) {
    bot.handleUpdate(req.body, res)
})
app.get('/telegram', function (req, res) {
    bot.handleUpdate(req.body, res)
})
app.get('/telegram_dev', function (req, res) {
    res.status(200).send("OK");
})
app.post('/telegram_dev', function (req, res) {
    res.status(200).send("OK");
})
app.get('/awake', function (req, res) {
    res.status(200).send("OK")
})

// Start server
const server = app.listen(process.env.PORT || 3000, () => console.log('Server is running...'))
const bot = new Telegraf(process.env.BOT_DEV_TOKEN)
bot.launch()

bot.command("hi", ctx => {
    ctx.reply("hello")
})
bot.command("stop", ctx => {
    console.log("send SIGTERM");
    process.kill(process.pid, "SIGTERM");
})

process.env.ILLDING = "1";
const CronJob = require('cron').CronJob;
const keep_awake = new CronJob('*/30 * * * *', () => {
    if(process.env.ILLDING != "0"){
        keep_awake.stop()
        console.log("stop!")
    }
    else {
        console.log("GET abcxyz");
        process.env.ILLDING = "0";
    }
})


keep_awake.start()

async function graceful_stop(){
    console.log("Stopping...");
    await bot.telegram.setWebhook('https://bot-tele-ntdm.herokuapp.com/telegram_dev');
    server.close();
    keep_awake.stop();
    console.log("Set webhook to https://bot-tele-ntdm.herokuapp.com/telegram_dev");
}

// Enable graceful stop
process.once('SIGINT', async () => {
    bot.stop('SIGINT')
    await graceful_stop();
})
process.once('SIGTERM', async () => {
    bot.stop('SIGTERM')
    await graceful_stop();
})