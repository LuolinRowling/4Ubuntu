var http = require('http'),
    qs = require('qs');

var PORT = 8888,
    TOKEN = "sspku_ll";

function checkSignature(params, token) {
    var key = [token, params.timestamp, params.nonce].sort().join(''),
        sha1 = require('crypto').createHash('sha1');

    sha1.update(key);

    return sha1.digest('hex') == params.signature;
}

var server = http.createServer(function(request, response) {

    console.log("here!");
    
    var query = require('url').parse(request.url).query,
        params = qs.parse(query);

    console.log(params);
    console.log("token->", TOKEN);

    if (checkSignature(params, TOKEN)) {
        response.end(params.echostr);
    } else {
        response.end('signature fail');
    }

    if (request.method == "GET") {
        response.end(params.echostr);
    } else {
        var postdata = "";

        request.addListener("data", function(postchunk) {
            postdata +=postchunk;
        });

        request.addListener("end", function() {
            console.log(postdata);
            response.end('success');
        });
    }
});

server.listen(PORT);

console.log("Server running at port: " + PORT + ".");