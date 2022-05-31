var hashInput = document.getElementById("hashInput")
var timeInput = document.getElementById("timeInput")
var btcAmtInput = document.getElementById("btcAmtInput")
var audAmtInput = document.getElementById("audAmtInput")

// calling blockchain.com api to fetch real time info

let socket = new WebSocket('wss://ws.blockchain.info/inv');

socket.onopen = function() {
    alert("[open] Connection Established");
    socket.send(JSON.stringify({
        "op": "unconfirmed_sub"
    }))
}

socket.onmessage = function(e) {
    var response = JSON.parse(e.data);
    var tx = response.x.out
    console.log(response);
    jsonManipulate(response)
}

function jsonManipulate(data) {
    var arr = data.x
    var hash = arr.hash
    var time = arr.time
    var value = arr.out
    var valLeng = value.length
    var sum = 0;

    for(i=0; i < valLeng; i++) {
        sum += (value[i].value)
    }
    var btc = sum / 100000000
    var aud = currencyConvert(btc);
    var date = timeConvert(time);

    hashInput.innerHTML = hash
    timeInput.innerHTML = date
    btcAmtInput.innerHTML = btc
    audAmtInput.innerHTML = aud


}

function timeConvert(time) {
    var date = new Date(time * 1000);
    var hours = date.getHours();
    var mins = "0" + date.getMinutes();
    var formattedTime = hours + ":" + mins.slice(-2)
    return formattedTime;
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD'
})

function currencyConvert(btc) {
    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice/aud.json",
    function(data) {
        var origAmt = btc;
        var exchange = parseInt(data.bpi.AUD.rate_float);
        let amount = (origAmt * exchange)
        var round = formatter.format(Math.round(amount))
        
    })
}

let blockSocket = new WebSocket('wss://ws.blockchain.info/inv');

blockSocket.onopen = function() {
    //alert("[open] Connection Established");
    blockSocket.send(JSON.stringify({
        "op": "blocks_sub",
        "op": "ping_block"
    }))
}

blockSocket.onmessage = function(e) {
    var blockResponse = JSON.parse(e.data);
    var tx = blockResponse.op.out
    
}