const loglevel = require("loglevel")
const log = loglevel.getLogger("MESSAGE")
const handleCommand = require("./handleCommand")
const handleMessage = function ({ctx}) {

    
    // ctx.update == {
    //         "update_id": 410243562,
    //         "message": {
    //             "message_id": 1964,
    //             "from": {
    //                 "id": 1455276034,
    //                 "is_bot": false,
    //                 "first_name": "Trieu",
    //                 "username": "QuocTrieuDev",
    //                 "language_code": "vi"
    //             },
    //             "chat": {
    //                 "id": 1455276034,
    //                 "first_name": "Trieu",
    //                 "username": "QuocTrieuDev",
    //                 "type": "private"
    //             },
    //             "date": 1671936545,
    //             "text": "lmao"
    //         }
    // }


    if(ctx.update.message.hasOwnProperty('text')){
        const message_text = ctx.update.message.text;
        // check command
        const prefix = "/"
        const regex = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\S*')
        const match = message_text.match(regex)
        if (match !== null) { // is command
            const command_name = 
                match[0]
                    .substring(prefix.length)
                    .replace(new RegExp("@" + ctx.botInfo.username + "$"), "")

            const command_body = 
                message_text
                .substring(match[0].length)
                .trim()
            
            const command = {command_name, command_body}
            handleCommand({ctx, command})
        }
    }
    if(ctx.update.message.hasOwnProperty('photo')){
        ctx.reply("bạn vừa gửi 1 ảnh")
    }
    

}

module.exports = handleMessage;

