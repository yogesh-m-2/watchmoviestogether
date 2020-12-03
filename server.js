const express = require('express');
const bodyparser = require('body-parser');
const https = require('https');
const path = require('path');
const http = require('http');

var jsonParser = bodyparser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyparser.urlencoded({ extended: false })



app=express();
//app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(request,response){

    response.sendFile(__dirname+"/index.html");
});
app.get("/login",function(request,response){

    response.sendFile(__dirname+"/login.html");
});
app.get("/home",function(request,response){

    response.sendFile(__dirname+"/index.html");
});
app.get("/aboutme",function(request,response){

    response.sendFile(__dirname+"/aboutme.html");
});

app.get('/api',jsonParser, function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

})


const port = process.env.port || 8080;
app.listen(port,function(){
  console.log(port);
});
