/**
 * @require globalThis.bot
 * @require globalThis.caches
 * @require globalThis.config.ADMINBOT
 * @require globalThis.text
 */

const similarity = require("string-similarity")
const mk = require("../utils/makeup")
const logger = require("loglevel")
const log = logger.getLogger("COMMAND")

const handleCommand = async function({ctx, command: {command_name, command_body}}){
    const commands = globalThis.bot.commands
    const text = globalThis.text
    const chatID = ctx.update.message.chat.id;
    const promises = []

    let run = true
    let command_module = commands.get(command_name)
    /////  Best match
    if (!command_module) {
        let reply
        let cmd_match_list = [...commands.keys()];
        let match = similarity.findBestMatch(command_name, cmd_match_list);
        if (match.bestMatch.rating >= 0.8) {
            command_module = commands.get(match.bestMatch.target);
            reply = text.get("using_command_instead", [mk.bold(command_name), mk.bold(match.bestMatch.target)])
            command_name = match.bestMatch.target
        }
        else if (match.bestMatch.rating <= 0.25 || match.ratings.length == 0) {
            reply = text.get("not_found_command", [mk.bold(command_name)])
            run = false
        }
        else {
            const similars = []
            match.ratings.filter(u => u.rating > 0.25).forEach(i => similars.push(i.target))
            reply = text.get("not_found_command_and_avaible", [mk.bold(command_name), similars.map(u => mk.bold(u)).join(", ")])
            run = false
        }

        if(reply) {
            let p = ctx.telegram.sendMessage(chatID, reply, {parse_mode: "HTML"})
            promises.push(p)
        } 
    }

    /////  Check Permission
    if(run && command_module.config.hasPermssion && command_module.config.hasPermssion == "admin"){
        const userID = ctx.from.id
        if(globalThis.config.ADMINSBOT.filter(u => String(u) == String(userID)).length == 0){
            let reply = text.get("you_may_not_be_able_to_use_the_command", [mk.bold(command_name)])
            let p = ctx.telegram.sendMessage(chatID, reply, {parse_mode: "HTML"})
            promises.push(p)
            run = false
        }
    }

    if(run && command_module.flag == "disable"){
        let reply = text.get("the_command_is_disabled", [mk.bold(command_name)])
        let p = ctx.telegram.sendMessage(chatID, reply, {parse_mode: "HTML"})
        promises.push(p)
        run = false
    }

    /////  Run
    if(run){
        try{
            let p = await command_module.run({ ctx, command: {command_name, command_body} })
            promises.push(p)
        }
        catch (e){
            log.error(e)
            command_module.flag = "disable"
            let reply = text.get("an_error_has_occurred", [mk.bold(command_name)])
            let p = ctx.telegram.sendMessage(chatID, reply, {parse_mode: "HTML"})
            promises.push(p)
        }
        return Promise.all(promises)
    }

}
module.exports = handleCommand