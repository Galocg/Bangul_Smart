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

// var keyOption = {
// 	ca : fs.readFileSync('./keys/ca_bundle.crt'),
// 	key: fs.readFileSync('./keys/private.key'),
// 	cert : fs.readFileSync('./keys/certificate.crt')
// };

var keyOption = {
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

https.createServer(keyOption, app).listen(80, function() {
    console.log("HTTPS server listening on port " + 80);
  });

