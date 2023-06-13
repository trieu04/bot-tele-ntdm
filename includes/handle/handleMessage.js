const loglevel = require("loglevel")
const log = loglevel.getLogger("MESSAGE")
const handleCommand = require("./handleCommand")
const handlePhoto = require("./handlePhoto")
const handleMessage = async function ({ctx}) {

    if(ctx.update.message.hasOwnProperty('text')){
        const message_text = ctx.update.message.text;
        // check command
        const prefix = "/"
        const prefix_safe_regex = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const command_match = message_text.match(new RegExp(`^${prefix_safe_regex}(\\S+)`))
        if (command_match !== null) { // is command
            let command_name, command_body;
            const tag = command_match[1].match(new RegExp(`^(.+)@(.+)$`))
            if(tag !== null){
                if(tag[2] == ctx.botInfo.username){ // is tagert to this bot
                    command_name = tag[1]
                }
                else {
                    return false
                }
            }
            else {
                command_name = command_match[1]
            }

            command_body = message_text.substring(command_match[0].length).trim()

            return handleCommand({ctx, command: {command_name, command_body}})
        }

        return false
    }


    if(ctx.update.message.hasOwnProperty('photo')){
        return handlePhoto({ctx})
    }

}

module.exports = handleMessage;

