$(function() {
  function generateUniqueId() {
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = (c == 'x' ? r : (r & 0x3 | 0x8));
      return v.toString(16);
    });
  }

  $('#new-room').click((e) => {
    const roomId = generateUniqueId();
    console.log(roomId);
    // generate new link
    // open new link in new tab
  });
});
