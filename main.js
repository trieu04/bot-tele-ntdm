const { Context, Telegraf, session, Scenes: { WizardScene, BaseScene, Stage }, Markup, Telegram } = require('telegraf')

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

const speed = require(`performance-now`);

const DEV_MODE = process.env.MODE == "dev" ? true : false;
const inHeroku = (() => {if (process.env._ && process.env._.indexOf("heroku") !== -1) return true; else return false})();

const ntdm_api = axios.create({
    baseURL: 'http://api.quoctrieudev.com/v1',
    params: { nttoken: "ffffffff" },
    data: { nttoken: "ffffffff" },
    headers: { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
});
const opps = () => { return "Opps...\nĐã xảy ra lỗi gì đó!\nChúng tôi sẽ sớm sửa lại.\nLiên hệ @quoctrieudev"; }
const lf = os.EOL;


// Telegram
const token = DEV_MODE ? process.env.BOT_DEV_TOKEN : process.env.BOT_TOKEN
const tg_report_id = process.env.TG_GROUP_REPORT
const tg_admin_id = process.env.TG_ADMIN
const tg_filestore_id = process.env.TG_GROUP_FILE
const tg_id_block_list = []

var tele_id;
var update_id;

const bot = new Telegraf(token);


// const stage = new Stage([videoScene]);
// stage.command("cancel", ctx => ctx.scene.leave());

// bot.use(session());
// bot.use(stage.middleware());
bot.use((ctx, next) => {
    if (ctx.message && ctx.message.chat) {
        tele_id = ctx.message.from.id;
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
                [{ "text": "/help" }]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true,
        }
    })
})
bot.help(ctx => {
    if (tele_id == tg_admin_id) {
        var reply = ""
            + "_Faye Bot V1.1_" + lf
            + "/help - Danh sách lệnh" + lf
            + "/process" + lf
            + "/system" + lf
            + "/uptime" + lf + lf
            + "/givekey" + lf
            + "/keywarp" + lf + lf
            + "/detail" + lf
        ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
            reply_markup: {
                keyboard: [
                    [
                        { "text": "/system" },
                        { "text": "/process" }
                    ],
                    [
                        { "text": "/givekey" },
                        { "text": "/keywarp" }
                    ],
                    [
                        { "text": "/sendreport" },
                        { "text": "/sendmessage" }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
            parse_mode: "Markdown"
        });
    }
    else {
        var reply = ""
            + "Sau đây là các lệnh bạn có thể thực hiện với Faye Bot\n\n"
            + "➪ /help Lấy danh sách các lệnh được hỗ trợ\n"
            + "➪ /keywarp Nhận key warp+ miễn phí\n"
            + "➪ /info Thông tin Bot\n"

        ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🌐 Website: FayeDark.com", url: "https://www.fayedark.com" }
                    ],
                    [
                        { text: "Fanpage", url: "https://facebook.com/FayeRelax" },
                        { text: "My Group", url: "https://facebook.com/groups/nknhh" }
                    ],
                    [
                        { text: "Ủng hộ chúng tôi! 💖", url: "https://www.fayedark.com/p/ung-ho-chung-toi.html" }
                    ]
                ]
            }
        });
    }
})
bot.command('info', ctx => {
    var repl_text = "<b>Faye Bot Verson 1.1</b>" + lf
        + "<i>Date Updated:</i> 23/03/2022" +lf
        + "@QuocTrieudev";
    ctx.reply(repl_text, {parse_mode: "HTML"});
})

bot.command("system", (ctx) => {
    ctx.reply(system_check(), { parse_mode: 'Markdown' })
})
bot.command("uptime", ctx => {
    reply = "Process Uptime: " + secondsToDhms(process.uptime());
    ctx.reply(reply);
})
bot.command("process", async ctx => {
    const reply_text = await process_check();
    bot.telegram.sendMessage(ctx.chat.id, reply_text, { parse_mode: 'Markdown' })
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
    const reply = await ctx.reply("Đang tìm kiếm")
    const res = await ntdm_api.get("/cfwarp/key/give").catch((e) => {
        var err = handingAxiosError(e, "GET: http://api.quoctrieudev.com/cfwarp/key/give");
        ctx.reply(":((\nĐã xảy ra lỗi - Với máy chủ.");
        send_report(err, { chat: ctx.message });
    });
    if (!res) return;
    if (res.status == 200 && Array.isArray(res.data)) {
        if (res.data.length != 0) {
            const repl_text = "Đã lấy 1 key: \n" +
                JSON.stringify(res.data[0]);
            bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, repl_text);
            ctx.reply(res.data[0].license_key);
        }
        else {
            const repl_text = "Hết key rồi :)";
            bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, repl_text);
        }
    }
    else {
        const repl_text = "Đã xảy ra lỗi gì đó"
            + "status: " + res.status + "\n"
            + "data(JSON): " + JSON.stringify(res.data);
        bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, repl_text);
    }

});


bot.command("keywarp", async ctx => {
    const reply = await ctx.reply("Đang tìm kiếm");
    const res = await ntdm_api.get("cfwarp/key/list", { params: { "cond": `["telegram_id_owner","=","${tele_id}"]`, 'cols': 'id,license_key' } }).catch((e) => {
        var err = handingAxiosError(e);
        bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, ":((\nĐã xảy ra lỗi - Đã có lỗi khi kết nối tới máy chủ.\nVui lòng thử lại sau!");
        send_report(err, { chat: ctx.message });
    });
    if (!res) return;
    if (res.status == 200 && Array.isArray(res.data)) {
        if (res.data.length > 1) {
            var repl_text_2 = ""
                + "Bạn đã yêu cầu nhận key trước đó rồi\n"
                + "Mỗi người chỉ được nhận 2 key thôi nha, muốn thêm ib tui :>\n"
                + "Key CloudFlare Warp đã gửi:\n"
                + '`' + res.data[0].license_key + '`\n'
                + '`' + res.data[1].license_key + '`\n'
            bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, repl_text_2, { parse_mode: "Markdown" });
        }
        else {
            const res_2 = await ntdm_api.put("cfwarp/key/give", { 'telegram_id': tele_id }).catch((e) => {
                var err = handingAxiosError(e);
                bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, ":((\nĐã xảy ra lỗi - Đã có lỗi khi kết nối tới máy chủ.\nVui lòng thử lại sau!");
                send_report(err, { chat: ctx.message });
            });
            if (!res_2) return;
            if (res_2.status == 200 && Array.isArray(res_2.data)) {
                if (res_2.data.length == 0) {
                    ctx.reply("Hmmmm\n"
                        + "Hiện tại key đã hết mất rồi\n"
                        + "Hãy thử lại sau nha");
                    send_report(`Hết Key | Yêu cầu từ ID ${ctx.from.id}`);
                }
                else {
                    bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, "Đã Xong!\nKey CloudFlare Warp của bạn đây nhé:");
                    ctx.reply(res_2.data[0].license_key);
                }
            }
            else {
                bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, ":((\nĐã xảy ra lỗi với máy chủ.\nVui lòng thử lại sau!");
                send_report(`Lỗi API`,
                    {
                        'more':
                        {
                            'status': res_2?.status,
                            'data': res_2?.data,
                            'config': res_2?.config
                        }
                    }
                );
            }

        }
    }
    else {
        bot.telegram.editMessageText(reply.chat.id, reply.message_id, undefined, ":((\nĐã xảy ra lỗi với máy chủ.\nVui lòng thử lại sau!");
        send_report(`Lỗi API`,
            {
                'more':
                {
                    'status': res_2?.status,
                    'data': res_2?.data,
                    'config': res_2?.config
                }
            }
        );
    }

    // if (res.data.exist_key) {
    //     if (res.data.exist_tele_id) {
    //         ctx.reply(""
    //             + "Có vẻ như bạn đã yêu cầu nhận key trước đó rồi\n"
    //             + "Vì số lượng key có hạn nên mỗi người chỉ được nhận một key thôi nha\n"
    //             + "Dưới đây là key đã gửi:"
    //         )
    //         ctx.reply(res.data.license);
    //     }
    //     else {

    //         ctx.reply("Key của bạn đây");
    //         ctx.reply(res.data.license);
    //         // ctx.reply("Thi thoảng hãy ủng hộ web FayeDark.com bằng 1 click quảng cáo để tụi mình duy trì kinh phí hoạt động nha :33");
    //     }
    // }
    // else {

    // }
});

bot.command("sendreport", ctx => {
    var detail = String()
        + "Report from id: " + ctx.message.chat.id + lf
        + "Date: " + moment(ctx.message.date * 1000).utcOffset(420).format("YYYY-MM-D hh:mm:ss Z") + lf;
    var content = "";
    var rp_content = ctx.message.text.replace(/^\/(\S+)(\s+)?/, "");
    if (rp_content) {
        content += "NỘI DUNG" + lf
            + rp_content + lf
            + "----------" + lf
    }
    if (ctx.message.reply_to_message) {
        content += "NỘI DUNG TỪ TRẢ LỜI TIN NHẮN" + lf
        + ctx.message.reply_to_message.text + lf
        + "----------" + lf;
    }
    if(content){
        detail += content + lf + JSON.stringify(ctx.message);
        bot.telegram.sendMessage(tg_report_id, detail);

        ctx.reply("Báo cáo đã được gửi đi" + lf + content);
    }
    else {
        ctx.reply("Vui lòng nhập nội dung cần báo cáo sau câu lệnh hoặc trả lời tin nhắn chứa nội dung");
    }

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
    msg = "Axios Error: " + pre + lf;
    if (error.response) {
        var error_data = {
            "status:": error.response.status,
            "data": error.response.data,
            "config": {
                "baseURL": error.config.baseURL,
                "url": error.config.url,
                "params":error.config.params,
            }
        }
        if(error.config.data){ error_data.config.data = error.config.data}
        msg = JSON.stringify(error_data);
    }
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
        + "_SYSTEM CHECK_ \n"
        + "*System Uptime:* " + secondsToDhms(os.uptime()) + lf
        + `*RAM Usage:* ${ram_used}MB / ${ram_total}MB, ${Math.round(10000 * ram_used / ram_total) / 100}%` + lf
        + `*CPU Usage:* ${perc}%` + lf;
}
async function process_check() {
    const stats = await pidusage(process.pid)
    return String()
        + "_PROCESS CHECK_ \n"
        + "*PID:* " + stats.pid + lf
        + "*PPID:* " + stats.ppid + lf
        + "*CPU:* " + (Math.round(stats.cpu * 100) / 100) + "%" + lf
        + "*RAM:* " + Math.round(stats.memory / 1024 / 1024) + "MB" + lf
        + "*Elapsed:* " + secondsToDhms(stats.elapsed / 1000) + lf
        + "*Start:* " + moment(stats.timestamp).utcOffset(420).format("YYYY-MM-D hh:mm:ss Z") + lf;
}


function send_report(msg, option) {
    option = Object.assign(
        {},
        {
            date_time: (new Date()).toDateString(),
            report_id: tg_report_id,
            chat: null,
            more: null
        },
        option
    );
    msg = String()
        + option.date_time + lf
        + msg + lf + lf
        + (option.chat ? JSON.stringify(option.chat) + lf : "")
        + (option.more ? JSON.stringify(option.more) + lf : "");
    bot.telegram.sendMessage(option.report_id, msg);
}

// Cron job
const list_cron = new Array();

if(inHeroku){
    list_cron.push(
        new CronJob(
            '*/20 * * * *',
            function () {
                if (process.env.IDLING != "1") {
                    axios.get(process.env.APP_BASE_URL + "/awake");
                    process.env.IDLING = "1"
                }
            },
            null, true
        )
    )
}

// Start app for heroku

const app = express()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => { res.send("QuocTrieuIT") })
app.post('/telegram:ntdm', (req, res) => {
    if (req.body.update_id > update_id) {
        bot.handleUpdate(req.body, res)
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
    if (!DEV_MODE && inHeroku) {
        bot.telegram.setWebhook("https://bot-tele-ntdm.herokuapp.com/telegram:ntdm")
            .then(() => console.log("Webhook set to https://bot-tele-ntdm.herokuapp.com/telegram:ntdm"))
            .catch(() => console.error("Unsuccess Webhook set"));
    }

    server.close();
    console.log("Close http server");
    for (const cron of list_cron) { cron.stop(); }
    console.log(`Stop ${ list_cron.length } cron jobs`);
}
process.once('SIGINT', () => {
    bot.stop('SIGINT')
    graceful_stop();
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    graceful_stop();
})
