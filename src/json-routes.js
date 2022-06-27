const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router('./src/json-server-db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);


/**
 * A custom route to override the existing default route.
 * To test from cli run `curl -X GET "http://127.0.0.1:4000/api/transactions/?datetime=2022-06-26T10:00:00Z"`
 */
app.get('/api/transactions/', (req, res) => {
    const datetime = req.query.datetime ?? null;
    const dbItems = router.db.get('transactions').value();
    if (datetime) {
        const requestedItems = dbItems.filter((event) => event.datetime >= datetime);
        res.status(200).jsonp(requestedItems);
    } else {
        res.status(200).jsonp(dbItems);
        // or return all transactions
        // res.status(400).send('You need to provide all query params (datetime).');
    }
});


// Add any auto-generated routes from json-server-db.json
app.use('/api', router);

module.exports = app;
