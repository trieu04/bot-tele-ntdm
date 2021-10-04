const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')
const axios = require('axios').default;
const process = require('process');
const os = require("os");
const fs = require('fs');
const ytdl = require('ytdl-core');
require('dotenv').config();


axios.get(process.env.APP_BASE_URL + "/awake");

// const bot = new Telegraf(process.env.BOT_DEV_TOKEN)
// bot.launch()

// process.once('SIGINT', async () => {
//     bot.stop('SIGTERM')
//     console.log("illding");
//     await bot.telegram.setWebhook('https://bot-tele-ntdm.herokuapp.com/telegram_dev');
//     console.log("setWebhook")
// })
// process.once('SIGTERM', () => {
//     console.log(1)
//     bot.stop('SIGTERM')
// })

// process.env.ILLDING = "1";
// const CronJob = require('cron').CronJob;
// const keep_awake = new CronJob('* * * * * *', () => {
//     if(process.env.ILLDING == "0"){
//         keep_awake.stop()
//         console.log("stop!")
//     }
//     else {
//         console.log("GET abcxyz");
//         process.env.ILLDING = "0";
//     }
// })


// keep_awake.start()
