const
    imagemin = require('imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageminPngquant = require('imagemin-pngquant'),
    co = require('co'),
    fs = require('fs');

/**
 * 文件压缩
 * @param {string||array} input 文件路径
 * @param {string} output 文件输出路径：默认 imagemin/temp
 * @return {
 *  status: true|false
 *  [true => （imageminCompass return true）]
 *  [false => error: string]
 * }
 */
function compass(input, output) {
    return co(function*() {
        return imageminCompass(input, output);
    });
}

/**
 * imagemin压缩
 * @param {string} input 源目录
 * @param {string} output 输出目录
 * @return {
 *  status: true|false,
 *  [true => data: array]
 *  [false => error: string]
 * }
 */
function imageminCompass(input, output = 'temp') {
    input = (typeof input == 'string') ? [input] : input;
    return co(function*() {
        return imagemin(input, output, {
                use: [
                    imageminMozjpeg(),
                    imageminPngquant()
                ]
            })
            .then(file => {
                return {
                    status: true,
                    data: file
                };
            })
            .catch(e => {
                console.log(e);
                return {
                    status: false,
                    error: e.toString()
                }
            });
    });
}

module.exports = {
    compass: compass
};