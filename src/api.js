/*
       _ __ __           _____     ___      __  ___    
      (_) // / ____ ___ |__  /____<  /_  __/ /_<  /___ 
     / / // /_/ __ `__ \ /_ </ ___/ / / / / //_/ / __ \
    / /__  __/ / / / / /__/ (__  ) / /_/ / ,< / / / / /
 __/ /  /_/ /_/ /_/ /_/____/____/_/\__,_/_/|_/_/_/ /_/ 
/___/                                                 

*/


var hashInput = document.getElementById("hashInput")
var timeInput = document.getElementById("timeInput")
var btcAmtInput = document.getElementById("btcAmtInput")
var audAmtInput = document.getElementById("audAmtInput")
let hashArr = [];

// calling blockchain.com api to fetch real time info

let socket = new WebSocket('wss://ws.blockchain.info/inv');

socket.onopen = function() {
    // alert("[open] Connection Established");
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
    var valLength = value.length
    var sum = 0;

    for (i = 0; i < valLength; i++) {
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

    hashArr.push(hash);

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

    if (tableBody.rows.length > 8) {
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

pingSocket.onopen = function() {
    //alert("[open] Connection Established");
    pingSocket.send(JSON.stringify({
        "op": "ping_block"
    }))
}

pingSocket.onmessage = function(e) {
    var blockResponse = JSON.parse(e.data);
    blockManipulate(blockResponse)

}

//search 

var input = document.getElementById('txSearch')
input.addEventListener('keyup', function(){
    search(input);
})

function search(x) {
    var searchArr = [];
    for(i = 0; i < hashArr.length; i++) {
        searchArr.push(hashArr[i]);
    }
    let sort = bubbleSort(searchArr);
    let start = 0
    let end = sort.length - 1
    let xVal = x.value.toLowerCase()
    if(binarySearch(sort, xVal, start, end) == -1) {
        console.log("Not Found")
    } else {
        console.log("Found") 
    }
}

function binarySearch(arr, item, start, end) {
    let sortArr = arr;
    
    console.log(sortArr);
    while(start <= end) {
        let mid = start + Math.floor((end - start) / 2);
        let res = item.localeCompare(sortArr[mid]);
        if(res == 0) {
            return mid;
        }
        if(res < 0) {
            end = mid - 1;
        }
        if(res > 0) {
            start = mid + 1;
        } else {
            end = mid - 1;
        } 
        return -1;
    }

    return -1;
}

function bubbleSort(arr) {
    for(i=0; i < arr.length; i++) {
        for(j=0; j < (arr.length - i - 1); j++) {
            if(arr[j] > arr[j+1]){
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            } 
        }
    }
return arr
}