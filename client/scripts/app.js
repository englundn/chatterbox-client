// YOUR CODE HERE:
var app = {};

app.myName = window.location.search.slice(10);
app.friends = {};
app.rooms = {};

app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {
  app.fetch();
};

//    SET UP ROOMS

app.renderRoom = function(roomName) {
  var cleanRoom = $('<option/>');
  cleanRoom.text(roomName).appendTo(cleanRoom);
  $('#roomSelect').append(cleanRoom);
};

$('#roomSelect').change(function() {
  app.clearMessages();
  app.fetch();
});

var addRoom = function(input) {
  input.results.forEach(function(message) {
    var roomName = message.roomname;
    app.rooms[roomName] = roomName;
  });
  Object.keys(app.rooms).forEach(app.renderRoom);
};

var createRoom = function(room) {
  if (!app.rooms.hasOwnProperty(room)) { 
    app.rooms[room] = room;
    app.renderRoom(room);
    $('#roomSelect').val(room);
    app.fetch();
  }
};

$('.roomSubmit').on('click', function() {
  createRoom($('#roomCreate').val());
  $('#roomCreate').val('');
});

//    SUBMIT MESSAGES
app.handleSubmit = function() {
  var message = messageMaker($('#message').val());
  if (message.text.length) { 
    app.send(message);
    app.renderMessage(message);
  }
};

$('#send .submit').on('click', app.handleSubmit);

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    datatype: 'jsonp'
  });
  $('#message').val('');
};

$('#message').keypress(function (e) {
  if (e.which === 13) {
    app.handleSubmit();
    return false;
  }
});

app.renderMessage = function(message) {

  var friendly = app.friends.hasOwnProperty(user) ? $('<div class = "friendly" />') : $('<div />');
  
  var user = $('<span class="username" />');
  user.text(message.username).appendTo(user);
  var text = $('<span class="message" />');
  text.text(message.text).appendTo(text);
  friendly.append(user).append(': ').append(text);
  $('#chats').prepend(friendly);
  $('.username').click(function() {
    app.handleUsernameClick($(this));
  });
};

var messageMaker = function(message) {
  var obj = {
    username: app.myName,
    text: message,
    roomname: app.currentRoom};
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
  console.log('fetched');
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    success: function (result) {
      if (!(Object.keys(app.rooms).length)) {
        addRoom(result);
      }
      app.currentRoom = $('#roomSelect').val();
      messageGetter(result);
    }
  });
};

var messageGetter = function(input) {
  $('#chats').empty();
  console.log('getter');
  input.results.forEach(function(message) {
    if (app.currentRoom === message.roomname) {
      app.renderMessage(message);
    }
  });
  $('.username').click(function() {
    app.handleUsernameClick($(this));
  });
};

// ADD FRIENDS

app.handleUsernameClick = function(event) {
  var oldLength = Object.keys(app.friends).length;
  if ( event.text() !== app.myName) {
    app.friends[event.text()] = event.text();
  }
  if (Object.keys(app.friends).length !== oldLength) {
    $('#friends').append('<div>' + event.text() + '</div>');
    app.fetch();
  }
};

app.init();






