var verify_info = require('./token.json'),
    fs = require('fs'),
    https = require('https');

exports.getAccessToken = function() {
    if (!checkAccessToken()) {
        console.log("No Access Token.");
        getAccessToken();
    } else {
        return verify_info;
    }
}

function getAccessToken() {
    var appid = verify_info.appid,
        appsecret = verify_info.appsecret,
        update_time = verify_info.update_time;

    var options = {
        host: "api.weixin.qq.com",
        port: 443,
        path: "/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret,
        method: "GET"
    }

    var req = https.request(options, function(res) {
        var responseText = "",
            size = 0;
        
        res.setEncoding('utf8');

        res.on('data', function (data) {
            responseText += data;
            size += data.length;
        });

        res.on('end', function () {
            // console.log(responseText);

            if (JSON.parse(responseText)["access_token"] == undefined) {
                var obj = {
                    appid: verify_info.appid,
                    appsecret: verify_info.appsecret,
                    access_token: "",
                    update_time: update_time
                }
            } else {
                var obj = {
                    appid: verify_info.appid,
                    appsecret: verify_info.appsecret,
                    access_token: JSON.parse(responseText)["access_token"],
                    update_time: Date.now()
                }
            }

            verify_info = obj;

            var write_promise = new Promise(function(resolve, reject) {
                fs.writeFileSync('./token.json', JSON.stringify(obj));
                resolve("success");
            });

            write_promise.then(function() {
                console.log("success")
                console.log(verify_info)
                return verify_info;
            })

        });
    })

    req.on("error", function(e) {
        console.log(e);
    });

    req.end();
}

function checkAccessToken() {
    // no access token
    if (verify_info.access_token.length == 0) return false;
    
    // check whether access token out of date
    var update_time = verify_info.update_time;
    if (Date.now() - update_time >= 7000 * 1000) {
        return false;
    } else {
        return true;
    }

}