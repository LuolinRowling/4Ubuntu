(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.onload = function() {

    // Get code
    var url = window.location.search;

    if (url.split('?')[1].split('&').length < 2) return;

    var code = url.split('?')[1].split('&')[0].split('=')[1];

    // var header = new Headers({
    //     "Access-Control-Allow-Origin": "*"
    // });

    // var option = {
    //     method: 'GET',
    //     headers: header,
    //     mode: 'no-cors'
    // };

    // var queryUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+ VERIFY_INFO.appid +"&secret="+ VERIFY_INFO.appsecret +"&code="+ CODE +"&grant_type=authorization_code";

    // var request = new Request(queryUrl, option);

    // console.log(queryUrl);

    // fetch(request)
    //     .then(function(response) {
    //         return response;
    //     })
    //     .then(function(json) {  
    //         console.log(json);
    //     });

    var data = {
        code: code
    }

    var httpRequest = new XMLHttpRequest(),
        url = "https://luolin.me:9999" + "/getUserName"

    if (!httpRequest) {
        cosole.log("Cannot create an XMLHTTP instance")
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var response = JSON.parse(httpRequest.responseText);
                console.log(response);
            } else {
                alert('There was a problem with the request.');
            }
        }
    }

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', "application/json");
    httpRequest.send(data);

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
},{}]},{},[1]);
