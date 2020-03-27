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

  function connectSocket() {
    // io.on('connection', socket => {
    //   console.log('hello socket connected');
    // });
  }

  if ($('.video-container')) {
    streamVideo();
    connectSocket();
  }
});
