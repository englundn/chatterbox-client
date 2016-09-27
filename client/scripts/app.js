// YOUR CODE HERE:
var app = {};

app.friends = {};

app.server = 'https://api.parse.com/1/classes/messages';
var roomName = 'default room';



var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return '';
  });
};

app.init = function() {
};

//    SET UP ROOMS

app.renderRoom = function(roomName) {
  $('#roomSelect').append($('<option>' + roomName + '</option>').val(roomName));
};


//    SUBMIT MESSAGES
app.handleSubmit = function() {
  console.log('submit');
  var message = messageMaker($('input').val());
  app.send(message);
  app.renderMessage(message);
};

$('#send .submit').on('submit', app.handleSubmit);


app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    datatype: 'jsonp'
  });
  $('#message').val('');
};

app.renderMessage = function(message) {
  var string = '<div><span class="username">' + escapeHtml(message.username) + '</span><span class="message">: ' + escapeHtml(message.text) + '</span></div>';
  $('#chats').append(string);
  $('.username').click(function() {
    app.handleUsernameClick($(this));
  });
};

var messageMaker = function(message) {
  var obj = {
    username: window.location.search.slice(10),
    text: message,
    roomname: window.roomName};
  return obj;
};

//     CLEAR MESSAGES

$('.clear').on('click', function() {
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
    data: {order: '-createdAt'},
    success: function (result) {
      // console.log(result);
      messageGetter(result);
    }
  });
};

// setInterval(app.fetch, 200);

var messageGetter = function(input) {
  console.log(input);

  input.results.forEach(function(message) {
    var string = '<div><span class="username">' + escapeHtml(message.username) + '</span><span class="message">: ' + escapeHtml(message.text) + '</span></div>';
    $('#chats').append(string);
  });
  $('.username').click(function() {
    app.handleUsernameClick($(this));
  });
};


app.handleUsernameClick = function(event) {
  app.friends[event.text()] = event.text();
};








