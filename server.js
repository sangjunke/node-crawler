var model = require('./model');
var questionID = '292901966'; //问题id
var offset = 0; //开始位置
var total = '100'; //总数默认  大于10
var basicPath = 'https://www.zhihu.com/api/v4/questions/' + questionID + '/answers?include='//基本url

const main = async (urls,offset) => {
    let index = 0;//控制循环下载
    let url=urls+'content' + '&offset=' + offset + '&limit=1';//content为主要获取的参数，里面包含图片
    const data = await model.getPage(url);
    if (offset == 0) {
        total = JSON.parse(data.res).paging.totals;//设置总数
    }
    var data1 = JSON.parse(data.res).data[0].content.replace(/<\/?noscript>/gm, '');
    var list = model.getUrl(data1);
    eachList(list, index);
};
const eachList = async (list, index) => {
    if (index == list.length) {
        offset++;
        if (offset < total) {
            await main(basicPath,offset); //进行下一页图片组的爬取。
        }
        return false;
    }
    await model.downloadImage(list[index]);
    index++;
    eachList(list, index);
}
main(basicPath,offset);