const
    runCommand = (() => {
        function version() {
            console.log('\nversion', require('../package.json').version, '\n');
        }

        function help() {

            console.log(`
command:
-c ---compress file 
   default =  '-c' , You don't need this parameter '-c'
   'zimg':  Compress the current folder img files
   'zimg [img file]': Compress the img file
   'zimg [file] [file]': Compress the two files
   'zimg [file] [file] ...': Compress more specified files
-v ---show version
-h ---show help
-r ---run server 
    'zimg -r': run server at port : 3000 
    'zimg -r [port]' run server at port : set port
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
        com = arr.toString().split('-');
    com[0].length === 0 && com.shift();
    com = com[0];
    if (/^v/.test(com)) {
        runCommand.v();
    } else if (/^h|^\?/.test(com)) {
        runCommand.h();
    } else if (/^r/.test(com)) {
        runCommand.r(com.split(',')[1] || 3000);
    } else if (/^c/.test(com)) {
        return com.replace('c,', '').replace(/^c/, '');
    } else {
        return com.split(',');
    }
}



module.exports = {
    isCommand: isCommand
};