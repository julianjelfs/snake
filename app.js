/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server);
var socket = server.listen(80);

io.configure('transports', [
    'websocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
]);

var players = [];

io.sockets.on('connection', function (socket) {

    socket.on('start', function (data) {
        players.push(data);
        socket.broadcast.emit('playerStarted', data);
    });

    socket.on('foodPlanted', function(data){
        socket.broadcast.emit('foodPlanted', data);
    });

    socket.on('moveHead', function(data){
        socket.broadcast.emit('moveHead', data);
    });

    socket.on('createHead', function(data){
        socket.broadcast.emit('createHead', data);
    });

    socket.on('gameOver', function(msg){
        socket.broadcast.emit('gameOver', msg);
    });
});
