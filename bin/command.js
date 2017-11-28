const
    fs = require('fs'),
    runCommand = (() => {
        function version() {
            console.log('\nversion', require('../package.json').version, '\n');
        }

        function help() {

            console.log(`
command:
-v ----show version
-h ----show help
-r ---run server 
            `);

        }

        function run(port) {
            require('../lib/runServer')(port);
        }
        return {
            'v': version,
            'h': help,
            'r': run
        }

    })();



//如果是命令处理就运行命令
function isCommand(arr) {
    let
        com = arr.toString().split('-'),
        port = 3000;

    com.splice(0, 1);
    com = com.toString().split(',');
    if (com.length > 1) {
        if (com[0] == 'r') {
            port = parseInt(com[1]);
            com = 'r';
        }
    } else {
        com = com[0];
    }
    switch (com) {
        case 'v':
            runCommand.v();
            break;
        case 'h':
            runCommand.h();
            break;
        case 'r':
            runCommand.r(port);
            break;
        default:
            return arr;
            break;
    }

}



module.exports = {
    isCommand: isCommand
};