---
layout: single
title: 'StompJs v5+, RxStomp: Polyfills'
date: 2025-09-16 09:59:22 +0530
categories: guide stompjs rx-stomp
toc: true
redirect_from:
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/28/pollyfils-for-stompjs-v5.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/29/pollyfils-for-stompjs-v5.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/30/pollyfils-for-stompjs-v5.html
  - /guide/stompjs/rx-stomp/ng2-stompjs/pollyfils-for-stompjs-v5.html
---

This guide covers critical dependencies and polyfills for version 5+ of `@stomp/stompjs`,
which is internally used by `@stomp/rx-stomp` as well.

Use polyfills only when the runtime does not provide the required APIs.

- Browsers: no WebSocket polyfill is usually needed (use native WebSocket).
- Node.js: add a WebSocket implementation (see below).
- React Native: add TextEncoder/TextDecoder; WebSocket is provided by RN.

## In Node.js

### WebSocket

Two alternative libraries have been reported to work well: `ws` and `websocket`.

#### Using `ws` (recommended)

- Install:

  ```bash
  npm install ws
  ```

- ESM import and expose as global:

  ```javascript
  import WebSocket from 'ws';
  // Make it available where @stomp/stompjs expects a global WebSocket
  globalThis.WebSocket = WebSocket;
  ```

- TypeScript tip: install types if your setup needs them (ws bundles its own types in modern versions).

#### Using `websocket`

- Install:

  ```bash
  npm install websocket
  ```

- ESM import and expose as global:

  ```javascript
  import { w3cwebsocket as W3CWebSocket } from 'websocket';
  globalThis.WebSocket = W3CWebSocket;
  ```

### TextEncoder/TextDecoder (Node.js)

Modern Node.js provides `TextEncoder`/`TextDecoder`. If your runtime does not, you can polyfill:

```javascript
// Option A: from 'util' (available on many Node versions)
import { TextEncoder, TextDecoder } from 'util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Option B: use a dedicated polyfill package
// npm install fast-text-encoding
import 'fast-text-encoding';
// This package attaches TextEncoder/TextDecoder to the global scope
```

## In React Native

React Native provides a WebSocket implementation; you usually do not need to polyfill it.

### TextEncoder/TextDecoder

- In debug mode, the app runs in a browser-like environment where these APIs exist.
  In release builds, they may be missing.
- Install a polyfill:

  ```bash
  npm install text-encoding
  ```

- Add to your entry file (e.g., `index.js` or `App.js`):

  ```javascript
  import * as encoding from 'text-encoding';
  ```

- There are additional issues with React Native in some device/version combinations. Please see:
  [React Native - Additional Notes]({% link _posts/2019-06-10-react-native-additional-notes.md %})

## Quick verification (any environment)

After setting up required polyfills, a minimal connectivity check should work:

```javascript
import { Client } from '@stomp/stompjs';

const client = new Client({ brokerURL: 'ws://localhost:15674/ws' });
client.onConnect = () => {
  console.log('Connected!');
  client.deactivate();
};
client.onStompError = (f) => console.error('Broker error:', f.headers['message']);
client.onWebSocketError = (e) => console.error('WS error:', e);
client.activate();
```
