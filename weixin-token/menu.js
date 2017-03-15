var VERIFY = require('./verifyAccessToken.js'),
    VERIFY_INFO,
    readInfoPromise = new Promise(function(resolve, reject) {
         VERIFY_INFO = VERIFY.getAccessToken();
         resolve("Get access token successfully.")
    });


readInfoPromise.then(function() {
    console.log("VERIFY_INFO");
    console.log(VERIFY_INFO);
})



