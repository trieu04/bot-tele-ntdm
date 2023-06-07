const mm = require("micromustache")

const isObject = (varible) => {
    return typeof varible === 'object' &&
        !Array.isArray(varible) &&
        varible !== null
}

class Text {
    constructor(langData, defaultLangcode = "en"){
        if(isObject(langData) && Object.keys(langData).length > 0){
            const list_langcode = Object.keys(langData)
            if(list_langcode.includes(defaultLangcode)){
                this.langcode = defaultLangcode
            }
            else {
                this.langcode = list_langcode[0]
            }
            this.list_langcode = list_langcode
            this.langData = langData
        }
        else {
            this.langData = {}
            this.list_langcode = []
            this.langcode = ""
            return
        }
    }
    get(id, bindData){
        if(typeof id != "string" && typeof id != "number")
            return null
        const langcode = this.langcode
        if(isObject(this.langData[langcode]) && typeof this.langData[langcode][id] == "string"){
            if(bindData){
                return mm.render(this.langData[langcode][id], bindData)
            }
            else {
                return this.langData[langcode][id];
            }
        } else {
            return id.replaceAll("_", " ")
        }
    }

    render(text, bindData = null){
        if(typeof text != "string") 
            return null
        const langcode = this.langcode
        const get_name = (path, scope) => mm.get(scope, path) || path.replaceAll("_", " ")
        if(isObject(this.langData[langcode])){
            const scope = this.langData[langcode]
            if(bindData === null){
                return mm.renderFn(text, get_name, scope)
            }
            return mm.render(text, Object.assign({}, scope, bindData))
        }
        return mm.render(text, bindData)
    }

    setLangcode(langcode){
        if(this.list_langcode.includes(langcode)){
            this.langcode = langcode
            return langcode
        }
        return null
    }
}

module.exports = Text;