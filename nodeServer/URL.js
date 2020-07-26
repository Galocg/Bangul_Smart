const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT = 8000;

app.use(express.static('main'));



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