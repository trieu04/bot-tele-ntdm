const config = {
	name: "info",
	version: "1.0",
	hasPermssion: "all",
	credits: "Trieu04",
	description: "Thông tin bot",
	category: "bot",
	usage: "",
	cooldowns: 10,
	dependencies: {
		"os":"",
	},
	envConfig: {},
	languages: {
		"vi": {
			"version": "Phiên bản"
		},
		"en": {
			"version": "version"
		}
	}
};

const { Telegraf } = require("telegraf");
const bot = new Telegraf()
const Text = require("../../includes/utils/text")
const os = require("os")

const text = new Text(config.languages)
text.setLangcode("vi")
const client = globalThis.client

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

const run = async function ({ ctx, command: {command_body} }) {
	const chatID = ctx.update.message.chat.id
	if(["system", "sys"].includes(command_body)){
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

		var repl_text = ""
			+ "_SYSTEM CHECK_ \n"
			+ "*System Uptime:* " + secondsToDhms(os.uptime()) + "\n"
			+ `*RAM Usage:* ${ram_used}MB / ${ram_total}MB, ${Math.round(10000 * ram_used / ram_total) / 100}%\n`
			+ `*CPU Usage:* ${perc}%\n`;
		return ctx.reply(repl_text, {parse_mode: "Markdown"});
	}
	
	else if(["gettext"].includes(command_body.toLowerCase())){
		var repl_text = "*Get Text* " + text.get("version") + " 1.1"
		ctx.reply(repl_text, {parse_mode: "Markdown"});		
	}
	else{	
		
		var repl_text = `<b>Faye Bot Verson ${client.version}</b>\n`
			+ "<i>Date Updated:</i> 23/03/2022\n"
			+ "@QuocTrieudev";
		ctx.reply(repl_text, {parse_mode: "HTML"});		
	}

}

module.exports = {
	config,
	run
}