var fs = require('fs-extra');
var writeFileAtomic = require('write-file-atomic');

module.exports = function(session) {
    var Store = session.Store;

    /**
     * 构造函数
     * @param {*} options 
     */
    function FileStore(storeFilePath, options) {
        var self = this;

        options = options || {};
   
        Store.call(self, options);

        options.path = storeFilePath || './sessions';
        options.ttl = options.ttl || 3600;

        self.options = options;

        fs.mkdirsSync(self.options.path);

    }

    // FileStore继承于session中的Store对象
    FileStore.prototype.__proto__ = Store.prototype;

    /**
     * Required Method
     */
    FileStore.prototype.destroy = function(sid, callback) {
        console.log('Method: Destroy');
        var sessionPath = this.options.path + '/' + sid + '.json';

        fs.remove(sessionPath, callback);
    };

    FileStore.prototype.get = function(sid, callback) {
        console.log('Method: Get');
 
        // 根据sessionID在指定目录下读取存储信息的文件（文件格式为json）
        var sessionPath = this.options.path + '/' + sid + '.json';

        var self = this;

        fs.readFile(sessionPath, 'utf-8', function readCallback(err, data) {
            if (!err) {
                var json;
                try {
                    json = JSON.parse(data);
                } catch (parseError) {
                    return fs.remove(sessionPath, function (removeError) {
                        if (removeError) {
                            return callback(removeError);
                        }

                        callback(parseError);
                    });
                }
                // 验证session是否已过期，过期则返回null
                if (!err) {
                    return callback(null, isExpired(json, self.options) ? null : json);
                }
            } else {
                callback(err)
            }
        });

    };

    FileStore.prototype.set = function(sid, session, callback) {
        console.log('Method: Set');
        try {
            session.__lastAccess = new Date().getTime();

            var sessionPath = this.options.path + '/' + sid + '.json';

            var json = JSON.stringify(session);

            writeFileAtomic(sessionPath, json, function (err) {
                if (callback) {
                    err ? callback(err) : callback(null, session);
                }
            });
        } catch (err) {
            if (callback) callback(err);
        }

    };

    /**
     * Recommended Method
     */
    
    FileStore.prototype.touch = function(sid, session, callback) {
        this.get(sid, session, function(err, originalSession) {
            if (err) {
                callback(err, null);
                return;
            }

            if (session.cookie) {
                originalSession.cookie = session.cookie;
            }

            this.set(sid, originalSession, callback);
        })
    };

    /**
     * Optional Method
     */

    // FileStore.prototype.clear = function(callback) {
    //     Store.clear.call(this, callback);
    // };

    // FileStore.prototype.length = function(callback) {
    //     Store.length.call(this, callback);
    // };

    // FileStore.prototype.all = function(callback) {
    //     Store.all.call(this, callback);
    // };

    return FileStore;
}

// var decrypt = function(options, data, sessionId) {
    
// }

// 判断session是否已过期
var isExpired = function(session, options) {
    if (!session) return true;

    var ttl = session.cookie && session.cookie.originalMaxAge ? session.cookie.originalMaxAge : options.ttl * 1000;

    return !ttl || session.__lastAccess + ttl < new Date().getTime();
}