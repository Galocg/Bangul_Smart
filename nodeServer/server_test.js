const express = require('express');
const path = require('path');

const app = express();


var e = function(req, res, next){
    console.log('안녕!');
    next();
};

app.use(e); // app.use는 미들웨어 쓰는거. 

app.use(express.static('main'));

app.get('/', (req, res) => { // get -> http 메소드
    res.sendFile(path.join(__dirname, 'main', 'kakaoNew.html'));
  });

// app.get('/',function(req,res){
//     res.send('<html><h3>Hi</h3></html>');
// });
app.listen(8000, function(){
    console.log('Server is running at: 8000');
});