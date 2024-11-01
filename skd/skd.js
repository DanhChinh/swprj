

var shakeDisk = {
    url: "wss://xdtl.azhkthg1.net/websocket",
    loginMessage: [1, "ShakeDisk", "SC_y2hpbmhz", "ZGFuaA==", { "info": "{\"ipAddress\":\"2405:4802:21c:6bc0:d3da:aa86:9d83:365c\",\"userId\":\"7fdfa57d-8014-4140-98cc-0e8698fe1e92\",\"username\":\"SC_y2hpbmhz\",\"timestamp\":1729838405701}", "signature": "3B40174A7E8C19EC6CF30400FACABA4BB95A076093D0E48CD25B12479BC62D21B7059D9DE8E0A55E7FD4F6BC586EAC104A5FF89214793505715B695C615A18669334C18DBB39925E4C6AA36693998A06C541E15C97359324DB55CB959E6017B6C5445A74C288DB70481D348996716D419D69916AB884C3095F2768B26F8B24DE", "pid": 4, "subi": true }],
    infoMessage: [6, "ShakeDisk", "ShakeDiskPlugin", { "cmd": 1950 }],
    resultMessage: counter => [7, "ShakeDisk", counter, 0],
    HklMessage: [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 1950 }],
    betMessage: (eid, v) => [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 900, "eid": eid, "v": v }]

}


var moneys = {
    0: 0, //0trang
    1: 0, //1trang
    2: 0, //2trang 
    3: 0, //3trang
    4: 0, //4trang
    5: 0, //
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
    5: 0,
    "maxprofit": -999999999,
    updateProfit: function () {
        this[0] = moneys["total"] - (moneys[0] * 16 + moneys[2] * 2);
        this[4] = moneys["total"] - (moneys[4] * 16 + moneys[2] * 2);
        this[2] = moneys["total"] - moneys[2] * 2;
        this[1] = moneys["total"] - (moneys[1] * 4 + moneys[5] * 2);
        this[3] = moneys["total"] - (moneys[3] * 4 + moneys[5] * 2);
        this[5] = moneys["total"] - moneys[5] * 2 - Math.floor((moneys[1] * 4 + moneys[3] * 4) / 2);
        this["maxprofit"] = Math.max(this[0], this[1], this[2], this[3], this[4], this[5]);
        //???
        myValue["maxGameValue"] = Math.max(myValue["maxGameValue"], this[1], this[2], this[3])
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
    }
}

function sendBet(myBet) {
    if (myBet['choice'] === undefined || !isPlay) { return 0; }
    let eid, b;
    myBet['choice'] % 2 == 0 ? eid = 2 : eid = 5;
    b = normalization(myBet['value']);
    b = Math.max(b, 500);
    let betMessage = shakeDisk.betMessage(eid, b);

    console.log(JSON.stringify(betMessage));
    socket.send(JSON.stringify(betMessage));

}




function socket_connect() {
    socket = new WebSocket(shakeDisk.url);

    socket.onopen = function (event) {
        console.log('Kết nối WebSocket đã mở.');
        socket.send(JSON.stringify(shakeDisk.loginMessage));

    };

    socket.onmessage = function (event) {

        let data = JSON.parse(event.data);
        if (typeof data[1] === 'object') {
            if ("plugins" in data[1]) {
                console.log(data[1].plugins)
                socket.send(JSON.stringify(shakeDisk.HklMessage));

            } else if ("rt" in data[1]) {
                rtCounter++;
                timerCounter = -1;
                if (rtCounter % 2 == 1) {
                    return 0;
                }
                console.log("result:", data[1]["rt"])
                let result = +data[1]["rt"];
                if (result%2 == myBet["choice"]%2) {
                    myProfitHistory.push(myBet["value"]);
                } else {
                    myProfitHistory.push(-myBet["value"]);

                }
                gameProfitHistory.push(profits[result]);
                gameChart = drawChart(gameProfitHistory, "DOM_gameChart", gameChart);
                myChart = drawChart(myProfitHistory, "DOM_myChart", myChart);

                document.getElementById(`profit${result}`).classList.add("isresult");
                setTimeout(() => {
                    document.getElementById(`profit${result}`).classList.remove("isresult");

                }, 11000)
            }
            else if ("ets" in data[1]) {
                timerCounter++;
                if (timerCounter == 43) {
                    let profitAvg = calcAvgList(profitList)
                    console.log(profitAvg);
                    myBet = makeChoie(profitAvg);
                    sendBet(myBet);
                    profitList = []

                }
                //updateDOM
                DOM_timer.style = `width: ${Math.floor(timerCounter*100/50)}%`;
                moneys.updateMoney(data[1]["ets"]);
                // moneys.updateDom();
                profits.updateProfit();
                profits.updateDom();
                profitList.push(JSON.parse(JSON.stringify(profits)))

            }
            else {
                // console.log(data)
            }

        } else {
            if (data[1] == true) {
                socket.send(JSON.stringify(shakeDisk.infoMessage));
                sendInterval = setInterval(() => {
                    socket.send(JSON.stringify(shakeDisk.resultMessage(sendCounter)));
                    sendCounter++;
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
}


socket_connect();
socket_io_connect();
