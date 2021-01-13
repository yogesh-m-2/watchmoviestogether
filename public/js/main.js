const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//var link="https://www.youtube.com/embed/tFPMDHmWq28";
document.getElementById("bttn").addEventListener("click",loadurl);

function loadurl(){
  var link=document.getElementById("linker").value;
  var str2=link.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
  console.log(document.getElementById("existing-iframe-example").src);
  document.getElementById("existing-iframe-example").src=str2;
}
const {username,room} = Qs.parse(location.search,{
ignoreQueryPrefix: true
});
socket.on("pause_play_action",({action,time})=>{
 if(action=="playing"){
   console.log("playing"+time);
   // if(time>(player.getCurrentTime()+1) || time<(player.getCurrentTime()-1)  ){
   //   player.seekTo(time,true);
   // }

   player.playVideo();

 }else if (action=="paused") {
   console.log(event.data);
   {
     player.seekTo(time,true);
   }
   player.pauseVideo();

 }
});
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
});

socket.emit('joinRoom',{username,room})
console.log(username,room);
socket.on('message',message=>{
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  const msg=(e.target.elements.msg.value);
  socket.emit('chatMessage',msg);
  e.target.elements.msg.value='';
});

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML =`<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user=>`<li>${user.username}</li>`).join()}
  `;
}
