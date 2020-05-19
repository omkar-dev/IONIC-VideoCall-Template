var _ = require('lodash');
var Peer = require('simple-peer');
var wrtc = require('wrtc');
var http = require('http');
var browserify = require('browserify-middleware');
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var DEFAULT_PEER_COUNT = 5;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', function (socket) {
  console.log('Connection with ID:', socket.id);




  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);  
    io.to(clients).emit('peer', {
      peerId: socket.id,
      initiator: true
    });
    socket.emit('peer', {
      peerId: clients,
      initiator: false
    });
    
  });


// var peersToAdvertise = _.chain(io.sockets.connected.id)
//   .values()
//   .without(socket)
//   .sample(DEFAULT_PEER_COUNT)
//   .value();



// if(peersToAdvertise && peersToAdvertise.length>0){

//   peersToAdvertise.forEach(function(socket2) {
//     socket2.emit('peer', {
//       peerId: socket.id,
//       initiator: true
//     });
//     socket.emit('peer', {
//       peerId: socket2.id,
//       initiator: false
//     });
//   });
// }


socket.on('signal', function(data) {
  console.log(data,'sif')
  var socket2 = io.sockets.connected[data.peerId];
  if (!socket2) { return; }
  console.log('Proxying signal from peer %s to %s', socket.id, socket2.id);

  socket2.emit('signal', {
    signal: data.signal,
    peerId: socket.id
  });
});
});

server.listen(process.env.PORT || '3000');












// var peer1 = new Peer({ initiator: true, wrtc: wrtc });
// var peer2 = new Peer({ wrtc: wrtc });
 
// peer1.on('signal', data => {
//     peer2.signal(data)
//   })
   
// peer2.on('signal', data => {
//     peer1.signal(data)
//   })


//   peer2.on('stream', stream => {
//     console.log(stream)
//   })
   
//   function addMedia (mockedStream) {
//     peer1.addStream(mockedStream) // <- add streams to peer dynamically
//   }
   
//   addMedia(mockedStream);

//   app.listen(3000, () => {
//     return console.log('Server is up on 3000')
// });




