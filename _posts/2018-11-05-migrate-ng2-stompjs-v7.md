---
layout: post
title:  "Migrating ng2-stompjs to v7"
date:   2018-11-05 23:02:56 +0530
categories: guide ng2-stompjs
---

**Important: See 
[https://github.com/stomp-js/ng2-stompjs/issues/103#issuecomment-436117924](https://github.com/stomp-js/ng2-stompjs/issues/103#issuecomment-436117924)**

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

*Note: at every state you may need to import classes from `@stomp/ng2-stompjs`
and keep removing imports that are no longer needed.
These are not explicitly mentioned.*

### Updating configuration

Change

```typescript
const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://127.0.0.1:15674/ws',

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};
```

to

```typescript
const myRxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:15674/ws',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnectDelay: 5000,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (str) => {
    console.log(new Date(), str);
  }
};
```

Please note that `debug` is a function now.

### Dependency Injection

#### Changing StompService

Change

```typescript
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
```

to

```typescript
  providers: [
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
```

In this version there is only one class [RxStompService] that replaces both
[StompRService] and [StompService].

[rxStompServiceFactory] needs to be imported from `@stomp/ng2-stompjs`.
For the curious the code for this function is:

```typescript
export function rxStompServiceFactory(rxStompConfig: InjectableRxStompConfig): RxStompService {
  const rxStompService = new RxStompService();

  rxStompService.configure(rxStompConfig);
  rxStompService.activate();

  return rxStompService;
}
```

#### Changing StompRService

You will need to replace [StompRService] with [RxStompService].

```typescript
  providers: [
    StompRService,
    ... 
  ]
```

to 
```typescript
  providers: [
    RxStompService,
    ... 
  ]
```

In addition some where in your code you would be setting configuration and calling `initAndConnect`.
Change these:

```typescript
    stompService.config = config;
    stompService.initAndConnect();
```

to

```typescript
    stompService.configure(config);
    stompService.activate();
```

#### Injecting new service

In `Components` and other `Classes` wherever [StompRService] and [StompService]
has been injecting as dependency, please change classname to [RxStompService]
to receive the newly configured service.

### Changes in usage

- Replace [StompState] to [RxStompState]. Notice that state names have changed.
See the mapping later in this guide. [RxStompState] needs to be imported from `@stomp/rx-stomp`.

```typescript
import {RxStompState} from '@stomp/rx-stomp';
```

- Make changes to function and property names as per 
[Summary of renames and replacements](#summary-of-renames-and-replacements) below.

- `publish` method now aligns to the same function in `@stomp/stompjs`
[Client#publish](/api-docs/classes/Client.html#publish).
Please make changes as per examples below:

```typescript
    stompClient.publish({destination: "/queue/test", headers: {priority: 9}, body: "Hello, STOMP"});
    
    // Only destination is mandatory parameter
    stompClient.publish({destination: "/queue/test", body: "Hello, STOMP"});
    
    // Skip content-length header in the frame to the broker
    stompClient.publish({"/queue/test", body: "Hello, STOMP", skipContentLengthHeader: true});
    
    var binaryData = generateBinaryData(); // This need to be of type Uint8Array
    // setting content-type header is not mandatory, however a good practice
    stompClient.publish({destination: '/topic/special', binaryBody: binaryData,
                     headers: {'content-type': 'application/octet-stream'}});
```

### Test

Please check for compilation or other errors.
If the above instructions do not resolve the issue, please raise a ticket.

## Summary of renames and replacements

- Classes (all have semantic changes as well):
    - [StompConfig] --> [InjectableRxStompConfig]
    - [StompRService] --> [RxStompService]
    - [StompService] --> [RxStompService] and [rxStompServiceFactory]
    - [StompState] --> [RxStompState] - to be imported from `@stomp/rx-stomp`
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

## References

- [RxStomp] - [RxStompService] is an Injectable version
- [RxStompConfig] - [InjectableRxStompConfig] is an Injectable version
- [ng2-stompjs with Angular7] -
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
[ng2-stompjs with Angular7]: {% link _posts/2018-11-04-ng2-stomp-with-angular7.md %}
[Polyfills & Critical Dependencies]: {% link _posts/2018-06-28-pollyfils-for-stompjs-v5.md %}
