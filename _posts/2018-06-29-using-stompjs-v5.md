---
layout: single
title: 'Using StompJs v5+'
date: 2018-06-29 07:59:22 +0530
categories: guide stompjs
toc: true
redirect_from:
  - /guide/stompjs/2018/06/28/using-stompjs-v5.html
  - /guide/stompjs/2018/06/29/using-stompjs-v5.html
  - /guide/stompjs/2018/06/30/using-stompjs-v5.html
---

You can find samples at [https://github.com/stomp-js/samples/](https://github.com/stomp-js/samples/).

## The STOMP Broker

Ensure that your STOMP broker supports STOMP over WebSockets. While some messaging brokers support it out of the box, a few may need additional configuration or activating plugins.

## Include stompjs

This npm distribution has a UMD package and ES6 modules. The web browsers will use the UMD via a script tag, and Node's `require` and ES `import` will use the appropriate versions.

### Polyfills

_Important: For NodeJS and React Native, please check [Polyfills]._

### In Web Browser

- Download and include directly from the `bundles/` folder.
- Alternatively, use from CDN
  - Minified [https://cdn.jsdelivr.net/npm/@stomp/stompjs@5.0.0/bundles/stomp.umd.min.js](https://cdn.jsdelivr.net/npm/@stomp/stompjs@5.0.0/bundles/stomp.umd.min.js)
  - [https://cdn.jsdelivr.net/npm/@stomp/stompjs@5.0.0/bundles/stomp.umd.js](https://cdn.jsdelivr.net/npm/@stomp/stompjs@5.0.0/bundles/stomp.umd.js)
- `StompJs` object will now be available. Read along to learn how to use it.

### In NodeJS, TypeScript or ES6

These libraries have been developed using typescript, and the typings are included in the distribution.

You can import classes like the following:

```javascript
import { Client, Message } from '@stomp/stompjs';
```

You can use these classes without prefixing with `StompJs.`.

**There is no `StompJs` class/object to be imported.**

## Setting/getting options

All options can be set/get by directly operating on the client instance:

```javascript
const client = new StompJs.Client();
client.brokerURL = 'ws://localhost:15674/ws';

console.log(client.brokerURL);
```

These can also be set passing key/value pairs to [Client constructor](/api-docs/latest/classes/Client.html#constructor)
or to [Client#configure](/api-docs/latest/classes/Client.html#configure).

## Create a STOMP client

STOMP JavaScript clients will communicate to a STOMP server using a `ws://` or `wss://` URL.

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
  // Do something, all subscribes must be done is this callback
  // This is needed because this will be executed after a (re)connect
};

client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log('Broker reported error: ' + frame.headers['message']);
  console.log('Additional details: ' + frame.body);
};

client.activate();
```

To deactivate a client call [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate).
It will stop attempting to reconnect and disconnect if there is an active connection.

```javascript
client.deactivate();
```

## Send messages

When the client is connected to the server, it can send STOMP messages using the [Client#publish](/api-docs/latest/classes/Client.html#publish) method.

```javascript
client.publish({ destination: '/topic/general', body: 'Hello world' });

// There is an option to skip content length header
client.publish({
  destination: '/topic/general',
  body: 'Hello world',
  skipContentLengthHeader: true,
});

// Additional headers
client.publish({
  destination: '/topic/general',
  body: 'Hello world',
  headers: { priority: '9' },
});
```

Starting version 5, sending binary messages is supported.
To send a binary message body, use the `binaryBody` parameter. It should be a
[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

```javascript
const binaryData = generateBinaryData(); // This need to be of type Uint8Array
// setting content-type header is not mandatory, however a good practice
client.publish({
  destination: '/topic/special',
  binaryBody: binaryData,
  headers: { 'content-type': 'application/octet-stream' },
});
```

## Subscribe and receive messages

The STOMP client must first subscribe to a destination to receive messages.

To subscribe to a destination, you can use the [Client#subscribe](/api-docs/latest/classes/Client.html#subscribe) method. The method takes two mandatory arguments: `destination`, a String corresponding to the
destination and `callback`, a function with one message argument and an optional argument `headers`, a JavaScript object for additional headers.

```javascript
const subscription = client.subscribe('/queue/test', callback);
```

The `subscribe` method returns an object with one attribute, `id`,
that correspond to the client subscription ID and one method `unsubscribe`
that can be used later on to unsubscribe the client from this destination.

Every time the broker sends a message to the client, the client will, in turn, invoke the callback with a [Message](/api-docs/latest/interfaces/IMessage.html) object.

```javascript
callback = function (message) {
  // called when the client receives a STOMP message from the server
  if (message.body) {
    alert('got message with body ' + message.body);
  } else {
    alert('got empty message');
  }
};
```

The `subscribe` method takes an optional headers argument to specify additional `headers` when subscribing to a destination:

```javascript
const headers = { ack: 'client' };
client.subscribe('/queue/test', message_callback, headers);
```

The client specifies that it will handle the message acknowledgment.

To stop receiving messages, the client can use the
[unsubscribe](/api-docs/latest/classes/StompSubscription.html#unsubscribe) method on
the object returned by the [Client#subscribe](/api-docs/latest/classes/Client.html#subscribe) method.

```javascript
const subscription = client.subscribe('queue/test', onmessage);

// ... use the subscription ...

subscription.unsubscribe();
```

## Binary messages

### Prepare your broker

Not every broker will support binary messages out of the box.
For example, RabbitMQ (see: https://www.rabbitmq.com/web-stomp.html) will need the following to be added to the server configuration:

```
web_stomp.ws_frame = binary
```

### Publishing binary messages

Use parameter `binaryBody` of [Client#publish](/api-docs/latest/classes/Client.html#publish) to send binary data of a type [Uint8Array].

See [Send messages](#send-messages) for an example.

### Receiving binary messages

The library does not guess whether the incoming datum is text/binary.
To access the message body as a string, please use [Message#body](/api-docs/latest/interfaces/IFrame.html#body) and to access it as binary, please use [Message#binaryBody](/api-docs/latest/interfaces/IFrame.html#binaryBody).

There is no generally accepted convention in STOMP (actually messaging in general) to indicate binary messages. Therefore, the message senders and receivers must agree on the required convention. For example, you may choose to set a `content-type` header to indicate a binary message.

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

The body of a STOMP message must be a String or a [Uint8Array]. If you want to send and receive [JSON](http://json.org/) objects, you can use `JSON.stringify()` and`JSON.parse()` to transform the JSON object to a String and vice versa.

```javascript
const quote = { symbol: 'AAPL', value: 195.46 };
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

By default, the server will automatically acknowledge STOMP messages before the message is delivered to the client.

Instead, the client can choose to handle message acknowledgment by subscribing to a destination with the `ack` header set to `client` or `client-individual`.

In that case, the client must use the [Message#ack](/api-docs/latest/interfaces/IMessage.html#ack) method to inform the broker that it has processed the message.

```javascript
const subscription = client.subscribe(
  '/queue/test',
  function (message) {
    // do something with the message
    // ...
    // and acknowledge it
    message.ack();
  },
  { ack: 'client' }
);
```

The [Message#ack](/api-docs/latest/interfaces/IMessage.html#ack) method accepts `headers` argument for additional headers. For example, to acknowledge a message as part of a transaction and request a receipt:

```javascript
const tx = client.begin();
message.ack({ transaction: tx.id, receipt: 'my-receipt' });
tx.commit();
```

The client should [Message#nack](/api-docs/latest/interfaces/IMessage.html#nack) to inform STOMP 1.1 or higher brokers that the client did not consume the message. It takes the same arguments as the [Message#ack](/api-docs/latest/interfaces/IMessage.html#ack) method.

## Transactions

Messages can be sent and acknowledged _in a transaction_.

The client starts a transaction using the [Client#begin](/api-docs/latest/classes/Client.html#begin) method, which takes an optional `transaction_id`.

This method returns an object with an `id` attribute corresponding to the transaction ID and two methods:

- [Client#commit](/api-docs/latest/classes/Client.html#commit) to commit the transaction, and,
- [Client#abort](/api-docs/latest/classes/Client.html#abort) to abort the transaction.

The client can then send and acknowledge messages in the transaction by specifying a `transaction` indetified by the transaction `id`.

```javascript
// start the transaction
const tx = client.begin();
// send the message in a transaction
client.publish({
  destination: '/queue/test',
  headers: { transaction: tx.id },
  body: 'message in a transaction',
});
// commit the transaction to effectively send the message
tx.commit();
```

_If you forget to add the `transaction` header when calling [Client#publish](/api-docs/latest/classes/Client.html#publish), the message will not be part of the transaction, and it will be sent directly without waiting for the completion of the transaction._

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

For a connection with STOMP protocol 1.1 or higher, heart-beating is enabled by default. Options [Client#heartbeatIncoming](/api-docs/latest/classes/Client.html#heartbeatIncoming) and [Client#heartbeatOutgoing](/api-docs/latest/classes/Client.html#heartbeatOutgoing) can be used to control heart-beating (default value for both is 10,000ms). The client can disable heart beating by setting these to 0.

```javascript
client.heartbeatOutgoing = 20000; // client will send heartbeats every 20000ms
client.heartbeatIncoming = 0; // client does not want to receive heartbeats
// from the server
```

## Auto Reconnect

The `client` supports automatic reconnecting in case of a connection failure. It is controlled by a option [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay). The default value is 5000ms, which indicates that an attempt to connect will be made 5000ms after a connection drop.

```javascript
// Add the following if you need automatic reconnect (delay is in milliseconds)
client.reconnectDelay = 300;
```

You can set the `reconnectDelay` to quite a small value.

## Debug

On a busy system, the volume of logs can be overwhelming. Therefore, by default, the debug messages are ignored.

[Client#debug](/api-docs/latest/classes/Client.html#debug) property can be set to a function (which will receive a `String` argument) to enable debug statements:

```javascript
client.debug = function (str) {
  console.log(str);
};
```

Usually, headers of the incoming and outgoing frames are logged. Set [Client#logRawCommunication](/api-docs/latest/classes/Client.html#logRawCommunication) to log entire frames.

## Callbacks

### Lifecycle callbacks

- [Client#beforeConnect](/api-docs/latest/classes/Client.html#beforeConnect) - invoked each time before connection to STOMP broker is attempted. You can modify connection parameters and other callbacks. On v6+ you can set an async function for this callback.
- [Client#onConnect](/api-docs/latest/classes/Client.html#onConnect) - invoked for each time STOMP broker connects and STOMP handshake is complete.
- [Client#onDisconnect](/api-docs/latest/classes/Client.html#onDisconnect) - invoked after each graceful disconnection. If the connection breaks because of an error or network failure, it will not be called.
- [Client#onStompError](/api-docs/latest/classes/Client.html#onStompError) - invoked when the broker reports an Error.
- [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose) - when the WebSocket closes. It is the most reliable way of knowing that the connection has terminated.

### Frame callbacks

- [Client#onUnhandledMessage](/api-docs/latest/classes/Client.html#onUnhandledMessage) - typically brokers will send messages corresponding to subscriptions. However, brokers may support concepts beyond the standard definition of STOMP - for example, RabbitMQ supports concepts of temporary queues. This callback will be invoked if any message is received that is not linked to a subscription.
- [Client#onUnhandledReceipt](/api-docs/latest/classes/Client.html#onUnhandledReceipt) - you should prefer [Client#watchForReceipt](/api-docs/latest/classes/Client.html#watchForReceipt). If there is any incoming receipt for which there is no active watcher, this callback will be invoked.
- [Client#onUnhandledFrame](/api-docs/latest/classes/Client.html#onUnhandledFrame) - it will be invoked if broker sends a non standard STOMP Frame.

## Advanced notes

Version 5+ of this library has taken significant variation from the previous syntax.

It is possible to alter configuration options and callbacks. New values will take effect as soon as possible. For example:

- Altered values of [Client#onUnhandledMessage](/api-docs/latest/classes/Client.html#onUnhandledMessage) or [Client#onDisconnect](/api-docs/latest/classes/Client.html#onDisconnect) will be effective immediately.
- New values of [Client#heartbeatIncoming](/api-docs/latest/classes/Client.html#heartbeatIncoming) and [Client#heartbeatOutgoing](/api-docs/latest/classes/Client.html#heartbeatOutgoing) will be used next time STOMP connects.

The callback sequences are arranged in a way that most expected operations should work. For example, it is possible to call [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate) within [Client#onStompError](/api-docs/latest/classes/Client.html#onStompError) or [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose).

The above also allows adjusting [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay) in [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose). You can implement exponential back-off using a series of such adjustments.

Even [Client#brokerURL](/api-docs/latest/classes/Client.html#brokerURL) or [Client#connectHeaders](/api-docs/latest/classes/Client.html#connectHeaders) can be altered which would get used in a subsequent reconnect.

[Polyfills]: {% link _posts/2018-06-28-polyfills-for-stompjs.md %}
[Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
