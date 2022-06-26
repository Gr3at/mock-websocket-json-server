# mock-websocket-json-server
A json and WebSocket capable server, ideal for frontend development.

This is a base mock-server setup. Taking advantage of the fact that json-server is based on express,
it is combined with the _ws_ package to provide realtime capabilities while mocking. 

This implementation utilizes:
1. [Express](https://github.com/expressjs/expressjs.com)
2. [json-server](https://github.com/typicode/json-server)
3. [ws](https://github.com/websockets/ws)

Start the simple json-server with `yarn serve`.
Run `curl http://localhost:3000/transactions` on a separate terminal to retrieve all transaction records.