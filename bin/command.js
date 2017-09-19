const
    fs = require('fs'),
    commandList = ['v', 'version', '-v', '-version', 'h', 'help', '-h', '-help'],
    runCommand = (() => {
        function version() {
            console.log('\nversion', require('../package.json').version, '\n');
        }

        function help() {

            console.log(`
command:
['v', 'version', '-v', '-version'] ['h', 'help', '-h', '-help']
v ----show version
h ----show help
            `);

        }
        return {
            v: version,
            version: version,
            '-v': version,
            '-version': version,
            h: help,
            help: help,
            '-h': help,
            '-help': help
        }

    })();




function isCommand(arr) {
    let isCom = false;
    for (let i = 0; i < arr.length; i++) {
        if (commandList.indexOf(arr[i]) > -1) {
            isCom = true;
            runCommand[arr[i]]();
            break;
        }
    }

    return isCom;
}



module.exports = {
    isCommand: isCommand
};