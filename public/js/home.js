$(function() {
  $('#new-room').click((e) => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href= '/schedule';
    link.click();
  });
});
