var $ = require('jquery');

var ip = "118.89.233.249",
    port = "8888";


$('#login').on('click', function() {
    var data = {
        username: "admin",
        password: "123456"
    };

    var url = "http://" + ip + ":" + port + "/login";

    console.log("Testing: " + url);

    $.ajax({
        url: url,
        dataType: "json",
        method: "POST",
        data: data,
        success: function(data) {
            console.log("success!");
            console.log(data);
        },
        error: function(err) {
            console.log("error!");
            console.log(err);
        }
    });
});

$('#logout').on('click', function() {
    var data = {
        username: "admin"
    };

    var url = "http://" + ip + ":" + port + "/logout";

    console.log("Testing: " + url);

    $.ajax({
        url: url,
        dataType: "json",
        method: "POST",
        data: data,
        success: function(data) {
            console.log("success!");
            console.log(data);
        },
        error: function(err) {
            console.log("error!");
            console.log(err);
        }
    });
});

$('#search').on('click', function() {
    var data = {
        id: "?",
        name: ["罗琳", "陈娴"],
        grade: [2012, 2014],
        phone: ["15652957519", "15913999325"],
        university: ["北京大学", "北京交通大学"],
        association: ["北京", "广东"],
        organization: ["公司一"],
        status: 0,
        degree: ["本科", "硕士"],
        page: 1
    };
  
    var url = "http://" + ip + ":" + port + "/search";

    console.log("Testing: " + url);

    $.ajax({
        url: url,
        dataType: "json",
        method: "POST",
        data: data,
        success: function(data) {
            console.log("success!");
            console.log(data);
        },
        error: function(err) {
            console.log("error!");
            console.log(err);
        }
    });
});

$('#modify').on('click', function() {
    var data = {
        id: "",
        grade: 2015,
        name: "罗琳",
        sex: "女",
        phone: "15652957519",
        qq: "368003964",
        mail: "368003964@qq.com",
        home: "汕头金平",
        association: "北京",

    };

    var url = "http://" + ip + ":" + port + "/modify";

    console.log("Testing: " + url);

    $.ajax({
        url: url,
        dataType: "json",
        method: "POST",
        data: data,
        success: function(data) {
            console.log("success!");
            console.log(data);
        },
        error: function(err) {
            console.log("error!");
            console.log(err);
        }
    });
});

$('#fetch').on('click', function() {
    var data = {
        
    };

    var url = "http://" + ip + ":" + port + "/fetch";

    console.log("Testing: " + url);

    $.ajax({
        url: url,
        dataType: "json",
        method: "POST",
        data: data,
        success: function(data) {
            console.log("success!");
            console.log(data);
        },
        error: function(err) {
            console.log("error!");
            console.log(err);
        }
    });
});