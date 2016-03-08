var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var PORT = process.env.PORT || process.env.NODE_PORT || 3000;

app.listen(PORT);

var ctxData;
var refreshRate = false;
var numUsers = 0;

function handler (req, res) {
  fs.readFile(__dirname + '/../client/client.html', function (err, data) {
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {

  socket.join('room1');
  
  socket.on('newUser', function() {
	console.log("here");
	numUsers++;
	io.sockets.in('room1').emit('updateRefresh', refreshRate);
	io.sockets.in('room1').emit('updatedUsers', ctxData); 
	io.sockets.in('room1').emit('updateUserCount', numUsers); 
  });
  
  socket.on('refreshChange', function(data) {
	refreshRate = data;
	io.sockets.in('room1').emit('updateRefresh', refreshRate);
  });
  
  socket.on('userImageUpdate', function(data) {
	ctxData = data;
	
	io.sockets.in('room1').emit('updatedUsers', ctxData); 
  });
  
  socket.on('disconnect', function(data) {
	numUsers--;
	io.sockets.in('room1').emit('updateUserCount', numUsers); 
    socket.leave('room1');
  });
});

console.log("listening on port " + PORT);