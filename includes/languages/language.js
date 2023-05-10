/**
 * @use globalThis.client {mainPath, configPath}
 * @set globalThis.config
 * @set globalThis.getText
 */
const status = {
    module_name: "language",
    require: false,
    error: null,
    success: null
}


const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const loglevel = require('loglevel');
const log = loglevel.getLogger("LANGUAGE")
const Text = require("../utils/text")

const langFilename = readdirSync(globalThis.client.mainPath + '/includes/languages/data');
const langData = new Object()
for(let filename of langFilename){
    let langcode = filename.split('.').slice(0, -1).join('.')
    let data = readFileSync(globalThis.client.mainPath + '/includes/languages/data/' + filename)
    data = JSON.parse(data)
    if(!data) {
        log.warn("load language lỗi:", langcode)
    }
    else {
        langData[langcode] = data
        log.info("Load language thành công:", langcode);
    }
}
const text = new Text(langData)

module.exports = {status, text}