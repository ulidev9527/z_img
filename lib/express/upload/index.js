const
    express = require('express'),
    app = express(),
    multiparty = require('multiparty'),
    imagemin = require('../../imagemin'),
    fs = require('fs'),
    path = require('path'),
    log = require('../../log');

/**
 * 文件上传
 * @return {
 *  status: true|false
 *  [false => error: string]
 *  [true => data: Object]
 *  message: string
 * }
 */
app.post('/', (req, res) => {
    if (req.session.dir) {

        let
        //当前用户文件夹    
            fileDir = path.join(__dirname, '..', 'compass', req.session.dir),
            form = new multiparty.Form({ uploadDir: fileDir });

        //创建文件夹
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir);
            fs.mkdirSync(fileDir + '/compass');
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.send({
                    status: false,
                    error: err.toString(),
                    message: '文件上传失败！'
                });
            } else {
                //文件信息处理
                let
                //上传的文件    
                    inputFile = files.file[0],
                    //上传文件的路径
                    uploadedPath = inputFile.path,
                    //压缩文件夹路径
                    compassDir = fileDir + '/compass',
                    //重命名文件 originalFilename为文件名称
                    newPath = fileDir + '/' + inputFile.originalFilename,
                    //文件头：image/***
                    contentType = inputFile.headers['content-type'],
                    //重命名
                    newFile = rename(uploadedPath, newPath);

                //判断重命名状态
                if (newFile.status) {
                    //压缩
                    compass(newPath, compassDir)
                        .then(v => {
                            v.name = inputFile.originalFilename;
                            //添加文件头
                            v.data = 'data:' + contentType + ';base64,' + v.data;
                            res.send(v);
                        })
                        .catch(e => {
                            console.log(e);
                            res.send({
                                status: false,
                                error: e.toString(),
                                message: '压缩接口断开'
                            });
                        });
                } else {
                    res.send(newFile);
                }
            }
        });
    } else {
        res.send({
            status: false,
            error: 'server 500 error',
            message: '服务器主动取消，请刷新页面重试。'
        });
    }
});


/**
 * 压缩
 * @param {*string||array} input 文件路径
 * @param {*string} output 压缩后文件路径
 * @return {
 *  status: true|false
 *  (true => size: number)文件压缩后的大小
 *  (true => data: 文件的base64字符串，未添加文件信息头)
 *  (false => (imagemin.compass)) lib/imagemin包里面的返回
 * }
 */
async function compass(input, output) {
    return await imagemin.compass(input, output)
        .then(v => {
            if (v.status) {
                //这里面每次压缩都是一个文件 所以直接 v.data[0]
                let file = v.data[0];

                return {
                    status: true,
                    size: file.data.length,
                    data: file.data.toString('base64')
                }
            } else {
                return {
                    status: false,
                    message: '文件压缩出错,日志：' + log(v.error)
                };
            }
        })
}

/**
 * 文件重命名
 * @param {string} oldPath 旧目录 
 * @param {string} newPath 新目录
 *
 * @return {
 *  status: true|false,
 *  [false => error: string]
 *  [true => data: (newPath)]
 *  message: string
 * }
 */
function rename(oldPath, newPath) {
    let file = fs.renameSync(oldPath, newPath);
    return file ? {
        status: false,
        error: file.toString(),
        message: '文件重命名失败'
    } : {
        status: true,
        data: newPath,
        message: '文件重命名成功'
    };
}



module.exports = app;