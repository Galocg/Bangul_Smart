 const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const logger = require('./main/middleware/winlogger.js');
const fs = require('fs');
const httprequest = require('request');
const bp = require('body-parser');
const https = require('https'); // https 
const app = express();
const PORT = process.env.PORT = 443;

const cors = require('cors');

var get_ROTATE_ANGLE = 0;
var get_DOG_FLAG =  0;
var home_lastGetTime = 0;
var kennel_lastGetTime = 0;

var dataURL = '';


var corsOptions = {
    origin: ["http://localhost:8080", "file://com.bangul.app.webos-webos",
    "https://jikjoo.github.io/react-webrtc/","https://localhost:80",
    "http://localhost:5000","https://bangul-petcare.web.app","https://bangul.web.app","http://192.168.137.112:8080/stream/webrtc"
    ],
    credentials : true
}

var SSLkey = { // SSL 인증서
    pfx: fs.readFileSync('./pfx/key.pfx')
};

app.use(bp.json());

app.use(express.static('main'));


app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});



app.use(logger());

app.use(cors(corsOptions));

app.get('/server/hello/:os', function (req, res) { // 메인서버의 상태를 확인하는 URI
    res.json({ "msg": req.params.os });
});

app.post('/home/state', function(req,res){ // 메인서버에서 홈디바이스 상태 체크 및 데이터 가져오는 URI
    var DOG_FLAG = req.query.DOG_FLAG; 
    var ROTATE_ANGLE = req.query.ROTATE_ANGLE;
    get_ROTATE_ANGLE = ROTATE_ANGLE
    get_DOG_FLAG = DOG_FLAG
    home_lastGetTime = new Date();
    res.json({'DOG_FLAG': DOG_FLAG, 'ROTATE_ANGLE':ROTATE_ANGLE});
});

app.get('/home/check', function(req,res){ // 카디바이스에서 홈디바이스 상태를 체크하기 위한 URI
    var nowTime = new Date();
    var diff = nowTime.getTime() - home_lastGetTime.getTime();
    if(diff<10000){
        console.log(diff);
        res.json({"status":1});
    }
    else{
        console.log(diff);
        res.json({"status":0});
    }
});


app.get('/home/device', function(req,res){ // 메인서버에서 카메라 각도 제어를 위한 URI
    var NOW_ANGLE = req.query.NOW_ANGLE; 
    var ROTATE_ANGLE =  get_ROTATE_ANGLE; 
    var DHT_H = req.query.DHT_H; 
    var DHT_T = req.query.DHT_T; 
    var FEED = req.query.FEED; 
    var DOG_FLAG = get_DOG_FLAG; 
    home_lastGetTime = new Date(); // 만약에 rotate angle 이나  dog _ flag 가 존재하면 그것으로 바꿔줘야함
    res.json({'NOW_ANGLE' : NOW_ANGLE , 'ROTATE_ANGLE' : ROTATE_ANGLE ,  'DHT_H' : DHT_H , 'DHT_T' : DHT_T , 'FEED' : FEED , 'DOG_FLAG' : DOG_FLAG}); 
});


app.get('/kennel/state', function(req,res){ // 메인서버에서 켄넬의 현재 상태를 체크하기 위한 URI
    kennel_lastGetTime = new Date(); 
    res.send('<h1>GET KENNEL STATE TIME<h1>');
    res.end();
});

app.get('/kennel/check', function(req,res){ // 카디바이스에서 홈디바이스 상태를 체크하기 위한 URI
    var nowTime = new Date();
    var diff = nowTime.getTime() - kennel_lastGetTime.getTime();
    if(diff<10000){
        console.log(diff);
        res.json({"status":1});
    }
    else{
        console.log(diff);
        res.json({"status":0});
    }
});

app.get('/parse/test', function (req, res) {
    var jb;
    httprequest('https://www.naver.com', function (error, response, body) {
        var $ = cheerio.load(body);
        jb = $('h1').html();
        console.log(jb);
    });
    res.json({ "t": jb });
});

app.post('/kennel/getImage', function(req,res){
    dataURL = req.body.data;
    console.log(dataURL);
    
    var file = {'file': dataURL};
    httprequest.post({
    headers: {'content-type' : 'application/json'},
    url : 'http://52.79.48.232:5000/ml/learn',
    body : file,
    json: true
    }, function(error, response, body){
        console.log(body);
    });

    res.send({'file':dataURL});
    res.end();
});

app.post('/postTest', function(req,res){
    res.json({"post":"test"});
});


app.get('/kennel/dogVomitTest', function(req,res){
    var file = {'file':'hi'};
    httprequest.post({
       headers: {'content-type' : 'application/json'},
       url : 'http://52.79.48.232:5000/ml/learn',
       body : file,
       json: true
    }, function(error, response, body){
        console.log(response);
    });

    res.end();
});



app.get('/location/naverMap.js', function (req, res) { // 카디바이스에게 네이버지도 전송
    res.sendFile(path.join(__dirname, 'main', 'naverMap.js'));
});

app.get('/location/naverMap', function (req, res) { // 카디바이스에게 네이버지도 전송
    res.sendFile(path.join(__dirname, 'main', 'naverMap.html'));
});

app.get('/star.jpg', function(req,res){ 
    res.sendFile(path.join(__dirname, 'main', 'star.jpg'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});



var server = https.createServer(SSLkey, app); // https 서버 시작
server.listen(PORT, "0.0.0.0",function () {
    console.log("HTTPS server listening on port " + PORT);
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
    const clientIp = socket.request.connection.remoteAddress
    console.log(`on connection ${clientIp}`);
    socket.on('join', function (data) {
        console.log(`on join ${data.roomId} ${clientIp}`);
        socket.join(data.roomId);
        socket.room = data.roomId;
        const sockets = io.of('/').in().adapter.rooms[data.roomId];
        if (sockets.length === 1) {
            socket.emit('init')
        } else {
            if (sockets.length === 2) {
                io.to(data.roomId).emit('ready')
            } else {
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
            }

        }
    });
    socket.on('signal', (data) => {
        console.log("on signal")
        io.to(data.room).emit('desc', data.desc)
    })
    socket.on('disconnect', () => {
        console.log("on disconnect")
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room) {
            io.to(socket.room).emit('disconnected')
        }

    })
});

/* webRTC 웹서버 */
app.use(express.static(path.join(__dirname, '/../../react-webrtc/build')));
app.get('/react-webrtc', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../react-webrtc/build', 'index.html'))
})

// 네이버 위치 추적
const geoLocation = require('./geoLocation');
const { json } = require('body-parser');
app.use('/location/geolocation',geoLocation)