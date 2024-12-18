
var MESSAGE_WS = {
    url: "wss://xdtl.azhkthg1.net/websocket",
    login: [1, "ShakeDisk", "SC_y2hpbmhz", "ZGFuaA==", { "info": "{\"ipAddress\":\"2405:4802:21c:6bc0:d3da:aa86:9d83:365c\",\"userId\":\"7fdfa57d-8014-4140-98cc-0e8698fe1e92\",\"username\":\"SC_y2hpbmhz\",\"timestamp\":1729838405701}", "signature": "3B40174A7E8C19EC6CF30400FACABA4BB95A076093D0E48CD25B12479BC62D21B7059D9DE8E0A55E7FD4F6BC586EAC104A5FF89214793505715B695C615A18669334C18DBB39925E4C6AA36693998A06C541E15C97359324DB55CB959E6017B6C5445A74C288DB70481D348996716D419D69916AB884C3095F2768B26F8B24DE", "pid": 4, "subi": true }],
    info: [6, "ShakeDisk", "ShakeDiskPlugin", { "cmd": 1950 }],
    result: counter => [7, "ShakeDisk", counter, 0],
    Hkl: [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 1950 }],
    bet: (eid, v) => [6, "ShakeDisk", "SD_HoangKimLongPlugin", { "cmd": 900, "eid": eid, "v": v }]

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
                //delete
                BOOKMAKERSPROFIT.show()
                // COMPUTER.make_b(TOTALBETSONTHETABLE.toArray());
                // console.log("COMPUTER.", COMPUTER)
                //enddelete

                COUNTER.timer = 0;
                let result5 = +received_data["rt"];
                console.log("End round:", result5)
                let profitofcomputer = COMPUTER.get_profit(result5)
                console.log("profit:", formatn(profitofcomputer))
                HISTORY_PROFITS.player.push(profitofcomputer)
                HISTORY_PROFITS.game.push(BOOKMAKERSPROFIT[result5])

                TOTALBOTT_LIST = []

                CHART.game = drawChart(HISTORY_PROFITS.game, "DOM_gameChart", CHART.game);
                CHART.player = drawChart(HISTORY_PROFITS.player, "DOM_myChart", CHART.player);

                document.getElementById(`profit${result5}`).classList.add("isresult");
                setTimeout(() => {
                    document.getElementById(`profit${result5}`).classList.remove("isresult");
                }, 11000)

                COUNTER.round +=1;
                console.groupEnd();
            } 
            else if (received_data["ets"]) {
                console.log("received_data['ets']")
                //betTime
                if(!COUNTER.timer){console.groupCollapsed(`Round: ${COUNTER.round}`)}
                COUNTER.timer++;
                if (COUNTER.timer == 40) {
                    console.log("BOOKMP s40:")
                    BOOKMAKERSPROFIT.show()
                    let lastThreeElements = JSON.parse(JSON.stringify(TOTALBOTT_LIST.slice(-3)))
                    let avg_arr =AVG_ARR(lastThreeElements);
                    COMPUTER.make_b(avg_arr);


                }
                //updateDOM
                DOM_timer.style = `width: ${Math.floor(COUNTER.timer * 100 / 50)}%`;
                TOTALBETSONTHETABLE.update(received_data["ets"]);
                BOOKMAKERSPROFIT.update(TOTALBETSONTHETABLE);
                BOOKMAKERSPROFIT.render();
                TOTALBOTT_LIST.push(TOTALBETSONTHETABLE.toArray());
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
