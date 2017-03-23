var verify_info = require('./token.json'),
    fs = require('fs'),
    https = require('https'),
    resolve_func; // Promise中的resolve方法，为供多个函数使用，将其作为全局变量

/**
 * 对外提供的方法，获取access_token
 * return Promise实例，包含access_token，可通过then中的回调函数的参数获得
 */
exports.getAccessToken = function() {
    return new Promise(function(resolve, reject) {
        resolve_func = resolve;
        // 判断本地的access_token是否失效
        if (!isAccessTokenValid(verify_info)) {
            console.log("No Access Token.");
            // 失效则重新获取
            queryAccessToken();
        } else {
            // 为失效则执行resolve，将access_token等基本信息传给调用方
            resolve_func(verify_info);
        }
    })

}

/**
 * 向微信服务获取access_token
 */
function queryAccessToken() {
    var appid = verify_info.appid,
        appsecret = verify_info.appsecret,
        update_time = verify_info.update_time;

    // https请求的配置
    var options = {
        host: "api.weixin.qq.com",
        port: 443,
        path: "/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret,
        method: "GET"
    }

    var req = https.request(options, function(res) {
        var responseText = ""; // 存储从微信服务器获取的返回数据

        // 监听'data'事件，将获取到的数据拼接起来
        res.on('data', function (data) {
            responseText += data;
        });

        // 监听'end'事件，在response结束后执行
        res.on('end', function () {
            // console.log(responseText)

            // 解析responseText，若没有access_token的信息，则不更新最新获取access_token的时间
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

            // 将获取到的基本信息，写入服务器本地文件中存储起来
            fs.writeFile('./token.json', JSON.stringify(obj), function() {
                resolve_func(verify_info);
            })

        });
    })

    // 监听'error'，若失败则输出错误信息
    req.on("error", function(e) {
        console.log(e);
    });

    req.end();
}

/**
 * 判断access_token是否过期
 * @param {obj} verifyInfo 基本信息，包含access_token和上次更新时间
 */
function isAccessTokenValid(verifyInfo) {
    // 基本信息为空
    if (!verifyInfo) {
        return false;
    }

    // access_token为空，即从未获取或获取失败
    if (verifyInfo.access_token.length == 0) {
        return false;
    }

    // 以现在的时间判断是否过期
    if (Date.now() - verifyInfo.update_time >= 7000 * 1000) {
        return false;
    }
    
    return true;
}