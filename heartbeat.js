var fork = require('child_process').fork;
var server, heartbeat;

function startServer() {
  console.log('Starting server with Heartbeat');
  server = fork('app.js');

  //when the server goes down restart it
  server.on('close', (code) => {
    startServer();
  });

  //when server sends a heartbeat message save it
  server.on('message', (message) => {
    heartbeat = message ? message.heartbeat : null;
  });

  //ask the server for a heartbeat
  server.send({
    request: 'heartbeat'
  });

  //wait 5 seconds and check if the server responded
  setTimeout(checkHeartbeat, 5000);
}

function checkHeartbeat() {
  if (heartbeat) {
    // console.log('Server is alive');

    //clear the heart beat and send request for a new one
    heartbeat = null;
    server.send({
      request: 'heartbeat'
    });

    //set another hearbeat check
    setTimeout(checkHeartbeat, 5000);

  } else {
    console.log('Server looks stuck...killing');
    server.kill();
    setTimeout(startServer(), 2000);
  }
}

startServer();