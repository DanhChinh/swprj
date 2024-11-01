function normalization(gameValue, gameMax , myMax ) {
    let myValue = myMax * gameValue / gameMax;
    return Math.round(myValue / 500) * 500;
}
var formatn = number => numeral(number).format('0,0');
var calcAvgList = function(list){
    let list_d3 = list.slice(-3);
    let objAvg = {0:0, 1:1, 2:2, 3:3, 4:4, 5:5};
    list_d3.forEach(obj => {
        for(let key in objAvg){
            objAvg[key] += obj[key] / 3;
        }
    })
    for (let key in objAvg){
        objAvg[key] = Math.floor(objAvg[key]);
    }
    return objAvg;    

}
function makeChoie(profits) {
    let p1 = profits[1];
    let p2 = profits[2];
    let p3 = profits[3];
    // let sortArr = [p1, p2, p3].sort((a,b)=>a-b);
    let value = Math.max(p1, p2, p3);
    let choice = undefined;
    for(let i=1; i<=3;i++){
        if(profits[i] == value){
            choice = i;
        }
    }
    // for(let i = 0; i < sortArr.length; i++) {
    //     if (profits[i] == sortArr[2]){
    //         choice = 1;
    //         break;
    //     }
    // }
    // if (p1>0 && p2>0 && p3>0){
    //     value = sortArr[0];
    // }
    // else{
    //     value = sortArr[1];
    // }
    return {
        "choice": choice,
        "value": value
    }


}
var isPlay = false;
var isShowProfits = true;
var gameMax = undefined;
var myMax = undefined;
var myValue = {
    "maxGameValue": undefined,
    "maxMyValue": 100,
    getValue: function (GameValue) {
        if (!this["maxGameValue"]) {
            return 0;
        }
        return Math.floor()(this["maxMyValue"] * GameValue) / this["maxGameValue"];
    }
}
var socket_io;
var socket;
var gameChart;
var myChart;
var gameProfitHistory = [];
var myProfitHistory = []
var profitList = [];
var sendInterval;
var sendCounter = 2;
var roundCounter = 0;
var rtCounter = 0;
var timerCounter = 0;
var myBet = {
    "choice": undefined,
    "value": 0
}

