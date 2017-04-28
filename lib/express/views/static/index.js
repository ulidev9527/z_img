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

var _uploader = (function() {
    var uploader = new WebUploader.Uploader({
        swf: 'static/webuploader/Uploader.swf',
        dnd: "#__uploader",
        disableGlobalDnd: true,
        pick: "#__uploader div.pick",
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        server: './upload'
    });
    uploader.on('beforeFileQueued', function(file) {
            uploader.makeThumb(file, function(error, ret) {
                if (!error) {
                    _imgList.add({
                        url: ret,
                        size: file.size,
                        id: file.id,
                        imgError: false
                    });
                    uploader.upload(file);
                } else {
                    _imgList.add({
                        size: file.size,
                        id: file.id,
                        imgError: true,
                        message: '文件信息错误'
                    });
                    return false;
                }
            });
        })

    uploader.on('uploadProgress', function(file, num) {
        _imgList.change({
            progress: num * 100,
            message: (num == 1) ? '处理中' : '上传中',
            id: file.id
        });
    });

    uploader.on('uploadSuccess', function(file, res) {
        if (res.status) {
            //添加压缩文件
            _zip.add(res.name, res.data);

            _imgList.change({
                id: file.id,
                message: '处理完成',
                serverSize: res.size,
                url: res.data
            });
        } else {
            _imgList.change({
                id: file.id,
                message: res.error,
            });
        }
    });


    return uploader;
})();


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