var formatn = number => numeral(number).format('0,0');
function normalization(value){
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
    "isEnd":false
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
    update: function(arrayData){
        for (let i = 0; i < 6; i++) {
            this[i] = +arrayData[i]["v"];
        }
    },
    render: function(){
        for (let i = 0; i < 6; i++) {
            document.getElementById(`money${i}`).innerText = formatn(this[i]);
        }
    }
}

var BOOKMAKERSPROFIT = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    update: function (M) {
        this[0] = -15*M[0] + M[1] - M[2] + M[3] + M[4] + M[5];
        this[4] = M[0] + M[1] - M[2] + M[3] -15*M[4] + M[5];
        this[2] = M[0] + M[1] - M[2] + M[3] + M[4] + M[5];
        this[1] = M[0] - 3*M[1] + M[2] + M[3] + M[4] - M[5];
        this[3] = M[0] + M[1] + M[2] -3* M[3] + M[4] - M[5];
    },
    render: function () {
        for (let i = 0; i < 6; i++) {
            let e = document.getElementById(`profit${i}`);
            e.innerText = formatn(this[i]);

        }
    },
    toArray: function(){
        return [this[0], this[1], this[2], this[3], this[4]]
    },
    show: function(){
        let arr =  this.toArray();
        let arr_format = arr.map(
            num => formatn(num)
        )
        console.log(arr_format);
    }
}
var PROBABILITY = [1/16, 1/4,  3/8, 1/4, 1/16];
var COMPUTER ={
    0:0,
    1:0,
    2:0,
    3:0,
    4:0,
    5:0,
    make_b: function(BPA){
        let min_value = Math.min(...BPA);
        for (let i = 0; i <5; i++){
            BPA[i] = BPA[i] - min_value;
            this[i] = BPA[i]* PROBABILITY[i]
        }
        this[2] += (this[0] + this[4]);
        this[5] = this[1] +this[3];
        this[1] = 0;
        this[3] = 0;
        this[0] = 0;
        this[4] = 0;
        if (this[2]>this[5]){
            this[2] -= this[5];
            this[5]=0;
        }else{
            this[5] -= this[2];
            this[2]=0;
        }
    },
    get_profit: function(result){
        let total=0;
        for (let i = 0; i < 6; i++) {
            result%2 == i%2? total += this[i] : total -= this[i];
        }
        return total;
    }
    
}