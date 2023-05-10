const { render } = require("micromustache")

class Text {
    constructor(langData){
        if(typeof langData == "object" && langData !== null){
            var list_langcode = Object.keys(langData)
            var defaultLangcode;
            if(list_langcode.includes("en")){
                defaultLangcode = "en"
            }
            else if(list_langcode.length > 0) {
                defaultLangcode = list_langcode[0]
            }
            this.list_langcode = list_langcode
            this.langData = langData
            this.langcode = defaultLangcode
        }
        else {
            this.langData = {}
            this.list_langcode = []
            this.langcode = ""
            return
        }
    }
    #isObject(varible){
        return typeof varible === 'object' &&
            !Array.isArray(varible) &&
            varible !== null
    }
    render(id, bindData) {
        if(typeof id != "string" && typeof id != "number") {
            return null
        }
        const langcode = this.langcode
        if(this.#isObject(this.langData[langcode]) && typeof this.langData[langcode][id] == "string"){
            if(bindData){
                return render(this.langData[langcode][id], bindData)
            }
            else {
                return this.langData[langcode][id];
            }
        } else {
            return id.replace("_", " ")
        }
    }
    setLangcode(langcode){
        if(this.list_langcode.includes(langcode)){
            this.langcode = langcode
            return true;
        }
        else{
            return false
        }
    }
}

module.exports = Text;