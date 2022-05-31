//calling blockchain.com api to fetch real time info

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
    console.log(tx);
}

