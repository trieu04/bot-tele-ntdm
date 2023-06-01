const htmlEscape = (unsafe) => {
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}
const HTMLMakup =  {
    bold(t){
        return '<b>' + htmlEscape(t) + '</b>'  
    },
    italic(t){
        return '<i>' + htmlEscape(t) + '</i>' 
    },
    strike(t){
        return '<s>' + htmlEscape(t) + '</s>' 
    },
    underline(t){
        return '<u>' + htmlEscape(t) + '</u>' 
    },
    spoiler(t){
        return '<span class="tg-spoiler">' + t + '</span>'
    },
    code(t){
        return '<code>' + htmlEscape(t) + '</code>' 
    },
    link(link, t){
        return `<a href="${encodeURIComponent(link)}>${t}</a>"`
    },
    pre(language, t){
        return `<pre language="${encodeURIComponent(language)}>${t}</pre>"`
    },
    makeup(format, t){
        t = htmlEscape(t)
        for(c of format){
            if(! c in ["b", "i", "s", "u"]) continue;
            t += `<${c}>${t}</${c}>`
        }
        return t;
    }
}
module.exports = HTMLMakup