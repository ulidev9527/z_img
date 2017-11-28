module.exports = (port = 3000) => {
    const
        http = require('http'),
        open = require('open'),
        express = require('./express');


    http.createServer(express).listen(port, () => {
        console.log('server is run:' + port);
        open('http://localhost:' + port);
    });
}