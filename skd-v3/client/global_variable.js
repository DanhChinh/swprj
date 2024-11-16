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
    },
    toArray_1245_04: function(){
        return [0, this[1], this[2], this[3], 0, this[5]]
    },
    toArray: function(){
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
// var PROBABILITY = [15, 3,  1, 3, 15, 1];
// var COMPUTER ={
//     0:0,
//     1:0,
//     2:0,
//     3:0,
//     4:0,
//     5:0,
//     make_b: function(ARR_1235_04){
//         console.group("makeb")
//         console.log("ARR_1235_04", ARR_1235_04)
//         let TBOTT_reverse = ARR_1235_04.map(item=>-item);
//         console.log("TBOTT_reverse",TBOTT_reverse)
//         let minValue = Math.min(...TBOTT_reverse);
//         console.log("minValue", minValue)
//         let TBOTT_reverse_up0 = TBOTT_reverse.map(
//             item => item- minValue
//         )
//         console.log("TBOTT_reverse_up0",TBOTT_reverse_up0)
//         for(let i of [1,2,3,5]){
//             this[i] = TBOTT_reverse_up0[i]
//         }
//         console.log("makeB:", [this[0], this[1], this[2], this[3], this[4], this[5]])
//         console.groupEnd()
//     },
//     get_profit: function(result){
//         let total=0;
//         for (let i of [0,1,3,4]) {
//             let reward = - this[i]
//             if (result == i){
//                 reward = this[i]* PROBABILITY[i];
//             }
//             total += reward;
//         }
//         for (let i of [2, 5]){
//             let reward = this[i];
//             total += (i%2==result%2? reward: -reward);

//         }
//         return total;
//     }
    
// }

var PROBABILITY = [15, 3, 1, 3, 15, 1];
var COMPUTER = {
    2:0,
    5:0,
    make_b: function(arr0_5){
        console.log("arr0_5",arr0_5)
        for(let i=0; i<6; i++){
            arr0_5[i] = Math.floor(arr0_5[i]/PROBABILITY[i]);
        }
        console.log("normalization", arr0_5)
        let c = arr0_5[0]+ arr0_5[2]+arr0_5[4];
        let l = arr0_5[1]+ arr0_5[3]+arr0_5[5];
        console.log("cl", c, l)
        if(c>l){
            this[2] = c-l;
            this[5] = 0;
        }else{
            this[2] = 0;
            this[5] = l-c;
        }
        console.log(this[2], this[5])
    },
    get_profit: function(result){
        let total = 0;
        for(let i of [2,5]){
            if(i%2== result%2){
                total+= this[i]
            }else{
                total -= this[i]
            }
        }
        return total;
    }
}