$(document).ready( function() {
  setInterval(flagUp, 4000);
});

function flagUp() {
  $('.flag').fadeTo(1000, Math.random());
}
