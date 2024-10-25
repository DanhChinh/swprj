
var loginMessage = [1, "MiniGame", "SC_y2hpbmhz", null, { "info": "{\"ipAddress\":\"2405:4802:1f02:76f0:80b9:9e43:e48e:4170\",\"userId\":\"7fdfa57d-8014-4140-98cc-0e8698fe1e92\",\"username\":\"SC_y2hpbmhz\",\"timestamp\":1729242117545}", "signature": "0642BE77A1CE79ABE8FE276BFDEA2434C0D204EC1F56CC23A5CAF5FE34C8DA3C611E7C611BEDCE896587B8792CB9872A96636DE0691A6199E0EF7A8F05C311856FD9DC4B0E56B98DC3EF8E28E4C67DB4217C4D23E8C1E61F5D004730E0326787C2E5D68332F44E8FCE41A812305AAEF1BCFC104A4D5D9A835AAEEB3E6DF5B687" }];
var taixiuMessage = [6, "MiniGame", "taixiuPlugin", { "cmd": 1005 }];
var lobbyMessage = [6, "MiniGame", "lobbyPlugin", { "cmd": 10001 }];
var resultMessage = counter => [7, "Simms", counter, 0];
var counter = 0;
var regex = /^\[\s*5\s*,\s*{\s*"cBB":\s*-?\d+,\s*"gBB":\s*-?\d+,\s*"cmd":\s*-?\d+,\s*"d1":\s*-?\d+,\s*"d2":\s*-?\d+,\s*"d3":\s*-?\d+\s*}\s*]$/;

function betSomething(obj) {
    let {b, sid, eid, ...rest} = obj;
    const message = [6,"MiniGame","taixiuPlugin",{"cmd":1000,"b":b,"aid":1,"sid":sid,"eid":eid}];
    console.log(message)
    // socket.send(JSON.stringify(message));
}

function handle_1(obj){
    const {sid,  state, eid, b, ...rest } = obj;
    let tr = document.createElement("tr");
    tr.id = `${sid}`;
    tr.innerHTML = `<td>${sid}</td>
                    <td>${state}</td>
                    <td>${eid}</td>
                    <td>${b}</td>
                    <td id=${sid}_reward> </td>
                    `
    tbody.appendChild(tr)
}
function handle_2(obj){
    let {sid,  state, eid, b, result, reward,...rest } = obj
    let oldSid = +sid-1;
    let rwElement = document.getElementById(`${oldSid}_reward`);
    if(rwElement){
        rwElement.innerText = reward;
    }
}
// Thay đổi URL thành địa chỉ máy chủ WebSocket thực tế

var DATA = {
    "sid":0,
    "state":"######",
    "eid":"?",
    "b":0,
    "result":"",
    "reward":0,
    "isClicked":false   //fixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
}
var interval_reconnect;
var interval_disconnect;
var socket;
var socket_io;

/////////////////////socket_io////////////////////////////////////



function socket_io_connect(){
    socket_io = io('http://localhost:5000');

    socket_io.on('response', function(data) {
        console.log("Python server ->",data)
        DATA = JSON.parse(data)
    
        handle_2(DATA)
        if (DATA["isClicked"]){
            setTimeout(()=>{
                handle_1(DATA)
                betSomething(DATA)
            },25000)
        }
    
    });
    
    socket_io.on('connect', function() {
        console.log('Đã kết nối tới máy chủ Python');
        // socket_io.send('Gửi lời chào từ máy khách tới máy chủ Python');
    });
    
    socket_io.on('disconnect', function() {
        console.log('Disconnected from server');
    });
}

/////////////////////socket_webserver////////////////////////////////////
function socket_connect(){
    socket = new WebSocket('wss://websocket.azhkthg1.net/websocket');
    // wss://xdtl.azhkthg1.net/websocket
    socket.onopen = function (event) {
        console.log('Kết nối WebSocket đã mở.');
    
        socket.send(JSON.stringify(loginMessage));

        setTimeout(() => {
            socket.send(JSON.stringify(taixiuMessage));
            socket.send(JSON.stringify(lobbyMessage));
    
            interval_disconnect = setInterval(() => {
                socket.send(JSON.stringify(resultMessage(counter)));
                counter++;
            }, 2000)
    
        }, 3000)

        interval_disconnect = setTimeout(()=>{
            socket.close();
            socket_connect();
        },600000)
    
    };
    socket.onmessage = function (event) {
        if (!DATA["isClicked"]){
            console.log("!clicked")
            return 0;
        }
        try {
            if (regex.test(event.data) && event.data.includes("1003")){
                console.log(event.data)
                const rs = JSON.parse(event.data)[1];
                DATA["result"] = (+rs["d1"]+rs["d2"]+rs["d3"]) >10 ? 1: 2
                socket_io.send(JSON.stringify(DATA));
            }
    
        } catch (error) {
            console.error('Lỗi khi phân tích dữ liệu:', error);
        }
    };
    
    socket.onclose = function (event) {
        console.log('Kết nối WebSocket đã đóng.');
    };
    socket.onerror = function (error) {
        console.error('Lỗi WebSocket:', error);
    };
}



////////////////////////////btn////////////////////////////////////
socket_io_connect()
socket_connect()

btn_sid.onclick = (e) =>{
    e.target.style.backgroundColor = "blue";
    DATA["isClicked"] = true;
    DATA["sid"] = +first_sid.value;
    DATA["state"] = first_state.value;
}

btn_stop.onclick = (e)=>{
    e.target.style.backgroundColor = "red";
    socket.close();
    socket_io.disconnect();
    clearInterval(interval_disconnect);
}