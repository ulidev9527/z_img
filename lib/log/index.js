const
    fs = require('fs'),
    dir = __dirname + '/files/';

module.exports = (msg = '') => {
    let name = new Date().getTime();
    fs.writeFileSync(dir + name, msg, 'utf-8');
    return name;
}