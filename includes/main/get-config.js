/**
 * @use globalThis.client {mainPath, configPath}
 * @set config
 */
const status = {
    module_name: "get-config",
    require: true,
    error: null,
    success: null
}

config = new Object()
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join } = require("path");
const loglevel = require('loglevel');
const log = loglevel.getLogger("START")
try {
    globalThis.client.configPath = join(globalThis.client.mainPath, "/config.json");
    var configValue = require(globalThis.client.configPath);

    try {
        for (const key in configValue) config[key] = configValue[key];
        writeFileSync(globalThis.client.configPath + ".temp", JSON.stringify(config, null, 4), 'utf8');
        writeFileSync(globalThis.client.configPath, JSON.stringify(config, null, 4), 'utf8');
        unlinkSync(globalThis.client.configPath + '.temp');
        log.info("Config Loaded!");
    }
    catch(error) {
        status.error = {
            message: "Can't load file config!",
            exception: error
        }
    }
}
catch {
    if (existsSync(globalThis.client.configPath.replace(/\.json/g, "") + ".temp")) {
        configValue = readFileSync(globalThis.client.configPath.replace(/\.json/g, "") + ".temp");
        configValue = JSON.parse(configValue);
        log.info(`Found: ${globalThis.client.configPath.replace(/\.json/g, "") + ".temp"}`);
    }
    else {
        status.error = {
            message: "config.json not found!"
        }
    }
}

module.exports = {
    status,
    config
}
