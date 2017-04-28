const
    http = require('http'),
    express = require('./express'),
    port = 3000;


http.createServer(express).listen(port,  () =>{ 
    console.log('server is run');
});