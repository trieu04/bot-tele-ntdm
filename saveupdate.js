const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup, Telegram } = require('telegraf')

const process = require('process');
require('dotenv').config();
const fs = require('fs');


const token = process.env.BOT_TOKEN
const bot = new Telegraf(token);

(async() => {

    update = await bot.telegram.getUpdates();
    console.log(update)
    fs.appendFile('./update.txt', JSON.stringify(update, undefined, 4), err => {if (err) {  console.error(err);} });

})()

