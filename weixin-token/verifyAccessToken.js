var verify_info = require('./token.json'),
    fs = require('fs'),
    https = require('https'),
    resolve_func;

queryAccessToken();

exports.getAccessToken = function() {
    return new Promise(function(resolve, reject) {
        resolve_func = resolve;
        if (!isAccessTokenValid(verify_info)) {
            console.log("No Access Token.");
            queryAccessToken();
        } else {
            resolve_func(verify_info);
        }
    })

}

function queryAccessToken() {
    var appid = verify_info.appid,
        appsecret = verify_info.appsecret,
        update_time = verify_info.update_time;

    // var options = {
    //     host: "api.weixin.qq.com",
    //     port: 443,
    //     path: "/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret,
    //     method: "GET"
    // }

    var options = {
        host: "api.weixin.qq.com",
        port: 443,
        path: "/sns/oauth2/access_token?appid=" + appid + "&secret=" + appsecret + "&code=031erlV92bW5nP0HlEW92PJ1V92erlVK&grant_type=authorization_code",
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
}

function isAccessTokenValid(verifyInfo) {
    if (!verifyInfo) {
        return false;
    }
    if (verifyInfo.access_token.length == 0) {
        return false;
    }
    if (Date.now() - verifyInfo.update_time >= 7000 * 1000) {
        return false;
    }
    return true;
}