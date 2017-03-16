var VERIFY = require('./verifyAccessToken.js');

VERIFY.getAccessToken().then(function(VERIFY_INFO) {
    console.log(VERIFY_INFO)
});