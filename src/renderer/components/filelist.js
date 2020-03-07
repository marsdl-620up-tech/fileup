import fs from 'fs'
import os from 'os'
import electron from 'electron'

export const getLocalFileList = () => {
    const filePath = os.homedir() + "/fileup/localfile";
    let fileNameArr = []
    fs.readdir(filePath, function (err, files) {
        if (err) {
            return fileNameArr
        } else {
            files.forEach(function (filename) {
                let fileObj = {};
                fileObj.filename = filename
                fileObj.originName = filename.replace(/\d+\!\=\=\!/, "")
                fileNameArr.push(fileObj)
            });
        }
    });
    return fileNameArr
}

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
    fs.unlink(filePath, function (err) {
        if (err) {
            console.log("An error ocurred updating the file" + err.message)
            return false;
        }
        console.log("File succesfully deleted")
        return true;
    })
    return true;
} 