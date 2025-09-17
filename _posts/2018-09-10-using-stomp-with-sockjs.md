---
layout: single
title: 'Using STOMP with SockJS'
date: 2018-09-10 12:06:34 +0530
categories: guide stompjs rx-stomp
toc: true
redirect_from:
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/09/09/using-stomp-with-sockjs.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/09/10/using-stomp-with-sockjs.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/09/11/using-stomp-with-sockjs.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/using-stomp-with-sockjs.html
---

**There are a large number of obsolete (and copied from one another)
examples for these libraries that use SockJS.
In reality, there is very little chance that you need SockJS.
Unless you know for sure, you do not need SockJS.**

This guide covers how to use [SockJS client] instead of WebSockets as the underlying transport.

**For Spring STOMP users:**
_Some tutorials/guides implicitly suggest that you need SockJS to use STOMP.
That is incorrect — you only need SockJS if you need to support ancient browsers._

## Do you need SockJS?

WebSocket support in modern browsers is ubiquitous.
Please check [https://caniuse.com/#feat=websockets](https://caniuse.com/#feat=websockets).
Depending on your user base, you can skip this page.

You can use [SockJS client] to support browsers that do not support WebSockets natively.

You should consider the following:

- URL protocol conventions are different for WebSockets (`ws:`/`wss:`) and SockJS (`http:`/`https:`).
- Handshake sequences differ — some brokers expose different endpoints for both protocols.
- Neither protocol allows custom headers during the initial HTTP handshake.
- SockJS uses multiple transport mechanisms; you may face limitations depending on the transport in use.
- Auto-reconnect may be less reliable with SockJS.
- Heartbeats may not be supported over SockJS by some brokers.
- SockJS typically does not allow more than one simultaneous connection to the same broker.
  This is usually not a problem for most applications.

Prefer native WebSockets by default and fall back to SockJS only if the browser lacks WebSocket support or your deployment requires HTTP-only transport.

## Basic installation

### In Node.js environments

Please install the latest [SockJS client]:

```bash
$ npm install sockjs-client --save
```

### Import SockJS class

Depending on your programming language/environment, you may have to `import` or `require` it:

```typescript
// ESM
import SockJS from 'sockjs-client';
// or (older TypeScript configs)
// import * as SockJS from 'sockjs-client';
```

### In the browser

Add the following to include directly in the browser:

```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
```

## Implement a webSocketFactory

Create a function that returns an object similar to WebSocket (typically a SockJS instance).

```typescript
import SockJS from 'sockjs-client';

export function mySocketFactory() {
  return new SockJS('http://127.0.0.1:15674/stomp');
}
```

This function should return a WebSocket-compatible object.

**Note: this function may be invoked multiple times.
Each time a broker (re)connects, it needs a new instance of WebSocket/SockJS.**

## Usage

You should set [webSocketFactory] instead of [brokerURL] in your configuration.

You can also detect WebSocket availability and use SockJS as a fallback.
See the example below.

**Note: if you set both, [webSocketFactory] takes precedence.**

## Example with stompjs

```javascript
// ESM usage recommended
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: 'ws://localhost:15674/ws', // Native WebSocket URL (if available)
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

// Fallback code
if (typeof WebSocket !== 'function') {
  // For SockJS, set a factory that creates a new SockJS instance
  // to be used for each (re)connect
  client.webSocketFactory = function () {
    // Note that the URL is different from the WebSocket URL
    return new SockJS('http://localhost:15674/stomp');
  };
}

client.onConnect = function (frame) {
  // Do something; all subscribes must be done in this callback
  // This is needed because it executes after a (re)connect
  };

client.onStompError = function (frame) {
  // Invoked in case of an error reported by the broker
  // Bad login/passcode typically causes an error
  // Compliant brokers set the `message` header with a brief message; the body may contain details.
  // Compliant brokers terminate the connection after any error
  console.log('Broker reported error: ' + frame.headers['message']);
  console.log('Additional details: ' + frame.body);
};

client.activate();
```

Compare the above against the sample in [using StompJS]({% link _posts/2018-06-29-using-stompjs-v5.md %}),
the only addition is the fallback code to use SockJS if WebSocket is unavailable.
You will need to include the latest [SockJS client] in your web page when using the UMD build.

### Always using SockJS (when your server exposes only HTTP endpoints)

If your server provides only the SockJS endpoint (no native WebSocket), configure the factory unconditionally:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('https://example.com/stomp'),
  connectHeaders: { login: 'user', passcode: 'password' },
  reconnectDelay: 5000,
});

client.activate();
```

## SockJS in Angular (Angular 6+)

See: [ng2-stompjs/issues/70].

When you are using SockJS in an Angular project you might get **"global is not defined"**.

The underlying issue can only be fixed by SockJS or Angular teams.
Try any of the following workarounds (from [ng2-stompjs/issues/70]):

- In your index.html file, in the header add the following:

```html
<script type="application/javascript">
  var global = window;
</script>
```

- Add the following to your `polyfills.ts`:

```typescript
(window as any).global = window;
```

[sockjs client]: https://github.com/sockjs/sockjs-client
[stompconfig]: /api-docs/latest/classes/StompConfig.html
[injectablerxstompconfig]: /api-docs/latest/injectables/InjectableRxStompConfig.html
[websocketfactory]: /api-docs/latest/classes/Client.html#webSocketFactory
[brokerurl]: /api-docs/latest/classes/Client.html#brokerURL
[stomp client]: /api-docs/latest/classes/Client.html
[ng2-stompjs/issues/70]: https://github.com/stomp-js/ng2-stompjs/issues/70
