var https = require('https'),
    VERIFY_INFO = require('./token.json');

window.onload = function() {

    // Get code
    var url = window.location.search;

    if (url.split('?')[1].split('&').length < 2) return;

    var CODE = url.split('?')[1].split('&')[0].split('=')[1];

    var options = {
        host: "api.weixin.qq.com",
        port: 443,
        path: "/sns/oauth2/access_token?appid=" + VERIFY_INFO.appid + "&secret=" + VERIFY_INFO.appsecret + "&code=" + CODE + "&grant_type=authorization_code",
        method: "GET"
    }

    var req = https.request(options, function(res) {
        var responseText = "";

        res.on('data', function (data) {
            responseText += data;
        });

        res.on('end', function () {

            console.log(responseText);

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

    var height = document.getElementsByClassName('bullet-content')[0].offsetHeight,
        width = document.getElementsByClassName('bullet-content')[0].offsetWidth,
        bullet = ["hello", "world", "hello", "world", "hello", "world", "hello", "world"],
        counter = 0,
        color = ['#000', '#337ab7', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'],
        maxDuration = 5000,
        minDuration = 2000;

    var screen = document.getElementsByClassName('bullet-content')[0];

    for (var i = 0; i < bullet.length; i++) {
        pushBulletContent(bullet[i]);
    }

    // Push bullet content to the screen
    function pushBulletContent(bulletContent) {
        var elem = document.createElement("div");

        elem.style.color = color[counter % color.length];
        elem.style.fontSize = "1.2rem";
        elem.style.position = "absolute";
        elem.style.top = (height / 10 * Math.random() * ( 9 - 0 )) + "px";
        elem.innerHTML = bulletContent;

        screen.appendChild(elem);
        elem.animate([
            { transform: 'translateX(' + width + 'px)'},
            { transform: 'translateX(-300px)'}
        ], {
            duration: Math.random() * (maxDuration - minDuration) + maxDuration,
            iterations: Infinity
        })
        counter++;
    }

    // Add click listener on submit button
    document.getElementsByClassName('submit-btn')[0].addEventListener("click", function(e) {
        var bulletContent = document.getElementsByClassName('bullet-input')[0].value;
        pushBulletContent(bulletContent);
        document.getElementsByClassName('bullet-input')[0].value = "";
    }, false);

    // Add keypress listener on input (check "Enter" press)
    document.getElementsByClassName('bullet-input')[0].addEventListener("keypress", function(e) {
        if (e.which == 13) {
            var bulletContent = document.getElementsByClassName('bullet-input')[0].value;
            pushBulletContent(bulletContent);
            document.getElementsByClassName('bullet-input')[0].value = "";
        }
    }, false);
    
}