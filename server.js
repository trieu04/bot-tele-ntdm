const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup } = require('telegraf')

const process = require('process');
const fs = require('fs');
const os = require("os");
const events = require('events');
require('dotenv').config();
const pidusage = require('pidusage');
const moment = require('moment')
const CronJob = require('cron').CronJob;

const axios = require('axios').default;
const mysql = require('mysql')

const progress = require('progress-stream');
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const randomEmoji = require('random-emoji');


const DEV_MODE = process.env.MODE == "dev" ? true : false;

const ntdm_api = axios.create({
    baseURL: 'http://api.quoctrieudev.com/',
    params: { access_key: "1111" },
    data: { access_key: "1111" },
    headers: { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
});
const opps = () => { return "Opps...\nĐã xảy ra lỗi gì đó!\nChúng tôi sẽ sớm sửa lại.\nLiên hệ @quoctrieudev"; }
const eol = os.EOL;
// Telegram
const token = DEV_MODE ? process.env.BOT_DEV_TOKEN : process.env.BOT_TOKEN
const tg_report_id = process.env.TG_GROUP_REPORT
const tg_admin_id = process.env.TG_ADMIN
const tg_filestore_id = process.env.TG_GROUP_FILE

var tele_id;
var update_id;

const bot = new Telegraf(token)

// // MySQL Database
// const mysqlc = mysql.createConnection({
//     host: 'free01.123host.vn',
//     user: 'quoctrie',
//     password: '0fCoDEABM1wz3uE',
//     database: 'quoctrie_faye'
// })
// mysqlc.connect();

const yt_media = class {
    constructor(video_id) {

        this.id = video_id
        this.status = new events.EventEmitter()
        this.output;
        this.root_tmp = "./tmp/yt-media"

        if (!fs.existsSync(this.root_tmp)) fs.mkdirSync(this.root_tmp)
    }

    async getInfo() {
        this.info = await ytdl.getInfo(this.id).catch((err) => console.log("ytdl: Error: ", err.message))
        if (typeof this.info === "undefined") return false;
        return this.info;
    }

    get(option) {
        switch (option.type) {
            case "standard":
                var format = ytdl.chooseFormat(this.info.formats, { quality: "highest" })
                this.file = ytdl.downloadFromInfo(this.info, { quality: format.itag, dlChunkSize: 0 })
                var str = progress({
                    time: 1000,
                    length: format.contentLength
                }, (progress) => { this.status.emit("progress", progress) })

                var output = this.dir_make({ extention: format.container })
                this.output = output;

                fs.writeFileSync(this.dir_make({ suffix: "std", extention: "json" }), JSON.stringify(format, null, 4))
                this.file.pipe(str).pipe(fs.createWriteStream(output))
                this.file.on("end", () => { this.status.emit("done") })
                break;
            case "audio":
                var format = ytdl.chooseFormat(this.info.formats, { quality: "highestaudio" })
                this.file = ytdl.downloadFromInfo(this.info, { quality: format.itag, dlChunkSize: 0 })
                var str = progress({
                    time: 1000,
                    length: format.contentLength
                }, (progress) => { this.status.emit("progress", progress) })

                this.output = this.dir_make({ suffix: "audio", extention: format.container })

                fs.writeFileSync(this.dir_make({ extention: "json" }), JSON.stringify(format, null, 4))
                this.file.pipe(str).pipe(fs.createWriteStream(this.output))
                this.file.on("end", () => {
                    this.status.emit("done")
                })
                break;
            case undefined:
                throw new Error("yt_media: Error: option.type must be set")
        }
    }
    dir_make(option) {
        var opt = Object.assign({
            id: this.id,
            name: "main",
            prefix: undefined,
            suffix: undefined,
            div: "~",
            extention: undefined,
        }, option)

        var id_dir = this.root_tmp + "/" + opt.id;
        if (!fs.existsSync(this.root_tmp)) fs.mkdirSync(this.root_tmp)
        if (!fs.existsSync(id_dir)) fs.mkdirSync(id_dir)
        var file_name = ""
            + (opt.prefix ? opt.prefix + opt.div : "")
            + opt.name
            + (opt.suffix ? opt.div + opt.suffix : "")
            + (opt.extention ? "." + opt.extention : "")
        return id_dir + "/" + file_name;
    }
}
// File
if (!fs.existsSync('./tmp')) fs.mkdirSync("./tmp")



// Scense
const videoScene = new BaseScene("video");
var video_markup_btn = {};
video_markup_btn.nav = [
    { text: "🔎Tìm lại", callback_data: "video:search.researh" },
    { text: "❌Hủy bỏ", callback_data: "video:search.cancel" }
]
videoScene.enter(ctx => {
    ctx.reply("Nhập tên video")
})
videoScene.command("cancel", ctx => ctx.scene.leave())
videoScene.on("text", async ctx => {
    var message = await ctx.reply(`Đang tìm ${ctx.message.text}`)

    var search_string = ctx.message.text;
    ctx.session.video = {}
    ctx.session.video.message = message
    ctx.session.video.mess_id = [message.chat.id, message.message_id]

    var opts = {
        maxResults: 5,
        key: process.env.GOOGLE_API_KEY,
        type: "video"
    };
    var ytsearch = await search(search_string, opts).catch(() => { error("axios_error", { host: "api.google.com" }) });
    if (!ytsearch) {
        ctx.reply(":((\nKhông thể kết nối tới Youtube lúc này. Hãy đợi một chút và thử lại!");
        ctx.scene.leave();
        return
    }
    var ytsr = ytsearch.results;
    ctx.session.video.results = ytsr;
    reply = "Kết quả cho: " + search_string + eol;
    btn = [[], []];
    for (i in ytsr) {
        reply += `\n${1 + Number(i)}. ${ytsr[i].title}`;
        btn[0].push({ text: `${1 + Number(i)}`, callback_data: `video:search.selectID=${ytsr[i].id}` })
    }
    btn[1] = [
        { text: "🔙 Trở về", callback_data: "video:search.return" },
        { text: "🔎 Tìm lại", callback_data: "video:search.researh" },
        { text: "❌ Hủy bỏ", callback_data: "video:search.cancel" },
    ]
    ctx.telegram.editMessageText(message.chat.id, message.message_id, null, reply)
    ctx.telegram.editMessageReplyMarkup(message.chat.id, message.message_id, null, JSON.stringify({
        inline_keyboard: btn
    })
    )

})
videoScene.action(/^video:/, async ctx => {
    var nav = String(ctx.match.input);
    console.log(nav);
    if (/^video:search\.selectID=\w+/.test(nav)) {
        const yt_id = nav.split("=", 2)[1];
        var message = ctx.session.video.message;
        ctx.telegram.editMessageText(message.chat.id, message.message_id, null, `Đang tải video...`)
        ctx.telegram.editMessageReplyMarkup(message.chat.id, message.message_id, null, JSON.stringify({
            inline_keyboard: [
                [
                    { text: "❌Hủy bỏ", callback_data: "video:download.cancel" }
                ]
            ]
        }));

        var f = new yt_media(yt_id)
        if (! await f.getInfo()) { ctx.reply("Đã xảy ra lỗi"); return; }
        f.status.on("progress", (progress) => {
            var msg = ""
                + f.info.videoDetails.title + eol + eol
                + JSON.stringify(progress, null, 4)
            ctx.telegram.editMessageText(message.chat.id, message.message_id, null, msg).catch(e => console.log(e.message))
        });
        f.status.on("done", () => {

            ctx.telegram.editMessageText(message.chat.id, message.message_id, null, "Done, Upload to telegram!")

            var stat = fs.statSync(f.output);
            var s = progress({
                length: stat.size,
                time: 1000 /* ms */
            }, function (progress) {
                var msg = ""
                    + "Upload" + eol + eol
                    + JSON.stringify(progress, null, 4)
                ctx.telegram.editMessageText(message.chat.id, message.message_id, null, msg).catch(e => console.log(e.message))
            });

            var upload_file = fs.createReadStream(f.output)

            bot.telegram.sendVideo(tg_filestore_id, { source: upload_file, filename: f.output })

        });
        f.get({ type: "standard" })

    }

    if (/^video:search\.return/.test(nav)) {

    }
    ctx.answerCbQuery();

})
videoScene.leave(ctx => {
    delete ctx.session.video;
})

function tg_upload(option) {

}


const stage = new Stage([videoScene])
stage.command("cancel", ctx => ctx.scene.leave())

bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => {
    if (ctx.message && ctx.message.chat) {
        tele_id = ctx.message.chat.id;
        process.env.IDLING = "0";
    }
    update_id = ctx.update && ctx.update.update_id ? ctx.update.update_id : 0;
    next();
})

// Basic reply
bot.start(ctx => {
    var reply = ""
        + "Xin chào!\n"
        + "Tôi là Faye Bot, Rất vui được trò chuyện cùng bạn. Cùng với FayeDark.com, chúng tôi cố gắng hỗ trợ tất cả mọi người trong những lúc cần thiết. Bạn có thể xem những thứ mà tôi có thể giúp thông qua lệnh /help, đơn giản vậy thôi. Chúc bạn có một ngày tốt lành!\n"
        + "Cám ơn vì đã ghé qua :33\n\n"
        + "Mọi thông tin góp ý xin hãy gửi về @quoctrieudev. Chúng tôi xin ghi nhận ý kiến của bạn để cải thiện nhiều tính năng và thông tin bổ ích hơn nha.";
    ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
        reply_markup: {
            keyboard: [
                [
                    { "text": "/help" }
                ],
                [

                ]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true,
        }
    })
})
bot.help(ctx => {
    if (tele_id == tg_admin_id) {

        var reply = ""
            + "Faye Bot" + eol
            + "/help" + eol
            + "/process" + eol
            + "/system" + eol
            + "/uptime" + eol + eol
            + "/givekey" + eol
            + "/keywarp" + eol + eol
            + "/detail" + eol
        ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
            reply_markup: {
                keyboard: [
                    [
                        { "text": "/system" },
                        { "text": "/uptime" }
                    ],
                    [
                        { "text": "/givekey" },
                        { "text": "/keywarp" }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        });
    }
    else {
        var reply = ""
            + "Sau đây là các lệnh bạn có thể thực hiện với Faye Bot\n\n"
            + "✅ /help Lấy danh sách các lệnh được hỗ trợ\n"
            + "✅ /keywarp Nhận key warp+ miễn phí\n"

        ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🌐 Website: FayeDark.com",
                            url: "https://www.fayedark.com"
                        },
                        {
                            text: "Fanpage",
                            url: "https://facebook.com/FayeRelax"
                        },
                        {
                            text: "My Group",
                            url: "https://facebook.com/groups/nknhh"
                        }
                    ],
                    [
                        {
                            text: "Ủng hộ chúng tôi!",
                            url: "https://www.fayedark.com/p/ung-ho-chung-toi.html"
                        }
                    ]
                ]
            }
        });
    }



})
bot.command("system", (ctx) => {
    reply = system_check();
    ctx.reply(reply)
})
bot.command("uptime", ctx => {
    reply = "Process Uptime: " + secondsToDhms(process.uptime());
    ctx.reply(reply);
})
bot.command("process", async ctx => {
    var reply = await process_check();
    ctx.reply(reply)
})
// ADMIN ZONE
bot.command("stop", ctx => {
    if (tele_id != tg_admin_id) return;
    ctx.reply("Process Stop")
    console.log("Send SIGTERM");
    process.kill(process.pid, "SIGTERM");
});

bot.command("givekey", async ctx => {
    if (tele_id != tg_admin_id) return;
    ctx.reply("Đang tìm kiếm")
    const res = await ntdm_api.get("/key.php/warp/foruser", { "params": { "manual": true } }).catch((e) => {
        var err = handingAxiosError(e, "POST: http://api.quoctrieudev.com/key.php/warp/foruser");
        ctx.reply(":((\nĐã xảy ra lỗi - Với máy chủ.");
        send_report(err, { chat: ctx.message });
    });
    if (!res) return;
    if (res.data.exist_key) {
        ctx.reply(res.data);
        ctx.reply(res.data.license);
        if (!res.data.update) {
            ctx.reply("Cannot update database!");
        }
    }
    else {
        ctx.reply("Hmmmm\n"
            + "Hết key rồi :)\n")
    }
});


bot.command("keywarp", async ctx => {
    ctx.reply("Đang tìm kiếm")
    const res = await ntdm_api.post("/key.php/warp/foruser", { "tele_id": tele_id }).catch((e) => {
        var err = handingAxiosError(e, "POST: http://api.quoctrieudev.com/key.php/warp/foruser");
        ctx.reply(":((\nĐã xảy ra lỗi - Đã có lỗi khi kết nối tới máy chủ.\nVui lòng thử lại sau!");
        send_report(err, { chat: ctx.message });
    });
    if (!res) return;
    if (res.data.exist_key) {
        if (res.data.exist_tele_id) {
            ctx.reply(""
                + "Có vẻ như bạn đã yêu cầu nhận key trước đó rồi\n"
                + "Vì số lượng key có hạn nên mỗi người chỉ được nhận một key thôi nha\n"
                + "Dưới đây là key đã gửi:"
            )
            ctx.reply(res.data.license);
        }
        else {
            ctx.reply("Key của bạn đây");
            ctx.reply(res.data.license);
            // ctx.reply("Thi thoảng hãy ủng hộ web FayeDark.com bằng 1 click quảng cáo để tụi mình duy trì kinh phí hoạt động nha :33");
        }
    }
    else {
        ctx.reply("Hmmmm\n"
            + "Hiện tại key đã hết mất rồi\n"
            + "Hãy thử lại sau nha");
    }
})

bot.command("video", async ctx => {
    return;
    var main = ctx.message.text.replace(/^\/(\S+)(\s+)?/, "").trim()
    if (main.length == 11) {
        var info = await ytdl.getInfo(main);
        if (typeof info === "undefined") { ctx.reply("Đã xảy ra lỗi!"); return; }
        var format = ytdl.chooseFormat(info.formats, { quality: "highest" })
        ctx.reply(format.url)
        // const video = ytdl.downloadFromInfo(info, {quality: format.itag})
        // ctx.reply(`Đang tải ${info.videoDetails.title}`)
        // // video.pipe(`./tmp/YT|${ info.videoDetails.videoId }|standard.${format.container}`)
        // ctx.replyWithVideo({source: video})

        // if (format.contentLength < 20 * 1024 * 1024) {
        //     const url = String(format.url)
        //     ctx.replyWithVideo(url)
        //     // { url: url, filename: `YT|${ info.videoDetails.videoId }|standard.${format.container}` }
        // }
        return;
    }
    ctx.scene.enter("video")
})

bot.command("sendreport", ctx => {
    var rp_content = ctx.message.text.replace(/^\/(\S+)(\s+)?/, "");
    var detail = String()
        + "Report from id: " + ctx.message.chat.id + eol
        + "Date: " + moment(ctx.message.date).zone("+07:00").format("YYYY-MM-D hh:mm:ss Z") + eol
    if (rp_content) {
        detail += "----CONTENT----" + eol
            + rp_content + eol
            + "---------" + eol
    } else{
        detail += "Content: Empty" + eol;
    }
    if(ctx.message.reply_to_message){
        detail += "----RP_REPLY_CONTENT----" + eol
        + ctx.message.reply_to_message + eol
        + "---------" + eol
    }
    bot.telegram.sendMessage(tg_report_id, detail);
    ctx.reply("The report has been sent");
});

bot.command("opps", ctx => {
    ctx.reply(opps())
});

bot.command("ntdm", ctx => {
    ctx.reply("TQT")
});

bot.command("detail", (ctx) => {
    ctx.reply(JSON.stringify(ctx.message, null, 4));
});

bot.catch(e => {
    var message = ["Bot Catch: ", e.toString(), e.stack.split("\n").slice(0, 4).join("\n")].join();
    console.error(message);

})
bot.launch();

// Bot Function
function handingAxiosError(error, pre = "") {
    msg = "Axios Error: " + pre + eol;
    if (error.response) { msg += "status " + error.response.status; }
    else if (error.request) {
        msg += "No response was received";
        //(error.request);
    }
    else { msg += (error.message); }
    return msg;
}
function secondsToDhms(seconds, short = true) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    if (short) {
        var dDisplay = d > 0 ? d + "d " : "";
        var hDisplay = h > 0 ? h + "h " : "";
        var mDisplay = m > 0 ? m + "m " : "";
        var sDisplay = s + "s"
    }
    else {
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s + (s <= 1 ? " second" : " seconds");
    }

    return dDisplay + hDisplay + mDisplay + sDisplay;
}
function system_check() {
    //CPU
    const cpus = os.cpus();
    const cpu = cpus[0];
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 1000;
    const perc = Math.round(currentCPUUsage / total * 10) / 100;

    // RAM
    ram_total = Math.round(os.totalmem() / 1000000)
    ram_used = ram_total - Math.round(os.freemem() / 1000000)

    return ""
        + "System Uptime: " + secondsToDhms(os.uptime()) + eol
        + `RAM Usage: ${ram_used}MB / ${ram_total}MB, ${Math.round(10000 * ram_used / ram_total) / 100}%` + eol
        + `CPU Usage: ${perc}%` + eol;
}
async function process_check() {
    const stats = await pidusage(process.pid)
    return String()
        + "PID: " + stats.pid + eol
        + "PPID: " + stats.ppid + eol
        + "CPU: " + (Math.round(stats.cpu * 100) / 100) + "%" + eol
        + "RAM: " + Math.round(stats.memory / 1024 / 1024) + "MB" + eol
        + "Elapsed: " + secondsToDhms(stats.elapsed / 1000) + eol
        + "Start: " + moment(stats.timestamp).format("YYYY-MM-D hh:mm:ss Z") + eol;
}


function send_report(msg, option) {
    option = Object.assign(
        {},
        {
            date_time: date(),
            report_id: tg_report_id,
            chat: null,
        },
        option
    );
    msg = String()
        + option.date_time + eol
        + msg + eol + eol
        + (option.chat ? JSON.stringify(option.chat) + eol : "");
    bot.telegram.sendMessage(option.report_id, msg);
}

// Cron job
const sys_report = new CronJob('0 0,12 * * *',
    async function () {
        var msg = moment().zone("+07:00").format("YYYY-MM-D hh:mm:ss Z") + eol + "PROCESS\n" + (await process_check()) + "SYSTEM\n" + system_check();
        bot.telegram.sendMessage(tg_report_id, "" + msg);
    },
    null, true,
    'Asia/Ho_Chi_Minh'
);

const dậy_đi = new CronJob(
    "4 30 * * *",
    function () {
        var msg1 = "4h30 rồi, dậy đi";
        var msg2 = "Chúc cậu một ngày tốt lành " + randomEmoji.random({count: 1})[0];
        bot.telegram.sendMessage(1455276034, msg1);
        bot.telegram.sendMessage(1455276034, msg2);
    },
    null, true,
    'Asia/Ho_Chi_Minh'
);

const keep_awake = new CronJob(
    '*/20 * * * *',
    function () {
        if (process.env.IDLING != "1") {
            axios.get(process.env.APP_BASE_URL + "/awake");
            process.env.IDLING = "1"
        }
        else {
            keep_awake.stop()
        }
    },
    null, true
);

// Start app for heroku
const express = require('express')
const body_parser = require("body-parser");
const { json } = require('express');
const app = express()
app.use(express.static('public'))
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.get('/', (req, res) => { res.send("QuocTrieuIT") })
app.post('/telegram:ntdm', (req, res) => {
    if (req.body.update_id > update_id) {
        bot.handleUpdate(req.body, res)
            .then()
            .catch(() => res.status(500).send())
    }
    else {
        res.status(200).send()
    }
})
app.get('/telegram:ntdm', (req, res) => res.send("Ok"))
app.all("/ping", (req, res) => res.status(200).send("OK"))
app.all("/request", (req, res) => res.status(200).send())
app.get('/awake', (req, res) => res.status(200).send("Waked"))

// Start http server
const server = app.listen(process.env.PORT || 3000, () => console.log('Server is running...'))

// graceful stop
function graceful_stop() {
    console.log("Stopping...");
    if (!DEV_MODE) {
        bot.telegram.setWebhook("https://bot-tele-ntdm.herokuapp.com/telegram:ntdm")
            .then(() => console.log("Webhook set to https://bot-tele-ntdm.herokuapp.com/telegram:ntdm"))
            .catch(() => console.error("Unsuccess Webhook set"));
    }

    server.close();
    console.log("Close http server");
    keep_awake.stop();
    sys_report.stop();
    dậy_đi.stop();
    console.log("Stop cron jobs");
}
process.once('SIGINT', () => {
    bot.stop('SIGINT')
    graceful_stop();
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    graceful_stop();
})
