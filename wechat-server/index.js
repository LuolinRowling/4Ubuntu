'user strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    https = require('https'),
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

app.post('/getUserName', function(req, res) {

	var code = req.body.code;

    var options = {
        host: "api.weixin.qq.com",
        port: 443,
        path: "/sns/oauth2/access_token?appid=" + INFO.appid + "&secret=" + INFO.appsecret + "&code=" + code + "&grant_type=authorization_code",
        method: "GET"
    }
    
    var req = https.request(options, function(res) {
        var responseText = "";

        res.on('data', function (data) {
            responseText += data;
        });

        res.on('end', function () {
            console.log(responseText)
            // if (JSON.parse(responseText)["access_token"] == undefined) {
            //     var obj = {
            //         appid: verify_info.appid,
            //         appsecret: verify_info.appsecret,
            //         access_token: "",
            //         update_time: update_time
            //     }
            // } else {
            //     var obj = {
            //         appid: verify_info.appid,
            //         appsecret: verify_info.appsecret,
            //         access_token: JSON.parse(responseText)["access_token"],
            //         update_time: Date.now()
            //     }
            // }

            // verify_info = obj;

            // fs.writeFile('./token.json', JSON.stringify(obj), function() {
            //     resolve_func(verify_info);
            // })

        });
    })

    req.on("error", function(e) {
        console.log(e);
    });

    req.end();

});