import fs from 'fs'
import os from 'os'
import electron from 'electron'

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
export const getLocalFileList = () => {
    debugger;
    const filePath = os.homedir() + "/fileup/localfile";
    //根据文件路径读取文件，返回文件列表
    fs.readdirSync(filePath, function (err, files) {
        let fileNameArr = []
        if (err) {
            return fileNameArr
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                let fileObj = {};
                fileObj.filename = filename
                fileObj.originName = filename.replace(/\d+\!\=\=\!/, "")
                //获取当前文件的绝对路径
                fileNameArr.push(fileObj)
                
                // var filedir = path.join(filePath, filename);
            });
            console.log(JSON.stringify(fileNameArr))
            return fileNameArr
        }
    });
    console.log(filePath)
}


//获取本机ip
export const getLocalIp = () => {
    var iptable = [], ifaces = os.networkInterfaces();

    for (var dev in ifaces) {
        if (dev.indexOf('VMware') != -1) {
            continue;
        }
        ifaces[dev].forEach(function (details, alias) {
            if (details.family == 'IPv4' && details.address != '127.0.0.1') {
                iptable.push(details.address);
            }
        });
    }
    return iptable
}

//复制copyUrl这个参数进入剪贴板
export const copyClickBoard = (copyUrl) => {
    debugger;
    if (!copyUrl) {
        return false;
    }
    const clipboard = electron.clipboard
    if (!clipboard) {
        return false;
    }
    clipboard.writeText(copyUrl)
    return true
}

export const generateShareUrl = (filepath, filename) => {
    const iptables = getLocalIp()
    let urlList = []
    for (var value of iptables) {
        let ipItem = {};
        let shareUrl =
            "http://" +
            value +
            ":3000/download?filepath=" +
            encodeURIComponent(filepath) +
            "&filename=" +
            encodeURIComponent(filename);

        ipItem.shareUrl = shareUrl;
        ipItem.qrCodeUrl =
            "http://localhost:3000/qrcode?text=" + encodeURIComponent(shareUrl);

        urlList.push(ipItem);
    }
    return urlList;
}

export const deleteFileByFileName = (filename) => {
    if (!filename) {
        return false;
    }
    const filePath = os.homedir() + "/fileup/localfile/" + filename
    try {
        fs.unlinkSync(filePath)    
        return true;
    } catch (error) {
        return false
    }
}