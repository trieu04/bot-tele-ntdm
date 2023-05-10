const config = {
	name: "example",
	version: "1.0",
	hasPermssion: "admin",
	credits: "Trieu04",
	description: "Module example description [for dev]",
	category: "bot",
	usage: "usage",
	cooldowns: 0,
	dependencies: {},
	envConfig: {},
	languages: {
		"vi": {
			"usage": "Cách dùng"
		},
		"en": {
			"usage": "Usage"
		}
	}
};

const run = async function ({ ctx, command: {command_body} }) {
	ctx.reply("I'm Test Module :')")
}

module.exports = {
	config,
	run
}