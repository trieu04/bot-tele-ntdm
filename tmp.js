const {Context, Telegraf, session, Scenes: {WizardScene, BaseScene, Stage }, Markup } = require('telegraf')
const axios = require('axios').default;
const process = require('process');
const os = require("os");
require('dotenv').config();

const ntdm_api = axios.create({
    baseURL: 'http://api.quoctrieudev.com/',
    params: { access_key: "1111" },
    data: {access_key: "1111"},
    headers: { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
});
const eol = os.EOL;
// Telegram
const token = process.env.BOT_TOKEN
const report_id = process.env.REPORT_ID
const admin_id = process.env.ADMIN_ID
var tele_id;

const opps = "Opps...\nĐã xảy ra lỗi gì đó!\nChúng tôi sẽ sớm sửa lại.\nLiên hệ @quoctrieudev";

const videoScene = new BaseScene("video");
videoScene.enter(ctx => {
    ctx.reply("Nhập tên video")
})
videoScene.on("text", async ctx => {
    message = await ctx.reply(ctx.message.text)
    ctx.session.video = ctx.message.text
    ctx.reply(reply, {
        reply_markup: {
            inline_keyboard: [
                { text: 1, callback_data: "video_1" }
            ]
        }
    })

})
videoScene.action("video_1", ctx => {
    ctx.answerCbQuery();
    ctx.reply("video 1");
})
videoScene.leave(ctx => {
    ctx.reply("Video name is set: " + ctx.session.message.text);
    delete ctx.session.video;
})
const stage = new Stage([videoScene])
stage.command("cancel", ctx => ctx.scene.leave())

const bot = new Telegraf(token)

bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => {
    if (ctx.chat && ctx.chat.hasOwnProperty("id")) {
        tele_id = ctx.chat.id;
    }
    else bot.stop();
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
                ],
                [
                    {
                        text: "Fanpage",
                        url: "https://facebook.com/FayeRelax"
                    },
                    {
                        text: "My Group",
                        url: "https://facebook.com/groups/nknhh"
                    }
                ]
            ]
        }
    })
})
bot.command("admin", ctx => {
    if (tele_id != admin_id) return;
    reply = system_check();
    ctx.telegram.sendMessage(ctx.message.chat.id, reply, {
        reply_markup: {
            keyboard: [
                [
                    { "text": "/admin" }
                ],
                [
                    { "text": "/system" },
                    { "text": "/uptime" }
                ],
                [
                    { "text": "/givekey" },
                    { "text": "/keywarp" }
                ]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true,
        }
    })
})

// SYSTEM
bot.command("system", (ctx) => {
    reply = system_check();
    ctx.reply(reply)
})
bot.command("uptime", ctx => {
    reply = "Process Uptime: " + secondsToDhms(process.uptime());
    ctx.reply(reply);
})
bot.command("keywarp", async ctx => {
    ctx.reply("Đang tìm kiếm")
    res = await ntdm_api.post("/key.php/warp/foruser", { "tele_id": tele_id }).catch((e) => {
        handingAxiosError(e, "POST: http://api.quoctrieudev.com/key.php/warp/foruser");
        ctx.reply(":((\nĐã xảy ra lỗi - Không thể kết nối tới máy chủ.\nVui lòng thử lại!")
    });
    if (!res) return;
    if (res.data.exist_key) {
        if (res.data.exist_tele_id) {
            ctx.reply(""
                + "Có vẻ như bạn đã yêu cầu nhận key trước đó rồi\n"
                + "Vì số lượng key có hạn nên mỗi người chỉ được nhận một key thôi nha\n"
                + "Dưới đây là key đã gửi:"
            )
            ctx.reply(res.data.license)
        }
        else {
            ctx.reply("Key của bạn đây");
            ctx.reply(res.data.license);
            ctx.reply("Thi thoảng hãy ủng hộ web FayeDark.com bằng 1 click quảng cáo để tụi mình duy trì kinh phí hoạt động nha :33");
        }
    }
    else {
        ctx.reply("Hmmmm\n"
            + "Hiện tại key đã hết mất rồi\n"
            + "Hãy thử lại sau nha");
    }
})
bot.command("givekey", async ctx => {
    if (tele_id != admin_id) return;
    ctx.reply("Đang tìm kiếm")
    res = await ntdm_api.get("/key.php/warp/foruser", { "params": { "manual": true } }).catch((e) => {
        handingAxiosError(e, "POST: http://api.quoctrieudev.com/key.php/warp/foruser");
        ctx.reply(":((\nĐã xảy ra lỗi - Không thể kết nối tới máy chủ.")
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
})
bot.command("video", ctx => {
    ctx.scene.enter("video")
})

bot.command("sendreport", ctx => {
    msg = ctx.message.text.replace(/^\/(\S+)(\s+)?/, "")
    if (msg) {
        msg = ": " + msg
    }
    else { msg = "!" }
    bot.telegram.sendMessage(report_id, "Report from id " + ctx.chat.id + msg);
})
bot.command("opps", ctx => {
    ctx.reply(opps)
});
bot.command("ntdm", ctx => {
    ctx.reply("TQT")
})
bot.command("id", ctx => {
    if (tele_id) ctx.reply(tele_id)
})
bot.command("detail", (ctx) => {
    ctx.reply(ctx.chat);
})

bot.catch(e => {console.log("Catch:"); console.log(e);})

// Function
function handingAxiosError(error, pre = "") {
    msg = "Axios Error: " + pre + eol;
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // (error.responsendMessagese.data);
        msg += error.response.status + eol;
        msg += error.response.headers;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        msg += "No response was received";
        //(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        msg += (error.message);
    }
    console.log(msg)
    bot.telegram.sendMessage(report_id, msg)
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
        var sDisplay = s > 0 ? s + "s" : "";
    }
    else {
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
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
        + `CPU Usage: ${perc}%`
}

// Cron job
var CronJob = require('cron').CronJob;
var job = new CronJob('0 0,12 * * *', function () {
    var date = new Date();
    var msg = date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN") + eol + eol
        + system_check();
    console.log(msg);
    bot.telegram.sendMessage(admin_id, "" + msg);
}, null, true, 'Asia/Ho_Chi_Minh');


bot.launch();
job.start();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))