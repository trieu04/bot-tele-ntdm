/**
 * @require globalThis.bot
 * @require globalThis.caches
 * @require globalThis.config.ADMINBOT
 * @require globalThis.text
 */

const similarity = require("string-similarity")

const handleCommand = async function({ctx, command: {command_name, command_body}}){
    const text = globalThis.text
    const render = () => text.render(...arguments)
    var run = true, reply
    /////  Best match
    const commands = globalThis.bot.commands
    var command_module = commands.get(command_name)
    if (!command_module) {
        let cmd_match_list = [...commands.keys()];
        let match = similarity.findBestMatch(command_name, cmd_match_list);
        if (match.bestMatch.rating >= 0.8) {
            command_module = commands.get(match.bestMatch.target);
            reply = render("using_command_instead", [ command_name, match.bestMatch.target])
        }
        else if (match.bestMatch.rating <= 0.2) {
            reply = render("not_found_command", [command_name])
            run = false
        }
        else {
            const similars = []
            match.ratings.filter(u => u.rating > 0.25).forEach(i => similars.push(i.target))
            reply = render("not_found_command_and_avaible", [command_name, similars.map(u => "<b>" + u + "</b>").join(", ")])
            run = false
        }

        if(reply) {
            let chatID = ctx.update.message.chat.id
            ctx.telegram.sendMessage(chatID, reply, {parse_mode: "HTML"})
        }
        
    }

    /////  Check Permission
    if(run && command_module.config.hasPermssion && command_module.config.hasPermssion == "admin"){
        const userID = ctx.from.id
        if(globalThis.config.ADMINSBOT.filter(u => String(u) == String(userID)).length == 0){
            let chatID = ctx.update.message.chat.id;
            let reply = "Có vẻ như bạn không được sử dụng lệnh này."
            ctx.telegram.sendMessage(chatID, reply)
            run = false
        }
    }

    /////  Run
    if(run)
        command_module.run({ ctx, command: {command_name, command_body} })

}
module.exports = handleCommand