const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')

const process = require('process');
var events = require('events');
const CronJob = require('cron').CronJob;

require('dotenv').config();
const os = require("os");

const axios = require('axios').default;
const fs = require('fs');
var progress = require('progress-stream');
const search = require('youtube-search');
const ytdl = require('ytdl-core');

const token = process.env.BOT_DEV_TOKEN
const eol = os.EOL;
var events = require('events');
const { resolve } = require('path');
const { rejects } = require('assert');



const yt_media = class {
    constructor(vd) {
        this.vd = vd
        this.emmiter = new events.EventEmitter();
        this.str = progress({
            drain: true,
            time: 5000 /* ms */
        }, function (progress) {
            console.log(JSON.stringify(progress))
        });

    }

    download() {
        return new Promise(async (resolve, rejects) => {
            var info = await ytdl.getInfo(this.vd);
            var vd_format = ytdl.chooseFormat(info.formats, { filter: format => format.qualityLabel === '1080p' })
            var ad_format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" })

            console.log(vd_format);
            console.log(ad_format);

            var video = ytdl.downloadFromInfo(info, {quality: vd_format.itag})

            this.output = "./tmp/video/" + this.vd + ".mp4";
            this.ad_output = "./tmp/video/" + this.vd + ".mp3";
            this.str.setLength(vd_format.contentLength);

            video
                .pipe(this.str)
                .pipe(fs.createWriteStream(this.output))


        })
    }

    upload() {
        bot.telegram.sendVideo(tg_filestore_id, { source: fs.createReadStream(this.output) })
    }
}


var x = new yt_media("quznZ20CH7M")

x.download()