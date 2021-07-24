const { Telegraf } = require('telegraf')

const bot = new Telegraf('1921157192:AAGID1EpbU-EBGSe8jxrQSQgfKGi69SMvB8')


bot.telegram.setWebhook('https://89b428779613.ngrok.io/bot')


// Http webhook, for nginx/heroku users.
bot.startWebhook('/bot', null, 3000)


bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()