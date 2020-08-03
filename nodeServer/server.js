const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const fs = require('fs');
const httprequest = require('request');
const bp = require('body-parser');

const app = express();
const PORT = process.env.PORT = 3000;

const ras_home = 'https://www.naver.com';
const ras_kennel = 'https://www.naver.com';

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

app.get('/home/check',function(req,res){

    var status;

    httprequest(ras_home, function(error, response, body){
    if(!error && response.statusCode == 200){
        status = 1;
    }
    else{
        status = 0;
    }
    var msg = {"status": status};
    res.json(msg);
    });

});

app.get('/home/url',function(req,res){
    res.json({'msg':ras_home});
});


app.get('/kennel/check',function(req,res){
    var status;

    httprequest(ras_kennel, function(error, response, body){
    if(!error && response.statusCode == 200){
        status = 1;
    }
    else{
        status = 0;
    }
    var msg = {"status": status};
    res.json(msg);
    });

});

app.get('/kennel/url',function(req,res){
    res.json({'msg':ras_kennel});
});

app.get('/parse/test',function(req,res){
    var jb;
    httprequest('https://www.naver.com', function(error, response, body){
    var $ = cheerio.load(body);
    jb = $('h1').html();
    console.log(jb);
    });
    res.json({"t":jb});
});

app.get('/location/kakaoNew.js',function(req,res){
    res.sendFile(path.join(__dirname,'main','kakaoNew.js'));
});

app.get('/location/map/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'kakaoNew.html'));
});

app.get('/json/get',function(req,res){
    var status;
    var msg;
    httprequest('http://127.0.0.1:3000/test3', function(error, response, body){
        if(!error && response.statusCode == 200){
            status = 1;
        }
        else{
            status = 0;
        }
        console.log(status);
        var msg = JSON.parse(body);
        console.log(msg.name, msg.id);
    });
    res.end();
});

app.get('/json/send',function(req,res){
    res.json({"name":"ck","pwd":"1234"});
    res.end();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});

app.listen(PORT, "0.0.0.0", function (req, res) {
    console.log('Server is running at:', PORT);
});



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


