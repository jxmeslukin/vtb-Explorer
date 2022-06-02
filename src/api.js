
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
    const tableID = 'tBodTrans'

    tableManipulate(hash, date, btc, aud, tableID);

    // hashInput.innerHTML = hash
    // timeInput.innerHTML = date
    // btcAmtInput.innerHTML = btc
    // audAmtInput.innerHTML = aud


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

    // $.ajax({
    //     url: "https://api.coindesk.com/v1/bpi/currentprice/aud.json",
    //     dataType: 'json',
    //     async: false,
    //     data: function(data) {
    //         var origAmt = btc;
    //         var exchange = parseInt(data.bpi.AUD.rate_float);
    //         let amount = (origAmt * exchange)
    //         var round = formatter.format(Math.round(amount))
    //         console.log(round)
    //     },
    //     success: function() {
    //         console.log(round)
    //         return round
            
    //     }
    // })
    
    $.ajaxSetup({
        async: false
    });
    
    var result;
    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice/aud.json",
    function(data) {
        var origAmt = btc;
        var exchange = parseInt(data.bpi.AUD.rate_float);
        let amount = (origAmt * exchange)
        var round = formatter.format(Math.round(amount))
        result = round
    });
    return result
    
    // $.getJSON("https://api.coindesk.com/v1/bpi/currentprice/aud.json",
    // function(data) {
    //     var origAmt = btc;
    //     var exchange = parseInt(data.bpi.AUD.rate_float);
    //     let amount = (origAmt * exchange)
    //     var round = formatter.format(Math.round(amount))
        
    // })
}

function tableManipulate(hash, time, btc, aud, tableID) {
    var tableBody = document.getElementById(tableID);
    let row = tableBody.insertRow(0)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2) 
    let cell4 = row.insertCell(3)

    cell1.outerHTML = '<th>' + hash + '</th>'
    cell2.innerHTML = time
    cell3.innerHTML = btc
    cell4.innerHTML = aud

    if(tableBody.rows.length > 8){
        tableBody.deleteRow(8);
    } 

}

let blockSocket = new WebSocket('wss://ws.blockchain.info/inv');

blockSocket.onopen = function() {
    //alert("[open] Connection Established");
    blockSocket.send(JSON.stringify({
        "op": "blocks_sub"
    }))
}

blockSocket.onmessage = function(e) {
    var blockResponse = JSON.parse(e.data);
    var tx = blockResponse.op.out
    blockManipulate(blockResponse)
    console.log(blockResponse)
    
}

function blockManipulate(data) {
    var height = (data.x.height)
    const blockId = 'blockBody'
    var ntx = data.x.nTx
    var size = data.x.size.toLocaleString() + " bytes";
    var date = timeConvert(data.x.time)
    tableManipulate(height, date, ntx, size, blockId)
}

let pingSocket = new WebSocket('wss://ws.blockchain.info/inv');

blockSocket.onopen = function() {
    //alert("[open] Connection Established");
    blockSocket.send(JSON.stringify({
        "op": "ping_block"
    }))
}

blockSocket.onmessage = function(e) {
    var blockResponse = JSON.parse(e.data);
    blockManipulate(blockResponse)
    
}