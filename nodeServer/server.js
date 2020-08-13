const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const fs = require('fs');
const httprequest = require('request');
const bp = require('body-parser');

const https = require('https'); // https 
const app = express();
const PORT = process.env.PORT = 80;

const ras_home = 'https://www.naver.com';
const ras_kennel = 'https://www.naver.com';

var SSLkey = {
    pfx: fs.readFileSync('./pfx/certificate.pfx')
};

app.use(express.static('main'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});

const logger = require('./main/middleware/logger.js');
app.use(logger());

app.get('/server/hello/:os', function (req, res) {
    res.json({ "msg": req.params.os });
});

app.get('/home/check', function (req, res) {

    var status;

    httprequest(ras_home, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            status = 1;
        }
        else {
            status = 0;
        }
        var msg = { "status": status };
        res.json(msg);
    });

});

app.get('/home/url', function (req, res) {
    res.json({ 'msg': ras_home });
});


app.get('/kennel/check', function (req, res) {
    var status;

    httprequest(ras_kennel, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            status = 1;
        }
        else {
            status = 0;
        }
        var msg = { "status": status };
        res.json(msg);
    });

});

app.get('/kennel/url', function (req, res) {
    res.json({ 'msg': ras_kennel });
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

app.get('/location/kakaoNew.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'kakaoNew.js'));
});

app.get('/location/map/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'kakaoNew.html'));
});

app.get('/location/naverMap', function(req,res){
    res.sendFile(path.join(__dirname, 'main', 'naverMap.html'));
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});


/*
app.listen(PORT, "0.0.0.0", function (req, res) {
    console.log('Server is running at:', PORT);
});
*/

/* webRTC용 socket 추가 */
//var server = require('http').Server(app); // http 일때 예전 코드

//server.listen(PORT,function(){ http 일때 예전 코드
//    console.log('Server is running at:', PORT);
//});

var server = https.Server(app);
var io = require('socket.io')(server);

https.createServer(SSLkey, app).listen(PORT, function() {
    console.log("HTTPS server listening on port " + PORT);
  });

io.on('connection', function (socket) {
    socket.on('join', function (data) {
        console.log("on join")
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
app.get('/react-webrtc',function(req,res){
    res.sendFile(path.join(__dirname,'/../../react-webrtc/build','index.html'))
})
// app.get('/kennel/movie', function(req,res){
//     res.writeHead(200,{"Content-Type":"text/html"}); 
//      fs.createReadStream("./test.html").pipe(response);
// });


// app.get('/kennel/movie', function (req, res) { // 채운 수정
//     var stream = fs.createReadStream('http://192.168.43.77:5000/video_feed');
//     //2. 잘게 쪼개진 stream이 몇번 전송되는지 확인하는  count
//     var count = 0;
//     //3. 잘게 쪼개진 data를 전송 할 수 있으면 data 이벤트를 발생시킨다
//     stream.on('data', function(data){
//         count = count +1;
//         console.log('data count =' + count);
//         //3.1 data 이벤트 발생되면 해당 data를 클라이언트로 전송한다.
//         res.write(data);
//     });
//     res.end();
// });


