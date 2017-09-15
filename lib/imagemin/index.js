const
    imagemin = require('imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminGifsicle = require('imagemin-gifsicle'),
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
async function compass(input, output) {
    return await imageminCompass(input, output);
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
async function imageminCompass(input, output = 'temp') {
    input = (typeof input == 'string') ? [input] : input;
    return await imagemin(input, output, {
            use: [
                imageminMozjpeg(),
                imageminPngquant(),
                imageminGifsicle({
                    optimizationLevel:3
                })
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
}

module.exports = {
    compass: compass
};