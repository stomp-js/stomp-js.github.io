---
layout: single
title: 'Upgrading to stompjs@6, rx-stomp@1, ng2-stompjs@8'
date: 2020-10-21 22:21:09 +0530
categories: guide stompjs rx-stomp
toc: true
---

These releases are synchronized releases and add similar changes.
It is expected that these releases are fully backwards compatible,
however, you may need to recompile your code.

## User visible changes

### discardWebsocketOnCommFailure

Websocket specification does not provide any mechanism for quickly
dropping a connection.
If the underlying connection is dropped and the incoming pings fail,
actual closure of the Websocket may take significant time (several minutes).
This new option discards the websocket immediately.
This will allow a quicker reconnection.

Under the hood if the Websocket library supports `terminate` method
(which `ws` npm package does), it will call that to quickly drop
the connection.
None of the Web browsers support any equivalent method.

In this release this flag is `off` by default, set it to `true`
to activate it.

```typescript
// Set it directly or part of configuration
client.discardWebsocketOnCommFailure = true;
```

### connectionTimeout

The STOMP standard supports Heartbeats which allows detecting stale connections.
However, this mechanism activates after a successful connection (under the hood,
after `CONNECTED` STOMP frame has been received from the broker).

This setting guards against the case that connection setup takes long time to
establish. If it takes longer it will abandon the attempt and retry.

The value is number of milliseconds to wait for a successful connection.

```typescript
// Set it directly or part of configuration
client.connectionTimeout = 500;
```

### deactivate - async

You are unlikely to be affected by this change.
`deactivate` has now been made `async`, if there is an underlying
active connection, the call will wait till that is terminated.
This prevetents a race condition that may cause more that one
active underlying connection in case `deativate` and `activate` were
invoked in quick succession.

If you were calling `deativate` and `activate` in succession,
you should await for `deativate`.

## Non visible changes

- The output target is `es2015`. We wanted `es2017`, however,
  that causes issue with Angular.
- The tree shaking support is quite consistent now.
  In previous version `rx-stomp` used `commonjs` module system,
  which, was not very friendly to tree shaking.
- Remove dom lib dependency for usage with NodeJS/Typescript.
