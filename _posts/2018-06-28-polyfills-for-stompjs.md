---
layout: single
title: 'StompJs v5+, RxStomp: Polyfills'
date: 2018-06-29 07:59:22 +0530
categories: guide stompjs rx-stomp
toc: true
redirect_from:
- /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/28/pollyfils-for-stompjs-v5.html
- /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/29/pollyfils-for-stompjs-v5.html
- /guide/stompjs/rx-stomp/ng2-stompjs/2018/06/30/pollyfils-for-stompjs-v5.html
- /guide/stompjs/rx-stomp/ng2-stompjs/pollyfils-for-stompjs-v5.html
---

This guide covers critical dependencies and polyfills for version 5+ of `@stomp/stompjs`;
which is internally used by `@stomp/rx-stomp` as well.

## In NodeJS

### WebSocket

There are two alternate libraries `websocket` and `ws` which have been reported to work.

#### websocket

- Add `websocket` npm module:

  ```bash
  $ npm install websocket
  ```

- Using `import` syntax

  ```javascript
  import websocket from 'websocket';
  
  Object.assign(global, { WebSocket: websocket.w3cwebsocket });
  ```

#### ws

- Instead of `websocket` lib `ws` has also been reported to work.
  See: [stompjs/issues/28](https://github.com/stomp-js/stompjs/issues/28).
- Add `ws` npm module:

  ```bash
  $ npm install ws
  ```

- Require the module and expose it through `global`

  ```javascript
  import { WebSocket } from 'ws';
  
  Object.assign(global, { WebSocket });
  ```

## In React Native

### TextEncoder/TextDecoder

- React Native makes it deceptive.
  When an application is executed in debug mode, it works, as it is executed on an actual browser
  where TextEncoder/TextDecoder is available.
  However, when executed in production mode, it fails as TextEncoder/TextDecoder is not available.
- Please install `text-encoding`
  ```bash
  $ npm install text-encoding
  ```
- Add the following to your `index.js` or `App.js`:

  ```javascript
  import * as encoding from 'text-encoding';
  ```

- There are additional issues with React Native in some device/version combinations. Please see:
  [React Native - Additional Notes](/workaround/stompjs/rx-stomp/ng2-stompjs/react-native-additional-notes.html)
