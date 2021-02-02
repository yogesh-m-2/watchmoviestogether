var vid = document.getElementById("existing-iframe-example");


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
var status=null;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
async function onYouTubeIframeAPIReady() {
  player = new YT.Player('existing-iframe-example', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

 function disp(){
  console.log(event.target);
  player.seekTo(40, true);


}

// 4. The API will call this function when the video player is ready.
async function onPlayerReady(event) {
  event.target.playVideo();
  console.log(player.getCurrentTime());
}


var done = false;
async function onPlayerStateChange(event) {
console.log(event.data);
  if (event.data == YT.PlayerState.PLAYING && !done) {
   // setTimeout(stopVideo, 6000);

    done = true;
  }
  else{done=false;}
if(done==true){
  console.log("for playing"+player.getCurrentTime());
  if(event.data!=3){
    socket.emit("pause_play",{action:"playing",time:player.getCurrentTime()});
  }

}
else{
  //player.pauseVideo();
  console.log("for pausing"+player.getCurrentTime());
  if(event.data!=3){
    socket.emit("pause_play",{action:"paused",time:player.getCurrentTime()});
  }

}
}
async function stopVideo() {
  player.stopVideo();
}
 function sendJSON(name,email,phone,pass){

            

            // Creating a XHR object
            let xhr = new XMLHttpRequest();
            let url = "http://localhost:8080/registering";

            // open a connection
            xhr.open("POST", url);

            // Set the request header i.e. which type of content you are sending
            xhr.setRequestHeader("Content-Type", "application/json");
          //  xhr.setRequestHeader("Accept-Encoding", "json");
            xhr.setRequestHeader("Accept", "*/*");
            //xhr.setRequestHeader("Content-Type", "application/json");

            // Create a state change callback
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Print received data from server
                    console.log("this"+this.responseText);
                  //  player.seekTo(this.responseText, true);
                    setTimeout(600000);
                }
            };

            // Converting JSON data to string
            var data = JSON.stringify({ "name": name, "email": email , "phone": name, "password": email });
            console.log(data);
            // Sending data with the request
            xhr.send(data);
        }
