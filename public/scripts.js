document.addEventListener('DOMContentLoaded', function () {
  var cursor = document.querySelector('.blob');

  document.addEventListener('mousemove', function(e) {
      var x = e.clientX;
      var y = e.clientY;
      cursor.style.transform = `translate(${x - cursor.offsetWidth / 2}px, ${y - cursor.offsetHeight / 2}px)`;
  });
});
