$(function() {
  function streamVideo() {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = $('#local-video')[0];
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }

  if ($('.video-container')[0]) {
    streamVideo();

    const peer = new Peer({key: 'lwjd5qra8257b9'});

    peer.on('open', function(id) {
      console.log('my peer ID is: ' + id);
    });
  }
});
