
var socket;
var MESSAGE_WS = {
    url: "wss://xdtl.azhkthg1.net/websocket",
    login: [1, "ShakeDisk", "SC_y2hpbmhz", "ZGFuaA==", { "info": "{\"ipAddress\":\"2405:4802:21c:6bc0:d3da:aa86:9d83:365c\",\"userId\":\"7fdfa57d-8014-4140-98cc-0e8698fe1e92\",\"username\":\"SC_y2hpbmhz\",\"timestamp\":1729838405701}", "signature": "3B40174A7E8C19EC6CF30400FACABA4BB95A076093D0E48CD25B12479BC62D21B7059D9DE8E0A55E7FD4F6BC586EAC104A5FF89214793505715B695C615A18669334C18DBB39925E4C6AA36693998A06C541E15C97359324DB55CB959E6017B6C5445A74C288DB70481D348996716D419D69916AB884C3095F2768B26F8B24DE", "pid": 4, "subi": true }],
    info: [6, "ShakeDisk", "ShakeDiskPlugin", { "cmd": 1950 }],
    result: counter => [7, "ShakeDisk", counter, 0],
    Hkl: [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 1950 }],
    bet: (eid, v) => [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 900, "eid": eid, "v": v }]

}

var sendInterval;
var moneys = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    "total": 0,
    updateMoney: function (arrayData) {
        this["total"] = 0;
        for (let i = 0; i < 6; i++) {
            this[i] = +arrayData[i]["v"];
            this["total"] += this[i];
        }
    },
    updateDom: function () {
        for (let i = 0; i < 6; i++) {
            document.getElementById(`money${i}`).innerText = formatn(this[i]);
        }
    }
}


var profits = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    "maxprofit": -999999999,
    updateProfit: function () {
        this[0] = moneys["total"] - (moneys[0] * 16 + moneys[2] * 2);
        this[4] = moneys["total"] - (moneys[4] * 16 + moneys[2] * 2);
        this[2] = moneys["total"] - moneys[2] * 2;
        this[1] = moneys["total"] - (moneys[1] * 4 + moneys[5] * 2);
        this[3] = moneys["total"] - (moneys[3] * 4 + moneys[5] * 2);
        this["maxprofit"] = Math.max(this[0], this[1], this[2], this[3], this[4]);
    },
    updateDom: function () {
        for (let i = 0; i < 6; i++) {
            let e = document.getElementById(`profit${i}`);
            e.innerText = formatn(this[i]);
            if (this[i] == this["maxprofit"]) {
                e.classList.add("maxprofit");
            } else {
                e.classList.remove("maxprofit");
            }

        }
    },
    toArray: function(){
        return [this[0], this[1], this[2], this[3], this[4]]
    }
}

function send_bet(player) {
    if (player.choice === undefined || !REMOTE.isPlay) { return 0; }
    let eid, b;
    player.choice % 2 == 0 ? eid = 2 : eid = 5;
    b = normalization(player.value/5000);
    b = Math.max(b, 500);
    let betMessage = MESSAGE_WS.bet(eid, b);

    console.log(JSON.stringify(betMessage));
    socket.send(JSON.stringify(betMessage));

}




function socket_connect() {
    socket = new WebSocket(MESSAGE_WS.url);

    socket.onopen = function (event) {
        console.log('Kết nối WebSocket đã mở.');
        socket.send(JSON.stringify(MESSAGE_WS.login));

    };

    socket.onmessage = function (event) {
        let received_data = JSON.parse(event.data)[1];
        if (typeof received_data === 'object') {
            if (received_data["plugins"]) {
                socket.send(JSON.stringify(MESSAGE_WS.Hkl));
            } 
            else if (received_data["rt"]) {
                //endTime, getResult
                COUNTER.rt++; 
                if (COUNTER.rt % 2 == 1) {
                    return 0;
                }
                //_________________________
                COUNTER.timer = 0;
                let result5 = +received_data["rt"];
                console.log("result5", result5)
                if (result5 % 2 == PLAYER.choice % 2) {
                    HISTORY_PROFITS.player.push(PLAYER.value)
                } else {
                    HISTORY_PROFITS.player.push(-PLAYER.value)

                }

                HISTORY_PROFITS.game.push(profits[result5])
                if(messageIO_content){
                    messageIO_content.push(result5)
                    console.log(messageIO_content)
                    socket_io.send(JSON.stringify({
                        "header":"add_data",
                        "content":messageIO_content
                    }));
                }
                PROFITS_LIST_2D = []

                CHART.game = drawChart(HISTORY_PROFITS.game, "DOM_gameChart", CHART.game);
                CHART.player = drawChart(HISTORY_PROFITS.player, "DOM_myChart", CHART.player);
                console.log("_______________________________________________________")

                document.getElementById(`profit${result5}`).classList.add("isresult");
                setTimeout(() => {
                    document.getElementById(`profit${result5}`).classList.remove("isresult");
                }, 11000)
            } 
            else if (received_data["ets"]) {
                console.log(received_data)
                //betTime
                COUNTER.timer++;
                if (COUNTER.timer == 40) {
                    profit_s40 = PROFITS_LIST_2D[PROFITS_LIST_2D.length - 1]
                    messageIO_content = make_content(
                        JSON.parse(JSON.stringify(PROFITS_LIST_2D)), 
                        adjustArray(JSON.parse(JSON.stringify(HISTORY_PROFITS.game)))
                    )
                    // console.log(messageIO_content)

                    if(messageIO_content){
                        socket_io.send(JSON.stringify({
                            "header":"for_prd",
                            "content":messageIO_content
                        }));
                    }

                }
                //updateDOM
                DOM_timer.style = `width: ${Math.floor(COUNTER.timer * 100 / 50)}%`;
                moneys.updateMoney(received_data["ets"]);
                // moneys.updateDom();
                profits.updateProfit();
                profits.updateDom();
                PROFITS_LIST_2D.push(profits.toArray())

            } 
            else {
                // console.log(data)
            }
        }
        else {
            if (received_data == true) {
                socket.send(JSON.stringify(MESSAGE_WS.info));
                sendInterval = setInterval(() => {
                    socket.send(JSON.stringify(MESSAGE_WS.result(COUNTER.send)));
                    COUNTER.send++;
                }, 2000)

            }
        }


    };

    socket.onclose = function (event) {
        console.log('Kết nối WebSocket đã đóng.');
        clearInterval(sendInterval);
    };

    socket.onerror = function (error) {
        console.error('Lỗi WebSocket:', error);
    };
    return socket;

}



socket_connect();
