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
    reply = "Kết quả cho: " + search_string + lf;
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
                + f.info.videoDetails.title + lf + lf
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
                    + "Upload" + lf + lf
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