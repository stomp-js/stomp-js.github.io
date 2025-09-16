---
layout: single
title: 'Using StompJs'
date: 2025-03-22 07:59:22 +0530
categories: guide stompjs
toc: true
redirect_from:
  - /guide/stompjs/2018/06/28/using-stompjs-v5.html
  - /guide/stompjs/2018/06/29/using-stompjs-v5.html
  - /guide/stompjs/2018/06/30/using-stompjs-v5.html
  - /guide/stompjs/using-stompjs-v5.html
---

You can find samples at [https://github.com/stomp-js/samples/](https://github.com/stomp-js/samples/).

## The STOMP Broker

Ensure your STOMP broker supports STOMP over WebSockets. While some brokers support this out of the box, others may require additional configuration or enabling a plugin.

## Include stompjs

This npm package provides both a UMD build and ES modules. Web browsers can use the UMD build via a script tag. In Node.js, use ES module imports; CommonJS `require` is not supported.

### Polyfills

_Important: For Node.js and React Native, please check [Polyfills]._

### In Web Browser

- Download and include directly from the `bundles/` folder.
- Or use a CDN:
  - Minified: [https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.2.0/bundles/stomp.umd.min.js](https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.2.0/bundles/stomp.umd.js)
  - Unminified: [https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.2.0/bundles/stomp.umd.js](https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.2.0/bundles/stomp.umd.js)
- A global `StompJs` object will now be available. Read on to learn how to use it.

### In Node.js, TypeScript, or ES6

This library is developed in TypeScript, and type definitions are included in the distribution.

You can import classes like the following:

```javascript
import { Client, Message } from '@stomp/stompjs';
```

You can use these classes directly without prefixing them with `StompJs.`.

**There is no `StompJs` class/object to be imported.**

## Setting/getting options

All options can be set or read directly on the client instance:

```javascript
const client = new StompJs.Client();
client.brokerURL = 'ws://localhost:15674/ws';

console.log(client.brokerURL);
```

You can also pass them as key–value pairs to the [Client constructor](/api-docs/latest/classes/Client.html#constructor) or to [Client#configure](/api-docs/latest/classes/Client.html#configure).

## Create a STOMP client

STOMP JavaScript clients communicate with a STOMP server using a `ws://` or `wss://` URL.

The example below shows how to use this library when included via a script tag. When included via an ES module, no need to prefix the class names with `StompJs.`. It will be `const client = new Client();`.

```javascript
const client = new StompJs.Client({
  brokerURL: 'ws://localhost:15674/ws',
  connectHeaders: {
    login: 'user',
    passcode: 'password',
  },
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

client.onConnect = function (frame) {
  // Do something; all subscriptions must be done in this callback.
  // This is needed because it runs after a (re)connect.
};

client.onStompError = function (frame) {
  // Invoked when the broker reports an error.
  // Bad login/passcode typically causes an error.
  // Compliant brokers set the `message` header with a brief message; the body may contain details.
  // Compliant brokers terminate the connection after any error.
  console.log('Broker reported error: ' + frame.headers['message']);
  console.log('Additional details: ' + frame.body);
};

client.activate();
```

To deactivate a client, call [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate). It stops reconnection attempts and disconnects any active connection.

```javascript
client.deactivate();
```

## Send messages

When the client is connected, it can send STOMP messages using the [Client#publish](/api-docs/latest/classes/Client.html#publish) method.

```javascript
client.publish({destination: '/topic/general', body: 'Hello world'});

// There is an option to skip the Content-length header
client.publish({
  destination: '/topic/general',
  body: 'Hello world',
  skipContentLengthHeader: true,
});

// Additional headers
client.publish({
  destination: '/topic/general',
  body: 'Hello world',
  headers: {priority: '9'},
});
```

Starting with v5, sending binary messages is supported. To send a binary body, use the `binaryBody` parameter. It must be a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

```javascript
const binaryData = generateBinaryData(); // This must be a Uint8Array
// Setting a content-type header is not mandatory, but is good practice
client.publish({
  destination: '/topic/special',
  binaryBody: binaryData,
  headers: {'content-type': 'application/octet-stream'},
});
```

## Subscribe and receive messages

The STOMP client must subscribe to a destination to receive messages.

Use [Client#subscribe](/api-docs/latest/classes/Client.html#subscribe). It takes two required arguments: `destination` (a string) and `callback` (a function that receives a message), plus an optional `headers` object for additional headers.

```javascript
const subscription = client.subscribe('/queue/test', callback);
```

The `subscribe` method returns an object with an `id` (the client subscription ID) and an `unsubscribe` method to stop receiving from this destination.

Each time the broker sends a message, the client invokes the callback with a [Message](/api-docs/latest/interfaces/IMessage.html) object.

```javascript
callback = function (message) {
  // Called when the client receives a STOMP message from the server
  if (message.body) {
    alert('Got message with body ' + message.body);
  } else {
    alert('Got empty message');
  }
};
```

You can pass optional headers when subscribing:

```javascript
const headers = {ack: 'client'};
client.subscribe('/queue/test', message_callback, headers);
```

Here, the client specifies that it will handle message acknowledgments.

To stop receiving messages, call [unsubscribe](/api-docs/latest/classes/StompSubscription.html#unsubscribe) on the object returned by [Client#subscribe](/api-docs/latest/classes/Client.html#subscribe).

```javascript
const subscription = client.subscribe('/queue/test', onmessage);

// ... use the subscription ...

subscription.unsubscribe();
```

## Binary messages

### Prepare your broker

Not every broker supports binary messages out of the box. For example, RabbitMQ (see: https://www.rabbitmq.com/web-stomp.html) requires the following server configuration:

```
web_stomp.ws_frame = binary
```

### Publishing binary messages

Use the `binaryBody` parameter of [Client#publish](/api-docs/latest/classes/Client.html#publish) to send binary data of type [Uint8Array].

See [Send messages](#send-messages) for an example.

### Receiving binary messages

The library does not infer whether incoming data is text or binary. Use [Message#body](/api-docs/latest/interfaces/IFrame.html#body) to access the body as a string, or [Message#binaryBody](/api-docs/latest/interfaces/IFrame.html#binaryBody) to access it as binary.

There is no generally accepted convention in STOMP (or messaging in general) to indicate binary messages. Producers and consumers should agree on a convention—for example, set a `content-type` header to indicate a binary payload.

```javascript
// within message callback
if (message.headers['content-type'] === 'application/octet-stream') {
  // message is binary
  // call message.binaryBody
} else {
  // message is text
  // call message.body
}
```

## JSON support

The body of a STOMP message must be a String or a [Uint8Array]. To send and receive [JSON](http://json.org/), use `JSON.stringify()` and `JSON.parse()` to convert between objects and strings.

```javascript
const quote = {symbol: 'AAPL', value: 195.46};
client.publish({
  destination: '/topic/stocks',
  body: JSON.stringify(quote),
});

client.subscribe('/topic/stocks', function (message) {
  const quote = JSON.parse(message.body);
  alert(quote.symbol + ' is at ' + quote.value);
});
```

## Acknowledgment

By default, the server automatically acknowledges STOMP messages before delivering them to the client.

Alternatively, the client can handle acknowledgments by subscribing with the `ack` header set to `client` or `client-individual`.

In that case, call [Message#ack](/api-docs/latest/interfaces/IMessage.html#ack) to inform the broker that the message has been processed.

```javascript
const subscription = client.subscribe(
  '/queue/test',
  function (message) {
    // do something with the message
    // ...
    // and acknowledge it
    message.ack();
  },
  {ack: 'client'}
);
```

[Message#ack](/api-docs/latest/interfaces/IMessage.html#ack) accepts an optional `headers` object. For example, to acknowledge within a transaction and request a receipt:

```javascript
const tx = client.begin();
message.ack({transaction: tx.id, receipt: 'my-receipt'});
tx.commit();
```

Use [Message#nack](/api-docs/latest/interfaces/IMessage.html#nack) with STOMP 1.1+ brokers to indicate that the client did not consume the message. It takes the same arguments as [Message#ack](/api-docs/latest/interfaces/IMessage.html#ack).

## Transactions

Messages can be sent and acknowledged within a transaction.

Start a transaction using [Client#begin](/api-docs/latest/classes/Client.html#begin), which takes an optional `transaction_id`.

This returns an object with an `id` (the transaction ID) and two methods:

- [Client#commit](/api-docs/latest/classes/Client.html#commit) to commit the transaction
- [Client#abort](/api-docs/latest/classes/Client.html#abort) to abort the transaction

You can then send and acknowledge messages in the transaction by specifying a `transaction` identified by that `id`.

```javascript
// start the transaction
const tx = client.begin();
// send the message in a transaction
client.publish({
  destination: '/queue/test',
  headers: {transaction: tx.id},
  body: 'message in a transaction',
});
// commit the transaction to effectively send the message
tx.commit();
```

_If you forget to add the `transaction` header when calling [Client#publish](/api-docs/latest/classes/Client.html#publish), the message will not be part of the transaction and will be sent immediately._

```javascript
// start the transaction
const tx = client.begin();
// oops! send the message outside the transaction
client.publish({
  destination: '/queue/test',
  body: 'message in a transaction',
});
tx.abort(); // Too late! the message has been sent
```

## Heart-beating

For STOMP 1.1 or higher, heart-beating is enabled by default. Options [Client#heartbeatIncoming](/api-docs/latest/classes/Client.html#heartbeatIncoming) and [Client#heartbeatOutgoing](/api-docs/latest/classes/Client.html#heartbeatOutgoing) control heart-beating (default 10,000 ms). Set either to 0 to disable.

```javascript
client.heartbeatOutgoing = 20000; // client will send heartbeats every 20000ms
client.heartbeatIncoming = 0; // client does not want to receive heartbeats from the server
```

## Auto Reconnect

The client supports automatic reconnection after a connection failure. It is controlled by the [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay) option. The default is 5000 ms, meaning the client will attempt to reconnect 5 seconds after a drop.

```javascript
// Add the following if you need automatic reconnect (delay is in milliseconds)
client.reconnectDelay = 300;
```

You can set `reconnectDelay` to a small value.

**Reconnect with Exponential Backoff**

```javascript
client.configure({
  reconnectTimeMode: StompJs.ReconnectionTimeMode.EXPONENTIAL,
  reconnectDelay: 200, // It will wait 200, 400, 800 ms...
  maxReconnectDelay: 10000, // Optional: when provided, it will not wait more than this
})
```

## Debug

On a busy system, the volume of logs can be overwhelming. Therefore, debug messages are ignored by default.

Set the [Client#debug](/api-docs/latest/classes/Client.html#debug) property to a function (receives a `String`) to enable debug logging:

```javascript
client.debug = function (str) {
  console.log(str);
};
```

Usually, headers of incoming and outgoing frames are logged. Set [Client#logRawCommunication](/api-docs/latest/classes/Client.html#logRawCommunication) to log complete frames.

## Callbacks

### Lifecycle callbacks

- [Client#beforeConnect](/api-docs/latest/classes/Client.html#beforeConnect) — invoked each time before connecting to the STOMP broker. You can modify connection parameters and other callbacks. On v6+, this callback may be async.
- [Client#onConnect](/api-docs/latest/classes/Client.html#onConnect) — invoked each time the broker connects and the STOMP handshake completes.
- [Client#onDisconnect](/api-docs/latest/classes/Client.html#onDisconnect) — invoked after each graceful disconnection. If the connection breaks due to an error or network failure, it is not called.
- [Client#onStompError](/api-docs/latest/classes/Client.html#onStompError) — invoked when the broker reports an error.
- [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose) — invoked when the WebSocket closes. This is the most reliable way to detect that the connection terminated.

### Frame callbacks

- [Client#onUnhandledMessage](/api-docs/latest/classes/Client.html#onUnhandledMessage) — typically, brokers send messages corresponding to subscriptions. However, some brokers support concepts beyond standard STOMP (for example, RabbitMQ temporary queues). This callback is invoked if a message is received that is not linked to a subscription.
- [Client#onUnhandledReceipt](/api-docs/latest/classes/Client.html#onUnhandledReceipt) — prefer [Client#watchForReceipt](/api-docs/latest/classes/Client.html#watchForReceipt). If a receipt arrives with no active watcher, this callback is invoked.
- [Client#onUnhandledFrame](/api-docs/latest/classes/Client.html#onUnhandledFrame) — invoked if the broker sends a non-standard STOMP frame.

## Advanced notes

Version 5+ of this library differs significantly from earlier versions.

You can change configuration options and callbacks at runtime. New values take effect as soon as possible. For example:

- Updated values of [Client#onUnhandledMessage](/api-docs/latest/classes/Client.html#onUnhandledMessage) or [Client#onDisconnect](/api-docs/latest/classes/Client.html#onDisconnect) are effective immediately.
- New values of [Client#heartbeatIncoming](/api-docs/latest/classes/Client.html#heartbeatIncoming) and [Client#heartbeatOutgoing](/api-docs/latest/classes/Client.html#heartbeatOutgoing) are used on the next STOMP connect.

Callback sequences are designed so that common operations work as expected. For example, you can call [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate) within [Client#onStompError](/api-docs/latest/classes/Client.html#onStompError) or [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose).

You can also adjust [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay) in [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose) to implement exponential backoff by progressively increasing the delay.

Even [Client#brokerURL](/api-docs/latest/classes/Client.html#brokerURL) and [Client#connectHeaders](/api-docs/latest/classes/Client.html#connectHeaders) can be altered; the new values will be used on the next reconnect.

[Polyfills]: {% link _posts/2018-06-28-polyfills-for-stompjs.md %}
[Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
