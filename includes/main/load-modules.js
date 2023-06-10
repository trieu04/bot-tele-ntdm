/**
 * @access globalThis.client.mainPath
 * @access globalThis.bot
 *     @create globalThis.bot.commands
 * @access globalThis.config
 * @access globalThis.text
 */

const { readdirSync } = require("fs-extra")
const process = require('process')
const path = require('path');
const text = globalThis.text
const loglevel = require('loglevel')
const log = loglevel.getLogger("START")

globalThis.bot.commands = new Map()

const botCommands = globalThis.bot.commands

const loadModule = (reload = false, name = null) => {
    const load_status = []

    if(typeof name == "string" && name){
        botCommands.delete(name)
        load_status.push(requireModule(name, true))
    }
    else {
        if(reload)
            botCommands.clear()
        const files = readdirSync(globalThis.client.mainPath + '/modules/commands').filter(u => u.endsWith('.js'))
        const list_command_name = files.map(u => path.parse(u).name)
        for (const command_name of list_command_name) {
            load_status.push(requireModule(command_name, reload))
        }
    }
    return load_status
}

function requireModule(command_name, reload = false) {
    try {
        const path = `${globalThis.client.mainPath}/modules/commands/${command_name}.js`
        delete require.cache[require.resolve(path)]
        const command_module = require(path)

        if ( !(command_module.config &&
            command_module.run &&
            command_module.config &&
            command_module.config.name &&
            command_module.config.category
        )) { 
            throw new Error(text.get('error_format'));
        }

        if (botCommands.has(command_name || '')) { 
            throw new Error(text.get('name_exist'));
        }

        command_module.command_name = command_name
        command_module.config.command_name = command_name

        let globalModuleConfig = globalThis.config.moduleConfig[command_name]
        if(typeof globalModuleConfig == "object" && globalModuleConfig){
            Object.assign(command_module.config, globalModuleConfig)
        }

        if(command_module.config.env){
            for(let env of Object.keys(command_module.config.env))
                if(process.env[env])
                    command_module.config.env[env] = process.env[env]
        }

        if (command_module.onLoad) {
            try {
                command_module.onLoad()
            } catch (e) {
                log.error(e)
                throw new Error(text.render(`{{can_not_onload}} ${command_name}`))
            };
        }

        botCommands.set(command_name, command_module)

        log.info(text.get(reload ? 'success_reload_module' : 'success_load_module', [command_name]));
        return {command_name, success: true}
    } catch (error) {
        log.error(text.get(reload ? 'fail_reload_module' : 'fail_load_module', [command_name]));
        log.error(command_name + ": " + error.message)
        return {command_name, success: false}
    };
}


module.exports = loadModule