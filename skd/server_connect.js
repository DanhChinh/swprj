function socket_io_connect() {
    let socket_io = io('http://localhost:5000');

    socket_io.on('response', function (data) {
        let received_data = JSON.parse(data);
        console.log(received_data)
        PLAYER = makeChoie(ROUND.profitList[ROUND.profitList.length - 1]);
        console.log(PLAYER.choice, PLAYER.value)
        PLAYER.choice = received_data.content
        PLAYER.value = Math.abs(profits[received_data.content])
        console.log(PLAYER.choice, PLAYER.value)

        send_bet(PLAYER);

    });

    socket_io.on('connect', function () {
        console.log('Đã kết nối tới máy chủ Python');
    });

    socket_io.on('disconnect', function () {
        console.log('Disconnected from server');
    });
    return socket_io;
}
var socket_io = socket_io_connect();