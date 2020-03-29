$(function() {
  if (!$('.video-container')[0]) {
    return;
  }

  let hostId;
  let peer;

  function streamVideo() {
    navigator.getUserMedia = navigator.GetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = $('#local-video')[0];
        if (localVideo) {
          localVideo.srcObject = stream;
          window.localStream = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }

  function initializePeerId() {
    const id = document.getElementById('readerId').innerHTML
    var conn;
    var peer_id;
    peer = new Peer(id);
    const heading = $('h2');
    let peerId;

    peer.on('open', function(id) {
      peerId = id;
      console.log('my peer ID is: ' + id);
      $(`<p>Your peer id is ${peerId}</p>`).insertAfter(heading);
    });

    peer.on('connection', function(connection){
      conn = connection
      peer_id = connection.peer

      document.getElementById('connId').value = peer_id;
    });

    peer.on('close', function() {
        conn = null;
        alert("Connection destroyed. Please refresh");
        console.log('Connection destroyed');
    });


    peer.on('error', function(err){
      alert("an error has occured:" + err);
      console.log(err);
    });

  /*  document.getElementById('conn_button').addEventListener('click', function(){
        peer_id = document.getElementById("connId").value;

        if(peer_id){
          conn = peer.connect(peer_id)
        }else{
          alert("enter an id");
          return false;
        }
    });
    */

    peer.on('call', call => {
      console.log('answering');
      call.answer(window.localStream); // answer call with a/v stream

      call.on('stream', (remoteStream) => {
        const remoteVideo = $('#remote-video');
        remoteVideo.attr('src', remoteStream);
        remoteVideo.srcObject = remoteStream;
      });
    });
  }

  function connectCall() {
    peer_id = document.getElementById("listenerId").innerHTML;

    if(peer_id){
      conn = peer.connect(peer_id)
    } else {
      alert("enter an id");
      return false;
    }

    console.log("calling a peer:"+ peer_id)
    console.log(peer);

    var call = peer.call(peer_id, window.localStream);

    call.on('stream', (remoteStream) => {
      const remoteVideo = $('#remote-video')[0];
      if (remoteVideo){
        remoteVideo.srcObject = remoteStream;
      }
    });
  }

  function disconnectCall() {

  }

  function renderDisconnectButton(btn) {
    $(btn).html('End Call');
    $(btn).removeClass('btn-success');
    $(btn).addClass('btn-danger');
  }

  function renderConnectButton(btn) {
    $(btn).html('Video chat with Listener');
    $(btn).removeClass('btn-danger');
    $(btn).addClass('btn-success');
  }

  $('#call_button').on('click', function(e){
    const button = e.target;
    const status = $(button).attr('data-connected');
    console.log(status);
    if (status === 'false') {
      console.log('connecting');
      connectCall();
      renderDisconnectButton(button);
    } else {
      disconnectCall();
      renderConnectButton(button);
    }
  });


  function getHostId() {
    let searchParams = new URLSearchParams(window.location.search);
    hostId = searchParams.get('id');
  }
/*
  function callHost() {
    console.log(`calling host: ${hostId}`);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true},
      MediaStream => {
        const call = peer.call(hostId, MediaStream);
        call.on('stream', (remoteStream) => {

          const remoteVideo = $('#remote-video')[0];
          remoteVideo.srcObject = remoteStream;
        });
      });
  }*/

  initializePeerId();
  streamVideo();

//  getHostId();
//  if (hostId) { callHost() }


});
