const express = require('express');
const bodyparser = require('body-parser');
const mongoose      =require('mongoose')
const morgan        =require('morgan')
const https = require('https');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users');
var jsonParser = bodyparser.json()
const AuthRoute = require('./routes/auth')

mongoose.connect('mongodb+srv://yogesh:yogesh14@cluster0.eauui.mongodb.net/testdb',{useNewURlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error',(err) => {
  console.log(err)
})
db.once('open',() =>{
  console.log('Database Connection Established')
})
const User      = require('./models/User');
const { request } = require('express');
const { register } = require('./controllers/AuthController');

app=express();


//app.use(morgan('dev'))
//app.use(bodyParser.urlencoded({extended:true}))
//app.use(bodyParser.json())
const server = http.createServer(app);
const port = process.env.port || 8080;
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
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

    response.render('login')
});
app.get("/index",function(request,response){

  response.sendFile(__dirname+"/index.html");
});
app.get("/about",function(request,response){

  response.sendFile(__dirname+"/about.html");
});
app.get("/login",function(request,response){
 
    response.render("login");
});
app.post("/login",urlencodedParser,function(req,res){
  const bcrypt    =require('bcryptjs')
  const jwt       =require('jsonwebtoken')
  console.log(req.body);
    var username = req.body.email
    var password = req.body.password

    User.findOne({$or: [{email:username},{phone:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token = jwt.sign({name: user.name}, 'verySecretValue',{expiresIn: '1h'})
                    // res.json({

                    //     message: 'Login Successful!',
                    //     token 
                        
                    // })
                    res.sendFile(__dirname+"/index.html");
                }else{
                    res.json({
                        message: 'Password does not match!'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user Found!'
            })
        }
    })
});

// app.post("/register",function(request,response){
//   console.log(request)
//   // let user = new User({
//   //   name: 'yogi',
//   //   email: 'yogi',
//   //   phone: '866887666',
//   //   password: '8899'
//   // })
//   //user.save()
//   response.sendFile(__dirname+"/register.html");
// });
app.get("/register",function(request,response){

  response.render("register");
});
app.post('/register',urlencodedParser, function (req, res) {

const bcrypt    =require('bcryptjs')
console.log(req.body);
  bcrypt.hash(req.body.pass,10,function(err,hashedPass){
    if(err){
        res.json({
            error:err
        })
    }
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPass
    })
    user.save()
    .then(user =>{
        // res.json({
        //     message: 'User Added Successfully'
        // })
        res.render('login')
    })
    .catch(error=>{
        res.json({
            message: 'An error occured!'
        })
    })
})
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
app.use('/api',AuthRoute)