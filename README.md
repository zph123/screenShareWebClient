##简介
基于webrtc的一对一屏幕分享项目的web client部分

## 安装说明

1. 首先安装nodejs（最好和websocket server安装到同一台ip上，共用同一个ssl证书，要不然还要弄两个域名）

    `https://nodejs.org/en/download/`

2. 下载代码

    `git clone xxxxx`
    
3. 进入项目

    `cd xxxxx`   
    
4. 下载依赖

    `npm install`
   
6. 复制配置文件

    `cp .env.example .env` 

7. 更改配置文件.env，把xxx替换成自己的内容
    ```
	VUE_APP_URL_HOST = www.xxx.com
	VUE_APP_URL_PORT = 8081
	#一般证书会给两个文件，需要去自己转化第三个文件，参考网址 https://www.jianshu.com/p/3e660cb3cf32
	VUE_APP_SSL_KEY = /data/sslcert/3800167_www.xxx.com.key
	VUE_APP_SSL_CRT = /data/sslcert/3800167_www.xxx.com.crt
	VUE_APP_SSL_PEM = /data/sslcert/3800167_www.xxx.com.pem
	VUE_APP_WSS_HOST = www.xxx.com
	VUE_APP_WSS_PORT = 9501

	#有stun的时候,一定要把xxx换成自己实际的有效值
	#VUE_APP_WEBRTC_PCCONFIG={"iceServers":[{'urls':'stun:xxx.xxx.xxx.xxx:xxx'},{"urls":"turn:xxx.xxx.xxx.xxx:xxx","username":"xxx","credential":"xxx"}]}
	#没有有stun的时候，默认为空，局域网内可通讯
	VUE_APP_WEBRTC_PCCONFIG = ''
    ```
 
8. 启动进程web页面服务
 
    输入
    `npm run serve`
    看到
    ` DONE  Compiled successfully in 10347ms`
    说明启动成功
    
10. 打开https://www.xxx.com:8081/createroom 创建一个分享
	页面展示（影院号和观影码），点击（创建）会请求麦克风和桌面的授权，授权后创建成功，点击右上角（分享观影码），分享观看地址。

11. 观看者访问https://www.xxx.com:8081/joinroom?roomId=xx 加入房间后可以进行语音聊天，且能看到分享者的屏幕
    
# vue常用命令如下

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
