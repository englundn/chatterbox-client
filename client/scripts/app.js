// YOUR CODE HERE:
var app = {};

app.myName = window.location.search.slice(10);
app.friends = {};
app.friends[app.myName] = app.myName;
app.rooms = {};

app.server = 'https://api.parse.com/1/classes/messages';


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
  app.fetch();
};

//    SET UP ROOMS

app.renderRoom = function(roomName) {
  $('#roomSelect').append($('<option>' + roomName + '</option>').val(roomName));
};

$('#roomSelect').change(function() {
  app.clearMessages();
  app.fetch();
});

var addRoom = function(input) {
  input.results.forEach(function(message) {
    var roomName = escapeHtml(message.roomname);
    app.rooms[roomName] = roomName;
  });
  Object.keys(app.rooms).forEach(app.renderRoom);
};


//    SUBMIT MESSAGES
app.handleSubmit = function() {
  var message = messageMaker($('input').val());
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
  var string = '<div><span class="username">' + escapeHtml(message.username) + '</span><span class="message">: ' + escapeHtml(message.text) + '</span></div>';
  $('#chats').prepend(string);
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
  input.results.forEach(function(message) {
    if (app.currentRoom === escapeHtml(message.roomname)) {
      var string = '<div><span class="username">' + escapeHtml(message.username) + '</span><span class="message">: ' + escapeHtml(message.text) + '</span></div>';
      $('#chats').append(string);
    }
  });
  $('.username').click(function() {
    app.handleUsernameClick($(this));
  });
};

//

app.handleUsernameClick = function(event) {
  var oldLength = Object.keys(app.friends).length;
  app.friends[event.text()] = event.text();
  if (Object.keys(app.friends).length !== oldLength) {
    $('#friends').append('<div>' + event.text() + '</div>');
  }
};

app.init();






