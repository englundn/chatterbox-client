// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';
var roomName = 'default room';


app.init = function() {
};

//    SET UP ROOMS

app.renderRoom = function(roomName) {
  $('#roomSelect').append($('<option>' + roomName + '</option>').val(roomName));
};


//    SUBMIT MESSAGES

$('.submitB').on('click', function() {
  var message = messageMaker($('input').val());
  app.send(message);
  app.renderMessage(message);
});

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    datatype: 'jsonp',
    success: console.log('success')
  });
  $('input').val('');
};

app.renderMessage = function(message) {
  var string = '<div class="username"><span class="username">' + message.username + '</span><span class="message">: ' + message.text + '</span></div>';
  $('#chats').append(string);
};

var messageMaker = function(message) {
  var obj = {
    username: window.location.search.slice(10),
    text: message,
    roomname: window.roomName};
  return obj;
};

//     CLEAR MESSAGES

$('.clearB').on('click', function() {
  app.clearMessages();
});

app.clearMessages = function() {
  $('#chats').text('');
};



//     FETCH MESSAGES

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function (result) {
      messageGetter(result);
      console.log('success');
    }
  });
};

var messageGetter = function(input) {
  input.results.forEach(function(message) {
    var string = '<div class="username"><span class="username">' + message.username + '</span><span class="message">: ' + message.text + '</span></div>';
    $('#chats').append(string);
  });
};

//    ADD FRIENDS


$('.username').click(function(argument) {
  console.log('HELLO');
});










