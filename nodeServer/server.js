const express = require('express');
const path = require('path');
var request = require('request');

const app = express();
const PORT = process.env.PORT = 8000;

app.use(express.static('main'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});

const logger = require('./main/middleware/logger.js');
app.use(logger());

var html;
var js;
var kennelStatus = 0;
const fs = require('fs');

// html source without script tag
fs.readFile('./main/kakaoNoScript.html', "utf8", function (err, data) {
    if (err) {
        throw err;
    }
    html = data;
});

fs.readFile('./main/kakaoNew.js', "utf8", function (err, data) {
    if (err) {
        throw err;
    }
    js = data;
});


app.get('/server/hello/:os', function (req, res) {
    res.json({ "msg": req.params.os });
});

app.get('/kennel/check', function (req, res) { // 안되는거~!

    var kennel = 0;
    request('http://192.168.0.48:8000/kennel/check', function (error, response, body) {
        if (!error && response.statusCode == 200 || 304) {
            kennel = 1;
            console.log(kennel);
        }
    });

    res.json({ "msg": kennel });

});
app.get('/location/kakaoNew.js',function(req,res){
    res.sendFile(path.join(__dirname,'main','kakaoNew.js'));
})

app.get('/location/map/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'kakaoNew.html'));
});

app.get('/location/map', function (req, res) {

    var kakaourl = "//dapi.kakao.com/v2/maps/sdk.js?appkey=aefdc433d657b3802f48149819d88496&libraries=services";

    var msg = { 'html': html, 'js': js, 'src': kakaourl };
    var jsonData = JSON.stringify(msg);
    res.send(jsonData);
    //res.sendFile(path.join(__dirname, 'main', 'kakaoNew.html'));
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});

app.listen(PORT, "0.0.0.0", function (req, res) {
    console.log('Server is running at:', PORT);
});



