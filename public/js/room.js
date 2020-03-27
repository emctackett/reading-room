$(function() {
  function streamVideo() {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = $('#local-video')[0];
        console.log(localVideo);
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }

  function connectSocket() {
    
  }

  if ($('.video-container')) {
    streamVideo();
    connectSocket();
  }
});
