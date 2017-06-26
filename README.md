# 4Ubuntu
本repo用于管理部署在ubuntu server上的项目代码

### E-Session
- 实现NodeJS中session存储的中间件FileStore
- 使用文件的方式存储session信息
- 文件名即是sessionId，文件中存储session过期时间等信息

### NpmModule（subtitle）
- 实现一个npm module demo
- malarkey库：实现文字打字机的效果
- 对malarkey进行封装，保留malarkey的配置方式，新增可传入数组，实现一组文字打字机效果

### PersonalInfo
- 简易个人页

### cookie
- cookie实验（NodeJS）

### subtitle-demo
- Module subtitle使用demo

### waterline-demo
- 使用waterline的实验demo

### weixin-token
- 将获取微信公众号token的功能模块化
- 每次获取前检验存储在文件中的token是否过期。过期，则重新获取；未过期，则直接使用。
