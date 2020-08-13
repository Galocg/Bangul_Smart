const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT = 8000;

app.use(express.static('main'));


var e = function(req, res, next){
  console.log('new user');
  next();
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
     next();
 });

app.use(e);


// app.get('/test/:a', function(req, res){ // URL로 데이터 주고 받기
//     res.json({"test":1,"uid":req.params.a});
// });

app.get('/server/hello', function(req,res){
    res.json({"msg":"hello"});
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});

app.listen(PORT, function(req,res){
  console.log('Server is running at:',PORT);
});