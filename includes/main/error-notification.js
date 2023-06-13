const ErrorNotification = class {
    constructor({sendTo}){
        this.remind = {}
        if(sendTo && sendTo.telegram){
            if(sendTo.telegram.chatID && sendTo.telegram.ctx){
                this.telegram = sendTo.telegram
            }
            else{
                this.telegram = false
            }
        }
    }
    handle(error_data){
        if(!error_data.code || !error_data.message)
            return null

        const current = new Date()
        const remind = this.remind[error_data.code]
        if(remind){
            if(remind.after > current.getTime()){

                return remind.queue.push(error_data)  
            }
            else{
                delete this.remind[error_data.code];
            }
        }
        
        let error_text = this.toErrorText(error_data)
        error_text += "------------\n"
        error_text += this.toRemindCommand(error_data.code)
        if(!error_text)
            return null
        
        const promise = [] 
        promise.push(this.sendToTelegram(error_text))
        return Promise.all(promise)
    }

    remindLater(error_code, second){
        return this.remind[error_code] = {
            after: (new Date()).getTime() + second * 1000,
            queue: [],
            timeout: setTimeout(() => this.sendRemind(error_code), second * 1000)
        }
    }

    async sendRemind(error_code){
        const remind = this.remind[error_code]
        if(remind){
            while(remind.queue.length > 0){
                let error_text = ""
                let length = remind.queue.length
                for(let i = 0; i < 5 && i < length; i++){
                    const error_data = remind.queue.shift()
                    error_text += this.toErrorText(error_data)
                    error_text += "------------\n"
                }
                error_text += this.toRemindCommand(error_code)
                await this.sendToTelegram(error_text)
            }
        }
    }

    toErrorText(error_data){
        let error_text = ""
        const {code, message, time, call_stack, detail, extra} = error_data
        error_text += `<b>ERROR</b>\n`
        error_text += `<b>Code:</b> ${code}\n`
        error_text += `<b>Time:</b> ${getDateTime(new Date(time))}\n`
        error_text += `<b>Mesage:</b> ${message}\n`
        if(call_stack){
            error_text += `<b>Call Stack:</b> ${call_stack}\n`
        }
        if(detail){
            error_text += `<b>Detail:</b>\n${detail}\n`
        }
        if(extra){
            error_text += `<b>Extra Data:</b> ${JSON.stringify(extra)}\n`
        }
        return error_text
    }

    toRemindCommand(error_code){
        return `<code>/reminderror ${error_code} 15</code> - Remind this error for 15 minute.`
    }

    sendToTelegram(error_text){
        if(this.telegram){
            const {chatID, ctx} = this.telegram
            return ctx.telegram.sendMessage(chatID, error_text, {parse_mode: "HTML"})
        }
    }
}

function getDateTime(date, timezoneOffset = 420) {
    date.setTime(date.getTime() + (date.getTimezoneOffset() + timezoneOffset) * 60 * 1000)
    const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
}

module.exports = ErrorNotification
