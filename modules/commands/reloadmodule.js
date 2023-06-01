const { Telegraf } = require("telegraf");
const bot = new Telegraf()

const config = {
	name: "reloadmodule",
    short_name: "rlm",
	version: "1.0",
	hasPermssion: "admin",
	credits: "Trieu04",
	description: "Reload Module",
	category: "system",
	usage: "usage",
	dependencies: {},
	envConfig: {},
	languages: {
		"vi": {
			"usage": "<code>/reloadmodule</code> Reload tất cả module\n<code>/reloadmodule + [tên module]</code> Chỉ Reload [tên module]",
			"success_reload_module": "Reload Thành công module <b>{{0}}</b>",
			"fail_reload_module": "Reload Thất bại Module <b>{{0}}</b>",
			"syntax_error": "Lỗi cú pháp!"
		},
		"en": {
			"usage": "<code>/reloadmodule</code> Reload all module\n<code>/reloadmodule + [module name]</code> Reload only [module name]",
			"success_reload_module": "Success reload module <b>{{0}}</b>",
			"fail_reload_module": "Fail reload module <b>{{0}}</b>",
			"syntax_error": "Syntax error!"
		}
	}
};

const Text = require("../../includes/utils/text")
const text = new Text(config.languages)

const run = async function ({ ctx, command: {command_body} }) {
	var reply = ""
    const loadModule = require(globalThis.client.mainPath + "/includes/main/load-modules")
	if(command_body){
		if(command_body.indexOf(" ") == -1){
			const x = loadModule(true, command_body)
			if(x[0].success){
				reply = text.get("success_reload_module", [x.name])
			}
			else {
				reply = text.get("fail_reload_module", [x.name])
			}
		}
		else {
			reply = text.get("syntax_error")
		}
    }
    else {
        const x = loadModule(true, null)
		reply = ""
		x?.forEach(u => {
			reply += text.get("success_reload_module", [u.name]) + "\n"
		});
    }
    
	ctx.telegram.sendMessage(ctx.message.chat.id, reply, {parse_mode: "HTML"});

}

module.exports = {
	config,
	run
}
