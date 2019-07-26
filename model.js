const rp = require('request-promise'); //加载rp模块
const fs = require('fs'); //加载fs模块
const request = require('request');
const path = require('path');
var Bagpipe = require('bagpipe');
const cheerio = require('cheerio'); //加载cheerio模块
var bagpipe = new Bagpipe(10);
var index1 = 1;//显示下载数量
module.exports = {
    async getPage(url) {
        const data = {
            url,
            res: await rp({
                url: url
            })
        };
        return data;
    },
    getUrl(data) {
        let list = [];
        const $ = cheerio.load(data); //将html转换为可操作的节点
        $('img').each(async (index, item) => {
            if (item.attribs.class.indexOf('lazy') == -1 && item.attribs.width > 750) {
                let obj = {
                    name: item.attribs.src.split("/")[item.attribs.src.split("/").length - 1],
                    url: item.attribs.src
                };
                list.push(obj); //将目录地址返回
            }
        });
        return list;
    },
    async downloadImage(item) {
        var destImage = path.resolve("./imgs", item.name);
        bagpipe.push(this.download, item.url, destImage, function (err, data) {
            console.log("[" + index1++ + "]: " + data);
        });
    },
    download(src, dest, callback) {
        if (src) {
            request(src).pipe(fs.createWriteStream(dest)).on('close', function () {
                callback(null, dest);
            });
        }
    }
}