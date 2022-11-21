const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup, Telegram } = require('telegraf')

const process = require('process');
require('dotenv').config();

const token = process.env.BOT_DEV_TOKEN
const bot = new Telegraf(token);

(async() => {

    update = await bot.telegram.getUpdates();
    console.log(update)

})()

