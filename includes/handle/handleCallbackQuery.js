const loglevel = require("loglevel")
const log = loglevel.getLogger("callback_query")
const handleCallbackQuery = async function ({ctx}) {
    const commands = globalThis.bot.commands
    const callback_query = ctx.update.callback_query
    if(callback_query.message && callback_query.data){
        let match_command = /^command\.(.+)\:(.+)$/.exec(callback_query.data)
        if(match_command){
            const command_name = match_command[1]
            const value = match_command[2]

            const command_module = commands.get(command_name)
            if (command_module && typeof command_module.onCbQuery != "function"){
                let reply_text = text.get("something_error")
                return ctx.telegram.answerCbQuery(callback_query.id, reply_text)
            }
            
            /////  Check Permission
            if(command_module.config.hasPermssion && command_module.config.hasPermssion == "admin"){
                const userID = callback_query.from.id
                if(globalThis.config.ADMINSBOT.filter(u => u == userID).length == 0){
                    let reply_text = text.get("you_may_not_be_able_to_use_the_command", [mk.bold(command_name)])
                    return ctx.telegram.answerCbQuery(callback_query.id, reply_text)
                }
            }
            return command_module.onCbQuery({ctx, callback_query, value})
        }


        let reply_text = text.render("{{something_error}}: Data not match")
        return ctx.telegram.answerCbQuery(callback_query.id, reply_text)
    }
    return ctx.telegram.answerCbQuery(callback_query.id, "Not found")
}

module.exports = handleCallbackQuery;

