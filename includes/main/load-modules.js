/**
 * @require globalThis.client.mainPath
 * @create globalThis.bot
 * @create globalThis.modules
 * @create globalThis.nodemodules
 * @access globalThis.config.admin
 * @access globalThis.text
 */


const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra")
const { join, resolve } = require("path")
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies
const listbuiltinModules = require("module").builtinModules
const { execSync } = require('child_process')
const text = globalThis.text
const loglevel = require('loglevel')
const log = loglevel.getLogger("MODULE")
globalThis.bot = new Object({
    commands: new Map(),
    eventRegistered: new Array()
})

globalThis.modules = new Object({
    dependencyList: new Array(),
    config: new Object()
})

globalThis.nodemodules = new Object()

const loadModule = (reload = false, name = null) => {
    const load_status = []
    if(reload){
        if(typeof name == "string" && name){
            globalThis.bot.commands.delete(name)
            load_status.push(requireModule(name, true))
        }
        else {
            globalThis.bot.commands.clear()
            const files = readdirSync(globalThis.client.mainPath + '/modules/commands').filter(u => u.endsWith('.js'))
            for (const filename of files) {
                load_status.push(requireModule(filename, true))
            }
        }
    }
    else {
        const files = readdirSync(globalThis.client.mainPath + '/modules/commands').filter(u => u.endsWith('.js'))
        for (const filename of files) {
            load_status.push(requireModule(filename, false))
        }
    }
    return load_status
}

function requireModule(filename, reload = false) {
    try {
        const path = globalThis.client.mainPath + '/modules/commands/' + filename
        if(reload){
            delete require.cache[require.resolve(path)]
        }
        const command_module = require(path)
        if ( !(command_module.config &&
            command_module.run &&
            command_module.config &&
            command_module.config.name &&
            command_module.config.category
        )) { throw new Error(text.get('error_format')); }

        let name = command_module.config.name
        command_module.requirePath = path

        if (globalThis.bot.commands.has(name || '')) { 
            throw new Error(text.get('name_exist'));
        }

        const listDepc = command_module.config.dependencies
        
        if (listDepc && typeof listDepc == 'object') {
            for (let depc in listDepc) {
                if (!(
                    listPackage.hasOwnProperty(depc) ||
                    listbuiltinModules.includes(depc) ||
                    globalThis.modules.dependencyList.includes(depc)
                )) {
                    log.warn(text.get('not_found_package', {name: depc, module: name}));
                    let module_version = listDepc[depc] == '*' || listDepc[depc] == '' ? '' : '@' + listDepc[depc]
                    let command = 'npm --save install ' + depc + module_version;
                    log.info("run:", command)
                    
                    execSync(command, { 'stdio': 'inherit', 'env': process.env, 'shell': true, 'cwd': join(globalThis.client.mainPath, '/modules')});
                    try {
                        // require.cache = {};
                        globalThis.nodemodules[depc] = require(depc)
                        globalThis.modules.dependencyList.push(depc);

                    } catch (e) {
                        log.error(e)
                        throw text.get('can_not_install_package', {name, package: depc})
                    }
                }
            }
        }


        let globalModuleConfig = globalThis.config.modules[name]
        if(typeof globalModuleConfig == "object" && globalModuleConfig){
            Object.assign(command_module, globalModuleConfig)
        }

        if (command_module.onLoad) {
            try {
                command_module.onLoad()
            } catch (e) {
                throw new Error(text.get('can_not_onload', {name, error:JSON.stringify(e)}))
            };
        }

        if (command_module.handleEvent) { 
            globalThis.bot.eventRegistered.push(name)
        }

        globalThis.bot.commands.set(name, command_module)
        log.info(text.get(reload ? 'success_reload_module' : 'success_load_module', [name]));
        return {name, success: true}
    } catch (error) {
        log.error(text.get(reload ? 'fail_reload_module' : 'fail_load_module', [filename]));
        log.error(filename + ": " + error.message)
        return {name: filename, success: false}
    };
}


module.exports = loadModule