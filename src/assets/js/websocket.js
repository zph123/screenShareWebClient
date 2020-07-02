// const init = new WebSocket("ws://192.168.0.104:9501");
function init(){
	// return new WebSocket(ws);
	return new WebSocket("wss://"+process.env.VUE_APP_WSS_HOST+":"+process.env.VUE_APP_WSS_PORT);
	// return new WebSocket("ws://192.168.0.103:9501");
}
function onopen(ws,sendMessage='') {
    ws.onopen = function () {
		if(sendMessage!='') {
			sendMessage=JSON.stringify(sendMessage)
			ws.send(sendMessage);
		}
    };
}
function send(ws,sendMessage){
    sendMessage=JSON.stringify(sendMessage)
    ws.send(sendMessage);
}

function onmessage(ws,_this) {
	ws.onmessage = function (evt) {
		// const reciveMessage=evt.data
		const messageData=JSON.parse(evt.data)
		const getType=messageData.type
		// eval(getType+'('+reciveMessage+')');
		_this[getType](messageData)
	};
}
function onclose(ws) {
	ws.onclose = function () {
		// 关闭 websocket
		// alert("连接已关闭...");
	};
}
export default {
    init,
    onopen,
    send,
    onmessage,
    onclose,
}

// function serverOnopen(ws) {
//     ws.onopen = function () {
//         // Web Socket 已连接上，使用 send() 方法发送数据
//         let sendMessage={'type':'createRoom'}
//         sendMessage=JSON.stringify(sendMessage)
//         ws.send(sendMessage);
//     };
// }
// function clientOnopen(ws) {
//     ws.onopen = function () {
//         // Web Socket 已连接上，使用 send() 方法发送数据
//         // let sendMessage={'type':'joinRoom','data':{'roomId':'1'}}
//         // sendMessage=JSON.stringify(sendMessage)
//         // ws.send(sendMessage);
//     };
// }
// function send(ws, data) {
//     data=JSON.stringify(data)
//     ws.send(data);
// }
