const express = require('express');
var compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const appserver = express();
const qr_image = require("qr-image");
const nodeos = require('os')

const configDir = nodeos.homedir() + '/fileup/'

// body-parser 用于解析post数据  application/x-www.form-urlencoded
appserver.use(bodyParser.urlencoded({ extended: false }));
appserver.use(compression());

// multer 用于解析post文件  multipart/form-data
appserver.use(multer({ dest: configDir + '/tmpfile/' }).array('file')); //此处的array('file')对应html部分的name

appserver.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
        /让options请求快速返回/
    } else {
        next();
    }
});

appserver.get('/', function (req, res) {
    res.send('启动成功')
})

const resultObj = {
    'code': '',
    'msg': '',
    'filename': ''
}

const fomartTime = (fmt) => {
    let year = fmt.getFullYear();
    let month = fmt.getMonth() + 1
    let day = fmt.getDate()
    let hours = fmt.getHours()
    let minuts = fmt.getMinutes()
    let seconds = fmt.getSeconds()
    let fileDate = year + '' + month + '' + day + '' + hours + '' + minuts + '' + seconds;
    return fileDate;
}

appserver.post('/file_upload', function (req, res) {

    if (!req.files) {
        resultObj.code = '-1'
        resultObj.msg = 'upload error'
        res.send(JSON.stringify(resultObj));
    }

    fs.readFile(req.files[0].path, (err, data) => {
        if (err) {
            console.log('Error');
            resultObj.code = '-1'
            resultObj.msg = 'upload error'
            res.send(JSON.stringify(resultObj));
        } else {
            var originalname = fomartTime(new Date()) +"!==!"+ req.files[0].originalname
            var dir_file = configDir + '/localfile/'
            console.log('dir_file => ' + dir_file);
            if (!fs.existsSync(dir_file)) {
                fs.mkdirSync(dir_file);
            }
            dir_file = dir_file + originalname;

            fs.writeFile(dir_file, data, (err) => {
                resultObj.code = '200'
                resultObj.msg = 'upload success'
                resultObj.filepath = dir_file
                resultObj.filename = req.files[0].originalname
                console.log(resultObj);
                res.send(JSON.stringify(resultObj));
            })
        }
    })
})

appserver.get('/download', async (req, res) => {

    console.log(JSON.stringify(req.query))

    if (!req.query.filepath || !req.query.filename) {
        resultObj.code = '-1'
        resultObj.msg = '请传入地址或者文件名'
        res.send(JSON.stringify(resultObj))
        return;
    }

    // 实现文件下载 
    var filePath = req.query.filepath;
    let filename = req.query.filename

    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Length': stats.size
        });
        res.attachment(filename)

        var stream = fs.createReadStream(filePath);
        stream.pipe(res)
        stream.on('close', function () {
            res.end("下载完成：" + filename);
        });
    } else {
        res.end(404);
    }
})

appserver.get("/qrcode", async (req, res, next) => {
    var baseUrl = req.query.text
    const temp_qrcode = qr_image.image(baseUrl);
    res.type("png");
    temp_qrcode.pipe(res);
});

var server = appserver.listen(3000, function () {
    // var host = server.address().address;
    // var port = server.address().port;
    console.log('Server is running at http://localhost:3000');
});