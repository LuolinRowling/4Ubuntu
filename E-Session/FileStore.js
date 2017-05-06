var fs = require('fs-extra');
var writeFileAtomic = require('write-file-atomic');
var Bagpipe = require('bagpipe');

module.exports = function(session) {
    var Store = session.Store;

    /**
     * 构造函数
     * @param {object} options 配置项
     */
    function FileStore(storeFilePath, options) {
        var self = this;

        options = options || {};
   
        Store.call(self, options);

        // session保存目录
        options.path = storeFilePath || './sessions';
        // session过期时间（秒），默认为3600
        options.ttl = options.ttl || 3600;
        // 定期检测session过期时间（秒），默认为3600
        options.reapInterval = options.reapInterval || 3600;
        // 在定期检测与删除session时的并发数
        options.reapMaxConcurrent = options.reapMaxConcurrent || 5;

        self.options = options;

        // 建立存储session的目录
        fs.mkdirsSync(self.options.path);

        scheduleReap(self);
    }

    // FileStore继承于session中的Store对象
    FileStore.prototype.__proto__ = Store.prototype;

    /**
     * Required Method
     */

    /**
     * 销毁sessionId
     * @param {string} sid 要销毁的sessionId
     * @param {function} callback 回调函数
     */
    FileStore.prototype.destroy = function(sid, callback) {
        console.log('Method: Destroy');
        var sessionPath = this.options.path + '/' + sid + '.json';

        fs.remove(sessionPath, callback);
    };

    /**
     * 获取该sessionId的信息
     * @param {string} sid 要获取的sessionId
     * @param {function} callback 回调函数
     */
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

    /**
     * 设置sessionId的信息（新增或更新）
     * @param {string} sid sessionId
     * @param {object} session session对象实例
     * @param {function} callback 回调函数
     */
    FileStore.prototype.set = function(sid, session, callback) {
        console.log('Method: Set');
        try {
            session.__lastAccess = new Date().getTime();

            var sessionPath = this.options.path + '/' + sid + '.json';

            // 对应的session实例转为JSON格式
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

/**
 * 判断session是否已过期
 * @param {object} session session对象实例
 * @param {object} options 配置项
 */
var isExpired = function(session, options) {
    if (!session) return true;

    var ttl = session.cookie && session.cookie.originalMaxAge ? session.cookie.originalMaxAge : options.ttl * 1000;

    return !ttl || session.__lastAccess + ttl < new Date().getTime();
}

/**
 * 定期检测过期session并清理
 * @param {object} fileStore FileStore实例 
 * @param {function} callback 回调函数
 */
var scheduleReap = function(fileStore, callback) {
    callback || (callback = function() {

    });

    fileStore.options.reapIntervalObject = setInterval(function() {
        fs.readdir(fileStore.options.path, function(err, files) {
            if (err) return callback(err);
            
            if (files.length === 0) return callback();

            var bagpipe = new Bagpipe(fileStore.options.reapMaxConcurrent);

            var errors = [];
            files.forEach(function(file, i) {

                var sid = file.split('.')[0];
                console.log(sid)
                
                bagpipe.push(function() {
                    fileStore.get(sid, function(err, data) {
                        if (err) return callback();

                        // data为空，则sessionId过期
                        if (!data) {
                            fileStore.destroy(sid, callback);
                        }
                    })
                }, sid, fileStore.options, function(err) {
                    if (err) {
                        errors.push(err);
                    }
                    if (i >= files.length - 1) {
                        errors.length > 0 ? callback(errors) : callback();
                    }
                });


            })
        })
    }, fileStore.options.reapInterval * 1000);
}