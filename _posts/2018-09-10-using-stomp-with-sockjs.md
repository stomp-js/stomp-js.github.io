---
layout: post
title:  "Using STOMP with SockJS"
date:   2018-09-10 12:06:34 +0530
categories: guide stompjs rx-stomp ng2-stompjs
---

This guide covers how to use [SockJS client] instead of WebSockets as underlying transport.

**For Spring STOMP users:**
*There are few tutorials/guides that implicitly suggest that you need SockJS to use STOMP.
That is incorrect, you only need SockJS if you need to support old browsers.*

## Do you need SockJS?

As of 2018, WebSocket support in browsers is nearly ubiquitous.
Please check [https://caniuse.com/#feat=websockets](https://caniuse.com/#feat=websockets).
Depending on your user base you can skip this page.

You can use [SockJS client]
to support browsers that do not natively support WebSockets.

You would need to consider the following:

- URL protocol conventions are different for WebSockets (`ws:`/`wss:`) and SockJS (`http:` or `https:`).
- Internal handshake sequences are different - so, some brokers will use different end points for
  both protocols.
- Neither of these allow custom headers to be set during the HTTP handshake.
- SockJS internally supports different transport mechanisms. You might face specific limitations
  depending on actual transport in use.
- Auto reconnect is not quite reliable with SockJS.
- Heartbeats may not be supported over SockJS by some brokers.
- SockJS does not allow more than simultaneous connection to the same broker.
  This usually is not a problem for most of the applications.

It is advised to use WebSockets by default and then fall back to SockJS if the browser does not support.

## Basic installation

### In Node.js environments

Please install latest [SockJS client]:

```bash
$ npm install sockjs-client --save
```

### Import SockJS class

Depending on your programming language/environment, you may have to `import` or `require` it:

```typescript
import * as SockJS from 'sockjs-client';
```

### In the browser

Add the following to include directly in the browser:

```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
```

## Implement a webSocketFactory

Create a function that returns an object similar to WebSocket (typically SockJS instance).

```typescript
export function mySocketFactory() {
  return new SockJS('http://127.0.0.1:15674/stomp');
}
```

This function should return a WebSocket compatible object.

**Note: this function may be invoked multiple times.
Each time a broker (re)connects, it needs a new instance of WebSocket.**

## Usage

You should set [webSocketFactory] instead of [brokerURL] in your configuration.

You can even check if WebSocket is available and accordingly use SockJS as a fallback.
See the example below.

**Note: if you set both [webSocketFactory] takes precedence.**

## Example with stompjs

```javascript
    const client = new StompJs.Client({
      brokerURL: "ws://localhost:15674/ws",
      connectHeaders: {
        login: "user",
        passcode: "password"
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });
    
    // Fallback code
    if (typeof WebSocket !== 'function') {
      // For SockJS you need to set a factory that creates a new SockJS instance
      // to be used for each (re)connect
      client.webSocketFactory = function () {
        // Note that the URL is different from the WebSocket URL 
        return new SockJS("http://localhost:15674/stomp");
      };
    }

    client.onConnect = function(frame) {
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

Compare the above against the sample in [using StompJS]({{% link _posts/2018-06-29-using-stompjs.md %}}),
only addition is the fallback code trying to use SockJS if WebSocket is unavailable.
You will need to include latest [SockJS client] in your web page.



[SockJS client]: https://github.com/sockjs/sockjs-client
[StompConfig]: /api-docs/injectables/StompConfig.html
[InjectableRxStompConfig]: /api-docs/injectables/InjectableRxStompConfig.html
[webSocketFactory]: /api-docs/classes/Client.html#webSocketFactory
[brokerURL]: /api-docs/classes/Client.html#brokerURL
[Stomp Client]: /api-docs/classes/Client.html
