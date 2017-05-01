var express = require('express'),
    cookieParser = require('cookie-parser');

var app = express();

// 配置cookie解析器
app.use(cookieParser('helloworld'));

// 配置路由 read(GET)
app.get('/read', function(req, res, next) {
    res.json(req.cookies);
});

// 配置路由 write(GET)
app.get('/write', function(req, res, next) {
    // 设置Session的domian和path
    // res.cookie('my_cookie', 'hello', {domain: 'www.abc.com', path: '/abc'});
    
    // 设置2分钟后过期
    // res.cookie('my_cookie', 'hello', {
    //     expires: new Date(Date.now() + 2*60*1000)
    // })

    res.cookie('a', '123');
    res.cookie('b', '456', {httpOnly: true, signed: true})
    // res.json(req.cookies);
    res.json(req.signedCookies);
});

// 监听端口3000
app.listen(3000);
console.log("Server running at port: 3000.");