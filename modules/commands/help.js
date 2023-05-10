const config = {
	name: "help",
	version: "1.0",
	hasPermssion: "all",
	credits: "Trieu04",
	description: "description",
	category: "bot",
	usage: "usage",
	cooldowns: 0,
	dependencies: {},
	envConfig: {},
    languages: {
        "vi": {
            "description": "Lấy danh về các lệnh bot và cách dùng chúng",
            "usage": "/help | /help + [tên lệnh]"
        },
        "en": {
            "description": "Get bot command, usage",
            "usage": "/help | /help + [command name]"	
        }
    }
};
const axios = require("axios");

const { Telegraf } = require("telegraf")
const bot = new Telegraf()
const Text = require("../../includes/utils/text")
const text = new Text(config.languages)

function getCommandInfo(){
    const categorys = {}
    const list = []
    const commands = globalThis.bot.commands
    for(let command of commands.keys()){
        const x = commands.get(command)
        if(x.config.hidden){
            continue
        }
        const text = new Text(x.config.languages)
    
        const command_info = {
            name: x.config.name,
            description: text.render(x.config.description),
            version: x.config.version,
            category: x.config.category,
            usage: text.render(x.config.usage),
            hasPermssion: x.config.hasPermssion,
            
        }

        if(categorys.hasOwnProperty(x.config.category)){
            categorys[x.config.category].push(command_info)
        }
        else {
            categorys[x.config.category] = [command_info]
        }
        list.push(command_info)
    }
    return {categorys, list}
}
const tab = "  "

const run = async function ({ ctx, command: {command_body} }) {
    var reply_text = "";
    var inline_keyboard = []
    
    const {categorys, list} = getCommandInfo()
    if(command_body == ""){
        let p = []
        p.push("Sử dụng /help + [Tên lệnh] để nhận thông tin và hướng dẫn sử dụng lệnh đó, ví dụ: " + text.hCode("/help info") + "\n")
        p.push("Sau đây là các lệnh bạn có thể thực hiện với Faye Bot")
        x = p.push("") -1
        
        
        for(let category of Object.keys(categorys)){
            p[x] += text.hBold(text.render(category)) + "\n"
            for(let i of categorys[category]){
                if(["start"].includes(i.name)) continue;
    
                p[x] += tab + ("/"+ i.name)
                    + (i.hasPermssion == "admin" ? " [admin]" : "")
                    + " - "
                    + i.description + "\n"
            }
        }
        reply_text = p.join("\n")
        inline_keyboard = [
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
    else if(command_body.indexOf(" ") >= 0){
        reply_text = "Lệnh không hợp lệ."
    }
    else {
        let c = list.find(u => u.name == command_body)
        if(c){
            let p = []
            p.push(text.hBold('Lệnh') + ' /' + c.name + '.')
            p.push('')
            p.push(text.hItalic("Danh mục: ") + text.render(c.category))
            p.push(text.hItalic("Phiên bản: ") + c.version)
            p.push(text.hItalic("Phạm vi: ") + c.hasPermssion)
            p.push(text.hItalic("Mô tả: ") + c.description)
            p.push('')
            p.push(text.hItalic("Cách sử dụng:"))
            if(c.usage){
                p.push(c.usage)
            } else {
                p.push(text.hItalic("(Chưa có mô tả cách sử dụng cho lệnh này)"))
            }

            reply_text = p.join("\n")
        }
        else{
            reply_text = `Không tìm thấy lệnh ${command_body}`
        }
    }
    

    ctx.telegram.sendMessage(ctx.message.chat.id, reply_text, {
        reply_markup: { inline_keyboard },
        parse_mode: "HTML"
    });

}

module.exports = {
	config,
	run
}