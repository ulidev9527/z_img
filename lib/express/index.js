const
    express = require('express'),
    app = express(),
    session = require('express-session'),
    md5 = require('md5'),
    fs = require('fs');

//compass文件夹检查
if (!fs.existsSync(__dirname + '/compass')) {
    fs.mkdirSync(__dirname + '/compass');
}

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'z-img',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2
    }
}))

app.use("/static", express.static(__dirname + "/views/static"));

app.get('/', (req, res) => {
    //添加文件夹名称-每次打开页面生成一个新的文件夹
    req.session.dir = md5(new Date().getTime());
    //创建文件夹
    fs.mkdirSync(__dirname + '/compass/' + req.session.dir);
    fs.mkdirSync(__dirname + '/compass/' + req.session.dir + '/compass');

    res.sendFile(__dirname + "/views/index.html");
});

app.all('/favicon.ico', function(req, res) {
    res.sendFile(__dirname + '/favicon.ico');
});

app.use('/upload', require('./upload'));

module.exports = app;