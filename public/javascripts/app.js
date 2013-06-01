$(function () {

    //var socket = io.connect('http://socket-snake.herokuapp.com/');
    var socket = io.connect('http://localhost/');
    var started = false;

    var options = {
        x: 25,
        y: 25,
        snakeSize: 20,
        interval: 150,
        speedUp: false,
        ghost: false,
        socket : socket
    };

    var start = $("#start");
    var name = '';

    socket.on('playerStarted', function (data) {
        new Snake({
            x: 25,
            y: 25,
            snakeSize: 20,
            interval: 150,
            speedUp: false,
            ghost: true,
            socket : socket
        }).start();

        if(!started){
            //startSnake();
        }

    });

    $("div.arena").css({
        width: options.x * options.snakeSize,
        height: options.y * options.snakeSize
    });

    function startSnake(){
        socket.emit('start', {name : name});
        new Snake(options).start();
        started = true;
    }

    $('#start').click(startSnake);
});