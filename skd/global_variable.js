function normalization(gameValue, gameMax, myMax) {
    let myValue = myMax * gameValue / gameMax;
    return Math.round(myValue / 500) * 500;
}
var formatn = number => numeral(number).format('0,0');
function Message(header, content, tmp) {
    let counter = 0;
    return { counter, header, content, tmp }
}

var calcAvgList = function (list) {
    let list_d3 = list.slice(-3);
    let objAvg = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
    list_d3.forEach(obj => {
        for (let key in objAvg) {
            objAvg[key] += obj[key] / 3;
        }
    })
    for (let key in objAvg) {
        objAvg[key] = Math.floor(objAvg[key]);
    }
    return objAvg;

}

function objList2Arr(objList) {
    let arr = [];
    objList.forEach(obj => arr = arr.concat(Object.values(obj)))
    return arr;
}

function makeChoie(profits) {
    let p1 = profits[1];
    let p2 = profits[2];
    let p3 = profits[3];
    // let sortArr = [p1, p2, p3].sort((a,b)=>a-b);
    let value = Math.max(p1, p2, p3);
    let choice = undefined;
    for (let i = 1; i <= 3; i++) {
        if (profits[i] == value) {
            choice = i;
        }
    }
    return {
        "choice": choice,
        "value": value
    }


}




var HISTORY_PROFITS = {
    "game": [],
    "player": []
}

var ROUND = {
    "profitList": [],
    "moneys45s": [],
    "moneys45sList": []
}
var COUNTER = {
    "send": 2,
    "round": 0,
    "rt": 0,
    "timer": 0
}
var PLAYER = {
    "choice": undefined,
    "value": 0
}

var MESSAGE_IO = {
    "trend": {
        "header": "trend",
        "content": []
    },
    "prd": {
        "header": "prd",
        "content": []
    },
}