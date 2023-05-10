const { Telegraf } = require("telegraf");
const bot = new Telegraf()

const config = {
	name: "hello",
	version: "1.0.1",
	hasPermssion: "all",
	credits: "Trieu04",
	description: "description",
	category: "hello",
	usage: "usage",
	cooldowns: 0,
	dependencies: {},
	envConfig: {},
	languages: {
	"vi": {
		"description": "Sử dụng để chào bot",
		"usage": "/hello"
	},
	"en": {
		"description": "Use to hello bot",
		"usage": "/hello"	
	}
}
};

const run = async function ({ ctx, command: {command_body} }) {
	const chatID = ctx.update.message.chat.id
	var reply = command_body + "\nHello " + ctx.update.message.from.first_name + "!"
	ctx.telegram.sendMessage(chatID, reply)
}

module.exports = {
	config,
	run
}