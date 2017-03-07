var https = require('https'),
    cheerio = require('cheerio');

https.get('https://gold.xitu.io/welcome', function(res) {
    var html = ""; // 存储抓取到的HTML源码
    var news = []; // 存储解析后的数据

    // 抓取页面内容
    res.on('data', function(chunk) {
        html += chunk;
    });

    // 网页抓取完毕
    res.on('end', function() {
        // console.log(html);
        console.log('抓取完毕！');
        decode(html);
    });

}).on('error', function(err) {
    console.log(err);
});

function decode(html) {
    if (html === undefined || html.length === 0) {
        console.log('未抓取到数据');
        return;
    };

    var $ = cheerio.load(html);

    $('.entries .entry-title').each(function(index) {
        if ($(this).text().trim().length > 0) {
            console.log((index + 1) + '. ' + $(this).text().trim());
        };
    });
};