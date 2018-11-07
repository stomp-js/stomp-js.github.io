---
layout: post
title:  "Migrating ng2-stompjs to v7"
date:   2018-11-05 23:02:56 +0530
categories: guide ng2-stompjs
---

## Upgrading from version 6

For upgrading from version 4, you will additionally need to make RxJS specific changes.



This version uses newer Javascript features. Few these can be pollyfilled in older
browsers.
However [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
is critically needed and not possible to be efficiently pollyfilled  (notably in IE9 or lower).
If you need to support any browser that does not have native support for Uint8Array
please continue using version 4 of this library.

### Basic changes

Please follow section [Include STOMP.js](usage.html#include-stomp-js) to add latest version
and to include necessary polyfills.

The following is for convenience - to keep the code change to the minimum.

```javascript
    // Depending on your JS version you may have to use var instead of const 
     
    // To use compatibility mode
    const Stomp = StompJs.Stomp;
```

### For the lazy: use the compatibility mode


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

## Summary of renames and replacements

- Classes (all have semantic changes as well):
    - [StompRService] --> [RxStompService]
    - [StompService] --> [RxStompService] and [rxStompServiceFactory]
    - [StompConfig] --> [InjectableRxStompConfig]
    - [StompState] --> [RxStompState]
- Members of [StompRService] and [StompService]:
    - `state` --> `connectionState$` - semantic change as well
    - `serverHeadersObservable` --> `serverHeaders$`
    - `defaultMessagesObservable` --> `unhandledMessage$`
    - `receiptsObservable` --> `unhandledReceipts$`
    - `errorSubject` --> `stompErrors$`
    - `client` --> `_stompClient` - to indicate that be careful when using it directly
    - `waitForReceipt` --> `watchForReceipt`
    - `initAndConnect` --> `activate`
    - `disconnect` --> `deactivate`
    - `errorSubject` --> `stompError$` - slight semantic change as well
    - `subscribe` --> `watch`
    - `publish` --> `publish` - parameters are now hash
- Members of [StompConfig]
    - `url` --> `brokerURL` - when value is a URL string
    - `url` --> `webSocketFactory` - when value is a function
    - `heartbeat`_`in` --> `heartbeatIncoming`
    - `heartbeat`_`out` --> `heartbeatOutgoing`
    - `reconnect`_`delay` --> `reconnectDelay`
    - `headers` --> `connectHeaders`
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
