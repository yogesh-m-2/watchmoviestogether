const express = require('express');
const bodyparser = require('body-parser');
const https = require('https');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users');
var jsonParser = bodyparser.json()

app=express();
const server = http.createServer(app);
const port = process.env.port || 8080;
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port,()=>console.log(port));
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyparser.urlencoded({ extended: false })

const botName='yogesh';
const io = socketio(server);

io.on('connection',socket =>{
  console.log('new ws connection...');
   socket.on('joinRoom',({username,room})=>{
     const user = userJoin(socket.id,username,room);
   socket.join(user.room);
   socket.on("pause_play",({action,time})=>{
    // console.log(time);
     io.to(user.room).emit("pause_play_action",{action,time});
   });
   socket.on("urllink",(url)=>{
     console.log(url);
     io.to(user.room).emit("urlrecv",url);
   });
     socket.emit('message',formatMessage(user.username,'welcome to chat'));
     socket.broadcast
     .to(user.room)
     .emit('message',formatMessage(botName,`${user.username} has joined the room`));
io.to(user.room).emit('roomUsers',{
room:user.room,
users:getRoomUsers(user.room)

});
   });

socket.on('disconnect', () => {
const user = userLeave(socket.id);

if (user) {
  io.to(user.room).emit(
    'message',
    formatMessage(botName, `${user.username} has left the chat`)
  );

  // Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });
}
});

  socket.on('chatMessage',msg=>{
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message',formatMessage(user.username,msg));
  });
});



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.setHeader('Content-Type', 'application/json');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
  //  res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get("/",function(request,response){

    response.sendFile(__dirname+"/index.html");
});
app.get("/login",function(request,response){

    response.sendFile(__dirname+"/login.html");
});
app.get("/home",function(request,response){

    response.sendFile(__dirname+"/index.html");
});
app.get("/chat",function(request,response){
  response.sendFile(__dirname+"/chat.html");

});
var flag=0;
var paus=0;
var pla=0;

app.post('/api',jsonParser, function (req, res) {

  var expression=req.body.name;
  console.log(expression);
  switch(expression) {
    case "paused":
    flag=1;
      //  res.send("paused");
        res.send(req.body.email);
      break;
    case "playing":
    flag=1;
    //  res.send("playing");
      res.send(req.body.email);
      break;
    default:
      res.send("unknown");
  }


});
app.get('/api/flags',jsonParser, function (req, res) {
res.send(""+flag+"");
});
