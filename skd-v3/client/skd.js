
var MESSAGE_WS = {
    url: "wss://xdtl.azhkthg1.net/websocket",
    login: [1, "ShakeDisk", "SC_y2hpbmhz", "ZGFuaA==", { "info": "{\"ipAddress\":\"2405:4802:21c:6bc0:d3da:aa86:9d83:365c\",\"userId\":\"7fdfa57d-8014-4140-98cc-0e8698fe1e92\",\"username\":\"SC_y2hpbmhz\",\"timestamp\":1729838405701}", "signature": "3B40174A7E8C19EC6CF30400FACABA4BB95A076093D0E48CD25B12479BC62D21B7059D9DE8E0A55E7FD4F6BC586EAC104A5FF89214793505715B695C615A18669334C18DBB39925E4C6AA36693998A06C541E15C97359324DB55CB959E6017B6C5445A74C288DB70481D348996716D419D69916AB884C3095F2768B26F8B24DE", "pid": 4, "subi": true }],
    info: [6, "ShakeDisk", "ShakeDiskPlugin", { "cmd": 1950 }],
    result: counter => [7, "ShakeDisk", counter, 0],
    Hkl: [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 1950 }],
    bet: (eid, v) => [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 900, "eid": eid, "v": v }]

}

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
    b = normalization(player.value/(+DOM_gameMax.value / + DOM_myMax.value));
    b = Math.max(b, 500);
    let betMessage = MESSAGE_WS.bet(eid, b);

    console.log(JSON.stringify(betMessage));
    socket.send(JSON.stringify(betMessage));

}
var newPlayer ={
    1:0,
    2:0,
    3:0,
    get_profit: function(result){
        if(result %2 ==0){
            return this["2"] - this["1"] - this["3"]
        }
        if(result == 1){
            return this["1"] *3 - this["2"] - this["3"]
        }
        return this["3"] *3 - this["2"] - this["1"]
    },
    make_b: function(profit_list){


        let slice_arr = profit_list.slice(1, 4)
        let minValue = Math.min(...slice_arr)
        for (let i = 1; i <=3; i++){
            this[i] = profit_list[i] - minValue;
        }
    }
    
}
function normalizeArray(arr) {
    // Bước 1: Tìm phần tử nhỏ nhất trong mảng
    const minValue = Math.min(...arr);

    // Bước 2: Trừ đi giá trị của minValue cho tất cả các phần tử
    return arr.map(x => x - minValue);
}
function NEW_ALG(profit_list){
    let arr = [profit_list[1], profit_list[2], profit_list[3]];
    return normalizeArray(arr);


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
            }else if (received_data["gr"]){
                console.log("start:",received_data["gr"])
            }
            else if (received_data["rt"] && received_data["dices"]) {
                //endTime, getResult


                COUNTER.timer = 0;
                let result5 = +received_data["rt"];
                console.log("End round:", result5)
                let pprofit = newPlayer.get_profit(result5)
                console.log("profit:", pprofit)
                HISTORY_PROFITS.player.push(pprofit)
                HISTORY_PROFITS.game.push(profits[result5])

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
                console.log("received_data['ets']")
                //betTime
                COUNTER.timer++;
                if (COUNTER.timer == 40) {
                    profit_s40 = PROFITS_LIST_2D[PROFITS_LIST_2D.length - 1]
                    newPlayer.make_b(profit_s40)
                    console.log("newPlayer.", newPlayer)


                }
                //updateDOM
                DOM_timer.style = `width: ${Math.floor(COUNTER.timer * 100 / 50)}%`;
                moneys.updateMoney(received_data["ets"]);
                profits.updateProfit();
                profits.updateDom();
                PROFITS_LIST_2D.push(profits.toArray());
                // PLAYER_LIST_2D.push(received_data["ps"])
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
