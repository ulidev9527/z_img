layui.use(['form', 'element'], function() {
    layui.element = layui.element();
});

//压缩
var _zip = (function() {
    var
        zip = new JSZip(),
        fileNum = 0;

    function add(name, data) {
        fileNum += 1;
        //由于jszip压缩的base64字符串不需要文件头，所以去掉文件头信息
        zip.file(name, data.replace(/data.+base64,/, ''), { base64: true });
    }

    function download() {
        if (fileNum > 0) {
            zip.generateAsync({ type: "blob" })
                .then(function(content) {
                    saveAs(content, (new Date().getTime()) + ".zip");
                });

        } else {
            layer.msg('暂无文件');
        }

    }

    return {
        add: add,
        download: download,
        zip: zip
    }

})();

//百度上传
var _uploader = (function() {
    var uploader = WebUploader.create({
        swf: 'static/webuploader/Uploader.swf',
        dnd: "#__uploader",
        disableGlobalDnd: true,
        pick: "#__uploader div.pick",
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        server: './upload',
        threads: 1,
    });
    uploader.on('beforeFileQueued', function(file) {
        _uploaderMsg.add += 1;

        if (file.size > 5242880) {
            _imgList.add({
                size: file.size,
                id: file.id,
                imgError: true,
                message: '文件大于30M,无法上传'
            });
            _uploaderMsg.error += 1;
            _uploaderMsg.end += 1;
            return false;
        } else {
            uploader.makeThumb(file, function(error, ret) {
                if (!error) {
                    _imgList.add({
                        url: ret,
                        size: file.size,
                        id: file.id,
                        imgError: false
                    });
                    _uploaderMsg.upload += 1;
                    uploader.upload(file);
                } else {
                    _imgList.add({
                        size: file.size,
                        id: file.id,
                        imgError: true,
                        message: '文件信息错误'
                    });
                    _uploaderMsg.error += 1;
                    _uploaderMsg.end += 1;
                    uploader.removeFile(file.id);
                    return false;
                }
            });
        }
    })

    uploader.on('uploadProgress', function(file, num) {
        _imgList.change({
            progress: num * 100,
            message: (num == 1) ? '处理中' : '上传中',
            id: file.id
        });
    });

    uploader.on('uploadSuccess', function(file, res) {
        _uploaderMsg.upload -= 1;
        if (res.status) {
            _uploaderMsg.end += 1;
            //添加压缩文件
            _zip.add(res.name, res.data);

            _imgList.change({
                id: file.id,
                message: '处理完成',
                serverSize: res.size,
                url: res.data
            });
        } else {
            _uploaderMsg.error += 1;
            _uploaderMsg.end += 1;
            _imgList.change({
                id: file.id,
                message: res.message,
            });
        }
    });

    uploader.on('uploadError', function(file, res) {
        _uploaderMsg.upload -= 1;
        _uploaderMsg.error += 1;
        _uploaderMsg.end += 1;

        _imgList.change({
            id: file.id,
            message: '上传失败：' + res
        });
    });

    return uploader;
})();

//上传处消息
var _uploaderMsg = (function() {
    var
        msg = new Vue({
            el: '#__uploaderMsg',
            data: {
                add: 0,
                upload: 0,
                success: 0,
                error: 0,
                end: 0
            }
        });


    return msg;
})();

//列表
var _imgList = (function() {
    var
        imgList = new Vue({
            el: '#__imgList',
            data: {
                list: []
            },
            watch: {

            }
        }),
        bindList = {};

    function add(op) {
        if (op && op.id) {
            if (typeof bindList[op.id] != 'number') {
                bindList[op.id] = imgList.list.length;
                imgList.list.push(getOption(op));
                layui.element.init();
            } else {
                var
                    num = bindList[op.id],
                    now = imgList.list[num],
                    newOp = getOption(op, now);
                layui.element.progress(now.id, now.progress);
                now.url = newOp.url;
                now.message = newOp.message;
                now.progress = newOp.progress;
                now.size = newOp.size;
                now.serverSize = newOp.serverSize;
                now.displaySize = newOp.displaySize;
            }
        }
    }

    function getOption(op, old) {
        op = op || {};
        old = old || {
            url: 'favicon.ico',
            progress: '0%',
            message: '等待上传',
            size: 'NAN',
            serverSize: 'NAN'
        };
        return {
            id: op.id,
            url: op.url || old.url,
            progress: op.progress + '%' || old.progress,
            message: op.message || old.message,
            size: op.size || old.size,
            serverSize: op.serverSize || old.serverSize,
            displaySize: old.size - op.serverSize
        }
    }

    return {
        add: add,
        change: add,
        source: imgList
    }
})();


$('#__btnDownload').click(function() {
    _zip.download();
})