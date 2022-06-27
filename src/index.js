const http = require('http');
const jsonServerApp = require('./json-routes');

const server = http.createServer(jsonServerApp);

server.listen(4000, '0.0.0.0', () => {
  console.log('HTTP (JSON) Server is running');
});
