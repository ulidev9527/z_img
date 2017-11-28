const
    fs = require('fs'),
    glob = require('glob'),
    dir = process.cwd(),
    output = dir + '/zimg',
    imagemin = require('../lib/imagemin'),
    valChar = '┏┳┓━┃┣╋┫┗┻┛□■';

module.exports = (files) => {
    files = files || glob.sync(dir + '/*.?(jpg|png|jpeg|gif)');
    let data = [];

    function cErr(txt = '', err) {
        console.log(txt.x88, err);
    }

    function cInfo() {
        let
            numRatio = (files.length - succNum - errNum) / files.length,
            txt = `
    ┏┓
    ┃
    ┣${getChar('■',20-Math.floor(numRatio*20))}${getChar('□',Math.floor(numRatio*20))}(${(100-numRatio*100).toFixed(2)}%)'
    ┃
    ┣完成：${succNum + errNum}
    ┃
    ┣剩余：${files.length - (succNum + errNum)}
    ┃
    ┣错误：${errNum}
    ┃
    ┣共计：${files.length}
    ┃
    ┣总大小：${(allSourceSize/1024).toFixed(2)}KB
    ┃
    ┣压缩后大小：${(allSize/1024).toFixed(2)}KB
    ┃
    ┣压缩率：${((allSourceSize-allSize)/allSourceSize*100).toFixed(3)}%
    ┃
    ┗┛`;
        console.clear();
        console.log(txt);
    }

    function getChar(txt, num) {
        let val = '';
        for (let i = 0; i < num; i++) {
            val += txt;
        }
        return val;
    }
    let
    //完成数量    
        succNum = 0,
        //出错数量
        errNum = 0,
        //总大小
        allSourceSize = 0,
        //总处理后大小
        allSize = 0;

    files.forEach((path, i) => {
        imagemin.compass(path, dir + '/zimg')
            .then(d => {
                const
                    source = fs.statSync(path);
                succNum++;
                allSourceSize += source.size;
                allSize += d.data[0].data.length;
                cInfo();
            })
            .catch(err => {
                errNum++;
                cInfo();
            });
    });
}