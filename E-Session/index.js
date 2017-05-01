var express = require('express'),
    parseurl = require('parseurl'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    uuid = require('uuid'),
    clone = require('clone');


var app = express();

// 配置Session
// app.use(session({
//     secret: 'hello world',
//     resave: false,
//     saveUninitialized: true
// }));

function my_session() {
    var data = {};
    return function(req, res, next) {
        // 获取或生成id
        var id = req.signedCookies.session_id || uuid.v4();
        
        // 配置cookie
        res.cookie('session_id', id, {
            maxAge: 600000,
            path: '/',
            httpOnly: true,
            signed: true
        });

        // 获取session的值
        req.session = clone(data[id] || {});
        res.on('finish', function() {
            console.log('save session: ', req.session);
            data[id] = clone(req.session);
        });
        next();
    }
}

app.use(cookieParser('helloworld'));
app.use(my_session());

// 挂载中间件函数
app.use(function(req, res, next) {
    var views = req.session.views;
    if (!views) {
        views = req.session.views = {}
    }

    // 获取解析后的url路径名
    var pathname = parseurl(req).pathname;

    // 计数，若views对象不存在pathname属性，即未曾访问过，则初始为0
    views[pathname] = (views[pathname] || 0) + 1;
    next();
})


app.get('/foo', function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + " times");
});

app.get('/bar', function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + " times");
});

app.listen(3000);
console.log("Web server has started on http://127.0.0.1:3000");