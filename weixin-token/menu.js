var verify_info = require('token.json'),
    fs = require('fs'),
    http = require('http');

if (!checkAccessToken()) getAccessToken();

function getAccessToken() {
    var appid = verify_info.appid,
        appsecret = verify_info.appsecret;

    http.get({
        hostname: "api.weixin.qq.com",
        port: "80",
        path: "/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret
    }, function(res) {
        console.log(res);
    })
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