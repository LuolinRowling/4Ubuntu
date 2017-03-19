'user strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    https = require('https'),
    URL = require('url'),
    INFO = require('./token.json');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/wechat/getUserName', function(req, res) {
    console.log("/getUserName");

	var code = URL.parse(req.url, true).query.code;

    console.log("code: " + code);

    var responseText = "";

    https.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + INFO.appid + "&secret=" + INFO.appsecret + "&code=" + code + "&grant_type=authorization_code", (openidRes) => {

        openidRes.on('data', (d) => {
            responseText += d;
        });

        openidRes.on('end', () => {
            console.log(responseText);  

            console.log(JSON.stringify(responseText).access_token);
            console.log(JSON.parse(responseText).access_token);
            console.log(eval("(" + responseText + ")").access_token);
            console.log(typeof(JSON.stringify(responseText)));
            // var access_token = responseText["access_token"],
            //     openid = JSON.parse(responseText).openid,
            //     responseText = "";

            // https.get("https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN", function(nicknameRes) {
            //     nicknameRes.on('data', (d) => {
            //         responseText += d;
            //     })

            //     nicknameRes.on('end', () => {
            //         var obj = {
            //             nickname: JSON.parse(responseText).nickname
            //         }
            //         console.log(obj);
            //         res.send(obj);
            //     })
            // })
        });
    }).on('error', (e) => {
        console.error(e);
    });
    // var options = {
    //     host: "api.weixin.qq.com",
    //     port: 443,
    //     path: "/sns/oauth2/access_token?appid=" + INFO.appid + "&secret=" + INFO.appsecret + "&code=" + code + "&grant_type=authorization_code",
    //     method: "GET"
    // }
    
    // console.log(options.path);

    // var openidReq = https.request(options, function() {
    //     var responseText = "";

    //     openidReq.on('data', function (data) {
    //         responseText += data;
    //         console.log('has data')
    //     });

    //     openidReq.on('end', function () {
    //         console.log("end");
    //         console.log(responseText);
    //         res.send({nickname: "hello"})
    //         // var json = JSON.parse(responseText);

    //         // var options = {
    //         //     host: "api.weixin.qq.com",
    //         //     port: 443,
    //         //     path: "/sns/userinfo?access_token=" + json["access_token"] + "&openid=" + json["openid"] + "&lang=zh_CN",
    //         //     method: "GET"
    //         // }

    //         // var request = https.request(options, function() {
    //         // var responseText = "";

    //         //     request.on('data', function (data) {
    //         //         responseText += data;
    //         //     });

    //         //     request.on('end', function () {
    //         //         console.log(responseText);
    //         //         var obj = {
    //         //             nickname: JSON.parse(responseText)["nickname"]
    //         //         }
    //         //         console.log(obj);
    //         //         res.send(obj);
    //         //     });
    //         // })

    //         // request.on("error", function(e) {
    //         //     console.log(e);
    //         // });

    //         // request.end();
    //     });
    // })

    // openidReq.on('error', function(e) {
    //     console.log(e);
    // });

    // openidReq.end();
});


app.listen(9999);
console.log('Listening on port 9999...');
