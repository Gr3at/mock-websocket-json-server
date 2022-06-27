const WebSocketServer = require('ws').WebSocketServer;
const parse = require('url').parse;
const mockNotifications = require('./json-server-db.json').notifications;

/**
 * newNotificationObj A notification that is intented to be delivered after Xmsec,
 * instead during the initial 'db' lookup.
 * Part of the `on('connection',()=>{}) callback`.
 */
const newNotificationObj = {
  uuid: "ed3c55cc-0f6a-46d8-8b08-59623c949103",
  timestamp: "2022-06-10T11:00:00Z",
  readStatus: "UNREAD",
  message: "A new text message or inner JSON.",
};

const responseNotificationObj = {
  uuid: "50522abe-2758-45cd-9ec7-d26573856f6d",
  timestamp: "2022-06-10T12:00:00Z",
  readStatus: "READ",
  message: "Changes accepted.",
};


/**
 * The websocket part of the mock server along with some http server specific handlings (upgrade, match route).
 * To test connectivity use any ws test client (e.g. postman, or some browser extension and connect to `ws://localhost:4000/feed`).
 * Upon connection, any existing db notifications will be received. After 5 seconds, a new notification will automatically arrive,
 * overriding the old message.
 * Send a test message, e.g. {"userResponse": "UPDATE_BID"} to trigger the 'on message' logic execution.
 * @param {*} httpServer The underlying http Server instance. This will actually serve the ws endpoint(s).
 * @param {*} wsPathName The pathname of the ws capable endpoint
 * @param {*} feedIntervalStep This is an interval to emulate some external event, resulting in the presence of a new notification object. In Xmsec a new notification will arrive, emulating automated real-time message delivery.
 */
module.exports = (httpServer, wsPathName = '/feed', feedIntervalStep = 30_000) => {
  const notificationsWS = new WebSocketServer({ noServer: true });
  let responseTimeout;
  let feedInterval;

  notificationsWS.on('connection', function onConnection(ws, connectionRequest) {
    console.log('WebSocket connection established');
    // Send any existing db notifications.
    ws.send(JSON.stringify({ notifications: mockNotifications }));

    feedInterval = setInterval(() => {
      // this could also be a setTimeout since it's just a single, notification item, message emulated.
      ws.send(JSON.stringify({ notifications: [newNotificationObj] })); // send array of objects, to be consistent of what to expect in the client side.
      console.debug('Interval placeholder to send new notifications.');
    }, feedIntervalStep);

    /**
     * Register the on message callback. Executed each time a web app/client, sends data to the ws server.
     */
    ws.on('message', function onMessage(data) {
      try {
        let dataObj = JSON.parse(data); // assuming json payload
        console.log(`Received message from web client with data: ${data}.`);

        // assuming the client sends an object with the 'userResponse' attribute in, set to 'UPDATE_BID'.
        if (dataObj?.userResponse === "UPDATE_BID") {
          responseTimeout = setTimeout(() => {
            ws.send(JSON.stringify({ notifications: [responseNotificationObj] }));
          }, 1_000);
        }
      }
      catch (error) {
        // handle error
      }
    });

    /**
     * Register the on close callback. Cleanup before closing the connection.
     */
    ws.on('close', () => {
      clearInterval(feedInterval);
      clearTimeout(responseTimeout);
      console.log('WebSocket connection closed.');
    });
  });

  httpServer.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);

    if (pathname === wsPathName) {
      notificationsWS.handleUpgrade(request, socket, head, function done(ws) {
        notificationsWS.emit('connection', ws, request);
      });
    } else {
      console.log('Closing the socket!!');
      socket.destroy();
    }
  });
};
