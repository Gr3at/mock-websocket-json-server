# mock-websocket-json-server
A json and WebSocket capable server, ideal for frontend development.

This is a base mock-server setup. Taking advantage of the fact that json-server is based on express,
it is combined with the _ws_ package to provide realtime capabilities while mocking. 

This implementation utilizes:
1. [Express](https://github.com/expressjs/express)
2. [json-server](https://github.com/typicode/json-server)
3. [ws](https://github.com/websockets/ws)

- [x] Start the simple (default) json-server with `yarn serve:json`. (more simplified codebase: 05ccaf08ceacca04476b0bebd05f384db8dabcf3)
Run `curl http://localhost:3000/transactions` on a separate terminal to retrieve all transaction records.

- [x] Start the fully capable custom websocket-json-server with `yarn serve`.
    - [x] This script allows serving endpoint under a subpath, e.g. `/api/`,
    - [x] as well as extend json-server functionality with custom logic (e.g. datetime filtering).
    - [x] Add websocket capabilities on top of the custom server, under the subpath `/feed`.

Run `curl http://localhost:4000/api/transactions` on a separate terminal to retrieve all transaction records.

Or `curl -X GET "http://127.0.0.1:4000/api/transactions/?datetime=2022-06-26T10:00:00Z"` to retrieve transaction after the provided datetime.

Connect to the WebSocket on the endpoint `ws://localhost:4000/feed`.

Use a reverse proxy with TLS termination capabilities (e.g. NGinX, Caddy) to enable secure communications.

> Note: Check out the `json-server` branch if you are not interested in WebSocket capabilities.

> Note 2: Check the commit sequence to understand the required (followed) steps to setup this mock server.
