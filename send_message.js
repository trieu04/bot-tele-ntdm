const {
  Context,
  Telegraf,
  session,
  Scenes: { WizardScene, BaseScene, Stage },
  Markup,
  Telegram,
} = require("telegraf");

const process = require("process");
require("dotenv").config();

const fs = require("fs");
const os = require("os");
const events = require("events");
const pidusage = require("pidusage");
const CronJob = require("cron").CronJob;
const moment = require("moment");
const express = require("express");

const progress = require("progress-stream");
const search = require("youtube-search");
const ytdl = require("ytdl-core");
const randomEmoji = require("random-emoji");
const axios = require("axios").default;
const mysql = require("mysql");

const speed = require(`performance-now`);

const DEV_MODE = process.env.MODE == "dev" ? true : false;
const inHeroku = (() => {
  if (process.env._ && process.env._.indexOf("heroku") !== -1) return true;
  else return false;
})();

const ntdm_api = axios.create({
  baseURL: "http://api.quoctrieudev.com/v1.1",
  params: { nttoken: "ffffffff" },
  data: { nttoken: "ffffffff" },
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});
const opps = () => {
  return "Opps...\nĐã xảy ra lỗi gì đó!\nChúng tôi sẽ sớm sửa lại.\nLiên hệ @quoctrieudev";
};
const lf = os.EOL;

// Telegram
const token = process.env.BOT_TOKEN;
const tg_report_id = process.env.TG_GROUP_REPORT;
const tg_admin_id = process.env.TG_ADMIN;
const tg_filestore_id = process.env.TG_GROUP_FILE;
const tg_id_block_list = [];

var tele_id;
var update_id;

const bot = new Telegraf(token);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

var json = require("./update.json");
for (const i of json) {
}

var list_send = require("./send_list_id.json");
list_send = [...new Set(list_send)];

console.log("number:", list_send.length);
const main = async () => {
  for (const tgid of list_send) {
    var result = await bot.telegram.sendMessage(
      tgid,
      "[Thông báo]\n" +
        "Hiện key 1.1.1.1 đã có trở lại, Bạn hãy sử dụng lệnh /keywarp để nhận key nha.\nCám ơn và chúc bạn một ngày tốt lành."
    );
    console.log(result);

    await sleep(500);
  }
};
main();
