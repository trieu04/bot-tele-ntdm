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

var list_sended = [
  1153910437, 1305449961, 5025260440, 1235200013, 1042320705, 5151946565,
  1042320705, 2033767153, 1235200013, 1235200013, 1235200013, 1235200013,
  1235200013, 1235200013, 1235200013, 1235200013, 1235200013, 1235200013,
  1235200013, 5025260440, 1235200013, 1235200013, 1235200013, 1235200013,
  1235200013, 1267608174, 1235200013, 1235200013, 1235200013, 1235200013,
  1235200013, 1310610292, 949612773, 1235200013, 1235200013, 1235200013,
  1235200013, 1235200013, 816532322, 2066890391, 2011464477, 2011464477,
  1266668899, 1039517386, 1039517386, 1039517386, 5748091270, 5748091270,
  1039517386, 1328970106, 5748091270, 1911827657, 1345463714, 1455857108,
  838311608, 867182637, 1865286847, 1234544065, 1865286847, 539433289,
  1493772765, 1266668899, 5135220484,
];
var json = require("./update.json");

var send_list = [];
for (let i of json) {
  send_list.push(i.message.from.id);
}

send_list = send_list.filter((el) => !list_sended.includes(el));

send_list = [...new Set(send_list)];
var send_list2 = [];
(async () => {
  for (i of send_list) {
    const check_key = await ntdm_api.get(
      `/cfwarp/key/list?pretty=1&cond=["telegram_id_owner","=","${i}"]`
    );
    console.log("id:", i, check_key.data);
    if (check_key.status && check_key.data && check_key.data.length == 0) {
        send_list2.push(i)
    }
    await sleep(100);
  }

  
  fs.appendFile("./send_list_id.json", JSON.stringify(send_list2, undefined, 4), (err) => {
    if (err) {
      console.error(err);
    }
  });
})();
