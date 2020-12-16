const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-mesages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username,room} = Qs.parse(location.search,{
ignoreQueryPrefix: true
});
socket.on("pause_play_action",({action,time})=>{
 if(action=="playing"){
   console.log("playing"+time);
   if(time>(player.getCurrentTime()+1) || time<(player.getCurrentTime()-1)  ){
     player.seekTo(time,true);
   }

   player.playVideo();

 }else if (action=="paused") {
   console.log("paused"+time);
   if(time>(player.getCurrentTime()+1) || time<(player.getCurrentTime()-1)  ){
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
  //chatMessages.scrollTop = chatMessages.scrollHeight;

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
