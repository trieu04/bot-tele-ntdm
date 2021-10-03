const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')
const axios = require('axios').default;
const process = require('process');
const os = require("os");
const fs = require('fs');
const ytdl = require('ytdl-core');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.telegram.setWebhook('https://bot-tele-ntdm.herokuapp.com/telegram');
bot.launch()

process.once('SIGINT', () =>{console.log(0); bot.stop('SIGINT')})
process.once('SIGTERM', () =>{
    console.log(1)
    bot.stop('SIGTERM')
})


