---
layout: post
title:  "Migrating ng2-stompjs to v7"
date:   2018-11-05 23:02:56 +0530
categories: guide ng2-stompjs
---

Work in Progress

## Rationale of changes

These libraries have been maintained under stomp-js for past few years.
After analyzing the issues that were raised and going through the usage pattern
all these libraries have been almost entirely rewritten.

Major reasons for changes in this library are following:

- `@stomp/rx-stomp` has been factored out. 
  This allows using RxJS goodies even when Angular is not used.
- `@stomp/ng2-stompjs` is a very thin wrapper (it just makes key classes Injectable).
- All the member names are lowerCamelCase now.
- All Observables have been renamed to be suffixed by `$`.
- The configuration is getting closely aligned to `@stomp/stompjs`.
- Values for connection state now aligns to [WebSocket States][web-socket-states].
- Exposing newer features like binary messages and updating configuration before connect.

## Upgrading from version 6

*For upgrading from version 4, you will additionally need to make RxJS specific changes.
These are Angular specific, not covered in this guide.*

### Polyfills

Please see [Polyfills & Critical Dependencies] for the underlying `@stomp/stompjs` library.

### Basic changes

Install the v7 of `@stomp/ng2-stompjs`

```bash
$ npm i @stomp/ng2-stompjs@^7.0.0-beta.3
```

### For the lazy: use the compatibility mode

You application should now use compatibility mode and should work as before.
If you need to access any of the newer features of the underlying library -
like binary messages,
better support for deactivate (disconnect),
ability to update configuration before connect etc. you would need to carry out a full upgrade.

In addition the compatibility mode for v6 will be dropped in v8.

## Full Upgrade

### Inject new service



## Summary of renames and replacements

- Classes (all have semantic changes as well):
    - [StompConfig] --> [InjectableRxStompConfig]
    - [StompRService] --> [RxStompService]
    - [StompService] --> [RxStompService] and [rxStompServiceFactory]
    - [StompState] --> [RxStompState]
- Members of [StompRService] and [StompService]:
    - `client` --> `_stompClient` - to indicate that be careful when using it directly
    - `defaultMessagesObservable` --> `unhandledMessage$`
    - `disconnect` --> `deactivate`
    - `errorSubject` --> `stompError$` - slight semantic change as well
    - `initAndConnect` --> `activate`
    - `publish` --> `publish` - parameters are now hash
    - `receiptsObservable` --> `unhandledReceipts$`
    - `serverHeadersObservable` --> `serverHeaders$`
    - `state` --> `connectionState$` - semantic change as well
    - `subscribe` --> `watch`
    - `waitForReceipt` --> `watchForReceipt`
- Members of [StompConfig]
    - `headers` --> `connectHeaders`
    - `heartbeat_in` --> `heartbeatIncoming`
    - `heartbeat_out` --> `heartbeatOutgoing`
    - `reconnect_delay` --> `reconnectDelay`
    - `url` --> `brokerURL` - when value is a URL string
    - `url` --> `webSocketFactory` - when value is a function
- Values in [StompState]
    - `TRYING` --> `CONNECTING`
    - `CONNECTED` --> `OPEN`
    - `DISCONNECTING` --> `CLOSING`
    - `CLOSED` --> `CLOSED`

## Semantic changes

[StompConfig#debug]

[StompRService#errorSubject]

## References

- [RxStomp] - [RxStompService] is an Injectable version
- [RxStompConfig] - [InjectableRxStompConfig] is an Injectable version
- [/guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html] -
  a guide on using `@stomp/ng2-stompjs` v7.  


[StompRService]: /api-docs/injectables/StompRService.html
[StompService]: /api-docs/injectables/StompService.html
[RxStompService]: /api-docs/injectables/RxStompService.html
[rxStompServiceFactory]: /api-docs/miscellaneous/functions.html#rxStompServiceFactory
[StompConfig]: /api-docs/injectables/StompConfig.html
[InjectableRxStompConfig]: /api-docs/injectables/InjectableRxStompConfig.html
[StompState]: /api-docs/miscellaneous/enumerations.html#StompState
[RxStompState]: /api-docs/miscellaneous/enumerations.html#RxStompState
[web-socket-states]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
[RxStomp]: /api-docs/classes/RxStomp.html
[RxStompConfig]: /api-docs/classes/RxStompConfig.html
[/guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html]: /guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html
[Polyfills & Critical Dependencies]: {% link _posts/2018-06-28-pollyfils-for-stompjs-v5.md %}
