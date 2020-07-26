const express = require('express');
const path = require('path');
var request = require('request');


const app = express();
const PORT = process.env.PORT = 8000;

app.use(express.static('main'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});

const logger = require('./main/middleware/logger.js');
app.use(logger());

app.get('/kennel/check', function(req,res){
    res.send(1);
});

app.listen(PORT,"0.0.0.0",function(req,res){
  console.log('Server is running at:',PORT);
});