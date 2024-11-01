function socket_io_connect(socket_io){
    socket_io = io('http://localhost:5000');

    socket_io.on('response', function(data) {
    
        console.log(JSON.parse(data))
    
    });
    
    socket_io.on('connect', function() {
        console.log('Đã kết nối tới máy chủ Python');
    });
    
    socket_io.on('disconnect', function() {
        console.log('Disconnected from server');
    });
}
