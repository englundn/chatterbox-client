// YOUR CODE HERE:
var app = {};

var roomName = 'default room';

app.init = function() {

};

var button = document.getElementById('myButton');

$('button').on('click', function() {
  var message = messageMaker($('input').val());
  app.send(message);
});

var messageMaker = function(message) {
  var obj = {
    username: window.location.search.slice(10),
    text: message,
    roomname: window.roomName};
  return obj;
};


app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    datatype: 'jsonp',
    success: console.log(message)
  });
  $('input').val('');

};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    success: function (result) {
      console.log(result);
    }
  });
};

var messageGetter = function(input) {
  console.log(input);
};