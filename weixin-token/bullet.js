var https = require('https');

window.onload = function() {

    // Get code
    var url = window.location.search;

    localStorage.removeItem("nickname");

    if (url.split('?')[1].split('&').length < 2) return;

    var code = url.split('?')[1].split('&')[0].split('=')[1];

    // var header = new Headers({
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": "application/json;charset=utf-8"
    // });

    // var option = {
    //     method: 'GET',
    //     headers: header,
    //     mode: 'no-cors'
    // };

    // var queryUrl = "/wechat/getUserName?code=" + code;

    // var request = new Request(queryUrl, option);

    // fetch(request)
    //     .then(function(response) {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             return response;
    //         }  
    //     })
    //     .then(function(json) {  
    //         localStorage.setItem("nickname", json.nickname);
    //     });


    var httpRequest = new XMLHttpRequest(),
        url = "/wechat/getUserName?code=" + code;

    if (!httpRequest) {
        cosole.log("Cannot create an XMLHTTP instance")
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var response = JSON.parse(httpRequest.responseText);
                localStorage.setItem("nickname", response.nickname);
            } else {
                // alert('There was a problem with the request.');
            }
        }
    }

    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Content-Type', "application/json");
    httpRequest.send();

    var height = document.getElementsByClassName('bullet-content')[0].offsetHeight,
        width = document.getElementsByClassName('bullet-content')[0].offsetWidth,
        bullet = ["Hello, World!"],
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
            { "transform": 'translateX(' + width + 'px)'},
            { "transform": 'translateX(-300px)'},
            { "-webkit-transform": 'translateX(' + width + 'px)'},
            { "-webkit-transform": 'translateX(-300px)'},
            { "-ms-transform": 'translateX(' + width + 'px)'},
            { "-ms-transform": 'translateX(-300px)'},
            { "-moz-transform": 'translateX(' + width + 'px)'},
            { "-moz-transform": 'translateX(-300px)'}     

        ], {
            duration: Math.random() * (maxDuration - minDuration) + maxDuration,
            iterations: Infinity
        })
        counter++;
    }

    // Add click listener on submit button
    document.getElementsByClassName('submit-btn')[0].addEventListener("click", function(e) {
        var bulletContent = document.getElementsByClassName('bullet-input')[0].value;

        if (bulletContent.length == 0) return;

        if (localStorage.getItem("nickname") == null) {
            pushBulletContent(bulletContent);
        } else {
            pushBulletContent(localStorage.getItem("nickname") + ": " + bulletContent);
        }
        
        document.getElementsByClassName('bullet-input')[0].value = "";
    }, false);

    // Add keypress listener on input (check "Enter" press)
    document.getElementsByClassName('bullet-input')[0].addEventListener("keypress", function(e) {
        if (e.which == 13) {
            var bulletContent = document.getElementsByClassName('bullet-input')[0].value;
        
            if (bulletContent.length == 0) return;

            if (localStorage.getItem("nickname") == null) {
                pushBulletContent(bulletContent);
            } else {
                pushBulletContent(localStorage.getItem("nickname") + ": " + bulletContent);
            }

            document.getElementsByClassName('bullet-input')[0].value = "";
        }
    }, false);
    
}