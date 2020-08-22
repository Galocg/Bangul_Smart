const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT = 80;

app.use(express.static('main'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
       next();
   });


var e = function(req, res, next){
  console.log('new user');
  next();
};

app.use(e);

app.get('/.well-known/pki-validation/43570E93F54364E42584851E3555C84D.txt', function (req, res) {
    res.sendFile(path.join(__dirname, 'main', '43570E93F54364E42584851E3555C84D.txt'));
});


app.get('/server/hello', function(req,res){
    res.json({"msg":"hello"});
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'main', 'main.html'));
});

app.listen(PORT, function(req,res){
  console.log('Server is running at:',PORT);
});