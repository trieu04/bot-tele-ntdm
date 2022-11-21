const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')

const process = require('process');
require('dotenv').config();

const fs = require('fs');
const os = require("os");
const events = require('events');
const pidusage = require('pidusage');
const CronJob = require('cron').CronJob;
const moment = require('moment')
const express = require('express')

const progress = require('progress-stream');
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const randomEmoji = require('random-emoji');
const axios = require('axios').default;
const mysql = require('mysql')

const DEV_MODE = process.env.MODE == "dev" ? true : false;

const ntdm_api = axios.create({
    baseURL: 'http://api.quoctrieudev.com/',
    params: { access_key: "1111" },
    data: { access_key: "1111" },
    headers: { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
});
const opps = () => { return "Opps...\nĐã xảy ra lỗi gì đó!\nChúng tôi sẽ sớm sửa lại.\nLiên hệ @quoctrieudev"; }
const lf = os.EOL;


// Telegram
const token = process.env.BOT_DEV_TOKEN
const tg_report_id = process.env.TG_GROUP_REPORT
const tg_admin_id = process.env.TG_ADMIN
const tg_filestore_id = process.env.TG_GROUP_FILE

var tele_id;
var update_id;

const bot = new Telegraf(token)

bot.on("message", ctx =>{
  console.log(ctx.message);
})


bot.telegram.sendMessage(-1001763001518, "/detail");

bot.launch();