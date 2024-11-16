var formatn = number => numeral(number).format('0,0');
function normalization(value) {
    return Math.round(value / 500) * 500;
}


var HISTORY_PROFITS = {
    "game": [],
    "player": []
}

var COUNTER = {
    "send": 2,
    "round": 0,
    "timer": 0,
    "isEnd": false
}
var PLAYER = {
    "choice": undefined,
    "value": 0
}

var PROFITS_LIST_2D = []
var profit_s40 = []

var socket;
var sendInterval;


var TOTALBETSONTHETABLE = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    update: function (arrayData) {
        for (let i = 0; i < 6; i++) {
            this[i] = +arrayData[i]["v"];
        }
    },
    render: function () {
        for (let i = 0; i < 6; i++) {
            document.getElementById(`money${i}`).innerText = formatn(this[i]);
        }
    },
    toArray_1245_04: function () {
        return [0, this[1], this[2], this[3], 0, this[5]]
    },
    toArray: function () {
        return [this[0], this[1], this[2], this[3], this[4], this[5]]
    }
}

var BOOKMAKERSPROFIT = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    update: function (M) {
        this[0] = -15 * M[0] + M[1] - M[2] + M[3] + M[4] + M[5];
        this[4] = M[0] + M[1] - M[2] + M[3] - 15 * M[4] + M[5];
        this[2] = M[0] + M[1] - M[2] + M[3] + M[4] + M[5];
        this[1] = M[0] - 3 * M[1] + M[2] + M[3] + M[4] - M[5];
        this[3] = M[0] + M[1] + M[2] - 3 * M[3] + M[4] - M[5];
    },
    render: function () {
        for (let i = 0; i < 6; i++) {
            let e = document.getElementById(`profit${i}`);
            e.innerText = formatn(this[i]);

        }
    },
    toArray: function () {
        return [this[0], this[1], this[2], this[3], this[4]]
    },
    show: function () {
        let arr = this.toArray();
        let arr_format = arr.map(
            num => formatn(num)
        )
        console.log(arr_format);
    }
}


var PROBABILITY = [15, 3, 1, 3, 15, 1];
var COMPUTER = {
    2: 0,
    5: 0,
    make_b: function (arr0_5) {
        // console.log("arr0_5", arr0_5)
        for (let i = 0; i < 6; i++) {
            arr0_5[i] = Math.floor(arr0_5[i] / PROBABILITY[i]);
        }
        // console.log("normalization", arr0_5)
        let c = arr0_5[0] + arr0_5[2] + arr0_5[4];
        let l = arr0_5[1] + arr0_5[3] + arr0_5[5];
        if (c > l) {
            this[2] = c - l;
            this[5] = 0;
        } else {
            this[2] = 0;
            this[5] = l - c;
        }
        console.log(this[2], this[5])
    },
    get_profit: function (result) {
        let total = 0;
        for (let i of [2, 5]) {
            if (i % 2 == result % 2) {
                total += this[i]
            } else {
                total -= this[i]
            }
        }
        return total;
    }
}


var TOTALBOTT_LIST = [];


function AVG_ARR(A) {
    let result = new Array(A[0].length).fill(0);
    for (let i = 0; i < A[0].length; i++) {
        result[i] = Math.floor((A[0][i] + A[1][i] + A[2][i]) / 3);
    }
    return result
}