const http = require('http');
const webSocketServer = require('./websocket-routes');
const jsonServerApp = require('./json-routes');

const server = http.createServer(jsonServerApp);

webSocketServer(server, '/feed', 5_000);

server.listen(4000, '0.0.0.0', () => {
  console.log('HTTP (JSON/WebSocket) Server is running');
});
