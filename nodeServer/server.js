const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('main'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'main', 'client.html'));
});

var server = require('http').createServer(app);
server.listen(3000);
console.log("listening at localhost");

var socket = require('socket.io').listen(server);

var num=0;

socket.sockets.on('connection',function(client){
    console.log('New Client Connection');

    client.on('serverReceiver',function(value){
        var msg = value+' '+num++;
        socket.sockets.emit('clientReceiver',{msg:msg});
    });
});
