let meetingLeave=document.querySelector(".leave-meeting")
let showPeer = document.querySelector(".show-peer")
let callingToPeer =   document.querySelector(".call-peer")
let screenShare=document.querySelector(".shareScreen")
let muteAudioBtn =  document.querySelector(".button1")
let muteVideoBtn = document.querySelector(".button2")
window.addEventListener("load", function (e) {
    var peer = new Peer();
    let myStream;
    let currentPeer;
    let peerList = [];
    peer.on("open", function (id) {
      showPeer.innerHTML = id;
    });
    peer.on("call", function (call) {
      //sender side 
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })  //permission for audio video
        .then(function (stream) { // if user allowed
          myStream = stream;
          addOurVideo(stream);  // add video in sender side
          call.answer(stream);  // call receiver
          call.on("stream", function (remoteStream) {
            if (!peerList.includes(call.peer)) {
              addRemoteVideo(remoteStream); // add video on reciver side
              currentPeer = call.peerConnection;
              peerList.push(call.peer);
            }
          });
        })
        .catch(function (err) {
          console.log(err + " unable to connnect");
        });
    });
   // call to peer
      callingToPeer.addEventListener("click", function (e) {
        let remoteId = document.querySelector(".peerId").value;
       showPeer.innerHTML ="connecting " + remoteId;
        callPeer(remoteId);
      });
    
      screenShare.addEventListener("click", function (e) {
        navigator.mediaDevices
          .getDisplayMedia({
            video: {
              cursor: "always",
            },
            audio: {
              echoCancellation: true,
              noiceSuppression: true,
            },
          })
          .then(function (stream) {
            let videoTrack = stream.getVideoTracks()[0];
            let sender = currentPeer.getSenders().find(function (s) {
              return s.track.kind == videoTrack.kind;
            });
            sender.replaceTrack(videoTrack);
          })
          .catch(function (err) {
            console.log(err + "unable to get displa");
          });
      });
    function callPeer(id) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })  // receiver side 
        .then(function (stream) {
          myStream = stream;
          addOurVideo(stream);
          let call = peer.call(id, stream);
          call.on("stream", function (remoteStream) {
            if (!peerList.includes(call.peer)) {
              addRemoteVideo(remoteStream); //add sender side
              currentPeer = call.peerConnection;
              peerList.push(call.peer);
            }
          });
        })
        .catch(function (err) {
          console.log(err + " unable to connnect");
        });
    }
    function addOurVideo(stream) {
      let videoEle = document.createElement("video");
      videoEle.classList.add("video", "my-video");
      videoEle.srcObject = stream;
      videoEle.play();
      document.querySelector(".our-video").append(videoEle);
      document.querySelector(".show-peer").innerHTML = "connected";
    }
    function addRemoteVideo(stream) {
      document.querySelector(".show-peer").innerHTML = "connected";
      let videoEle = document.createElement("video");
      videoEle.srcObject = stream;
     
      videoEle.style.borderRadius = 10 + "px";
      videoEle.play();
      document.querySelector(".remote-video").append(videoEle);
    }

   muteAudioBtn.addEventListener("click", function () {
      muteAudio(myStream);
      console.log("hii");
    });
    muteVideoBtn.addEventListener("click", function () {
      muteVideo(myStream);
    });

    let isAudio = true;
    function muteAudio() {
      if (myStream) {
        console.log(myStream.getAudioTracks());
        myStream
          .getAudioTracks()
          .forEach((track) => (track.enabled = !track.enabled));
        isAudio = !isAudio;
        //return all the  array  of audio which our stream is playing
        if (isAudio == true) {
          document.querySelector(
            ".button1"
          ).innerHTML = `<i class="fas fa-microphone-alt"></i>`;
         document.querySelector(
            ".button1"
          ).style.backgroundColor = "#2f80ec"
        } else {
          document.querySelector(
            ".button1"
          ).innerHTML = `<i class="fas fa-microphone-alt-slash"></i>`;
          document.querySelector(
            ".button1"
          ).style.backgroundColor = "red"
        }
      }
    }
    let isVideo = true;
    function muteVideo() {
      if (myStream) {
        console.log(myStream.getVideoTracks());
        myStream
          .getVideoTracks()
          .forEach((track) => (track.enabled = !track.enabled));
        isVideo = !isVideo;

        if (isVideo == true) {
          document.querySelector(
            ".button2"
          ).innerHTML = ` <i class="fas fa-video"></i>`;
          document.querySelector(
            ".button1"
          ).style.backgroundColor = "#2f80ec"
        } else {
          document.querySelector(
            ".button2"
          ).innerHTML = ` <i class="fas fa-video-slash"></i>`;
          document.querySelector(
            ".button1"
          ).style.backgroundColor = "red"
        }
      }
    }
   

    // meeting leave
    meetingLeave.addEventListener("click", function () {
        leaveMeeting();
        peer.on("call", (call) => {
          call.close();
        });
      });
    function leaveMeeting() {
      closeVideoCall();
    }

    function closeVideoCall() {
      let remoteVideo = document.querySelector(".remote-video");
      let localVideo = document.querySelector(".our-video");
      console.log(currentPeer);
      if (currentPeer) {
        currentPeer.ontrack = null;
        currentPeer.onremovetrack = null;
        currentPeer.onremovestream = null;
        currentPeer.onicecandidate = null;
        currentPeer.oniceconnectionstatechange = null;
        currentPeer.onsignalingstatechange = null;
        currentPeer.onicegatheringstatechange = null;
        currentPeer.onnegotiationneeded = null;
        console.log(currentPeer);
        if (remoteVideo.srcObject) {
          remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
        }

        if (localVideo.srcObject) {
          localVideo.srcObject.getTracks().forEach((track) => track.stop());
        }

        currentPeer.close();
        currentPeer = null;
      }

       remoteVideo.remove();
        localVideo.remove()

    }
  });