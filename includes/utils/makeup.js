const htmlEscape = (unsafe) => {
    if(typeof unsafe != "string")
        return null
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}
const HTMLMakup =  {
    bold(t){
        if(typeof t != "string")
            return null
        return '<b>' + htmlEscape(t) + '</b>'  
    },
    italic(t){
        if(typeof t != "string")
        return null
        return '<i>' + htmlEscape(t) + '</i>' 
    },
    strike(t){
        if(typeof t != "string")
            return null
        return '<s>' + htmlEscape(t) + '</s>' 
    },
    underline(t){
        if(typeof t != "string")
            return null
        return '<u>' + htmlEscape(t) + '</u>' 
    },
    spoiler(t){
        if(typeof t != "string")
            return null
        return '<span class="tg-spoiler">' + t + '</span>'
    },
    code(t){
        if(typeof t != "string")
            return null
        return '<code>' + htmlEscape(t) + '</code>' 
    },
    link(link, t){
        if(typeof t != "string")
            return null
        return `<a href="${encodeURIComponent(link)}>${t}</a>"`
    },
    pre(language, t){
        if(typeof t != "string")
            return null
        return `<pre language="${encodeURIComponent(language)}>${t}</pre>"`
    },
    makeup(format, t){
        if(typeof t != "string")
            return null
        t = htmlEscape(t)
        for(c of format){
            if(! c in ["b", "i", "s", "u"]) continue;
            t += `<${c}>${t}</${c}>`
        }
        return t;
    }
}
module.exports = HTMLMakup