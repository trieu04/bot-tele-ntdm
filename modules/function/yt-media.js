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

const { resolve, join } = require('path');
const { rejects } = require('assert');

if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp")
class yt_media {
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
			+ (opt.suffix ? opt.suffix + opt.div : "")
			+ (opt.extention ? "." + opt.extention : "")
		return id_dir + "/" + file_name;
	}
}
(async () => {
	var video = new yt_media("RZT2TRvWEsE")
	if(! await video.getInfo()) { }
	fs.writeFileSync("tmp.json", JSON.stringify(video.info))
	video.status.on("progress", (p) => {
		console.log(JSON.stringify(p))
	});
	video.status.on("done", () => {
		console.log("DONE: " + video.output);
	});
	video.get({ type: "audio" })
})()

// if (!video.getInfo()) {
// 	throw new Error("lỗi");
// }
//var file = video.get({ type: "standard" })


