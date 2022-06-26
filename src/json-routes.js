const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router('./src/json-server-db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);

// Add any auto-generated routes from json-server-db.json
app.use('/api', router);

module.exports = app;
