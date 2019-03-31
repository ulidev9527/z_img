#!/usr/bin/env node

process.title = 'zimg'

const
    com = require('./command'),
    cmp = require('./compress');

let argv = process.argv;

//删除前两个用不到的变量
argv.splice(0, 2);
if (argv.length <= 0) {
    cmp();
} else {
    let files = com.isCommand(argv);
    if (files) {
        cmp(files);
    } else if (files === '') {
        cmp();
    }
}