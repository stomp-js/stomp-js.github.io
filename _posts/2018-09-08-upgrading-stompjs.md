---
layout: single
title:  "Upgrading StompJs"
date:   2018-09-08 17:04:43 +0530
categories: guide stompjs
toc: true
redirect_from:
    - /guide/stompjs/2018/09/07/upgrading-stompjs.html
    - /guide/stompjs/2018/09/08/upgrading-stompjs.html
    - /guide/stompjs/2018/09/09/upgrading-stompjs.html
---

## Upgrading from version 3/4

*Important: before upgrading please check [Polyfills & Critical Dependencies].*

### Basic changes

Please follow section [Include STOMP.js]({% link _posts/2018-06-29-using-stompjs-v5.md %}#include-stompjs)
to add latest version.

The following is for convenience - to keep the code change to the minimum.

```javascript
    // Depending on your JS version you may have to use var instead of const 
     
    // To use compatibility mode
    const Stomp = StompJs.Stomp;
```

### For the lazy: use the compatibility mode

With the changes above, your code should now work. If you face issues please
raise an issue at https://github.com/stomp-js/stompjs/issues

*Note: no new features will be added to the compatibility mode.
Attempt would be made so that code working in version 3/4 continue
to work. The compatibility mode will be maintained for a year.*


### Take control: proper upgrade

This section covers rationale of new features and 
changes needed to take full advantage.

#### Creating a client and connecting

In version 3/4 typically a client instance is created and one of the
variants of connect is called.
Over the years connect has gotten many variants with different
combination of parameters.

The new version makes all options settable on client instance.
These options can be passed during creation of a client or while
calling [client.activate](/api-docs/latest/classes/Client.html#activate).

**Old**

```javascript
    const client = Stomp.client("ws://localhost:15674/ws");
    
    client.debug =  function (str) {
      console.log(str);
    };
    
    client.heartbeat.incoming = 4000;
    client.heartbeat.outgoing = 4000;
    
    client.reconnect_delay = 5000;
    
    client.connect("user", "password",
      function () {
        // Do something
      });
```

**Updated**

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
    
    client.onConnect = function(frame) {
    // Do something
    };
    
    client.activate();
```

Please see [StompConfig](/api-docs/latest/classes/StompConfig.html) for all possible options.
These options can be set onto [client](/api-docs/latest/classes/Client.html).
Alternatively these can be passed
as options to the [Client constructor](/api-docs/latest/classes/Client.html#constructor) constructor,
the [Client#activate](/api-docs/latest/classes/Client.html#activate)
or the [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate) calls.
If you want to set options in bulk you can use [Client#configure](/api-docs/latest/classes/Client.html#configure).

#### Publishing messages

**Old**

```javascript
    client.send('/topic/general', {}, 'Hello world');

    // Skip content length header
    client.send('/topic/general', {'content-length': false}, 'Hello world');
 
    // Additional headers
    client.send('/topic/general', {'priority': '9'}, 'Hello world');
```

**Updated**

```javascript
    client.publish({destination: '/topic/general', body: 'Hello world'});

    // There is an option to skip content length header
    client.publish({destination: '/topic/general', body: 'Hello world', skipContentLengthHeader: true});
    
    // Additional headers
    client.publish({destination: '/topic/general', body: 'Hello world', headers: {'priority': '9'}});
```

#### Semantic changes

- [Stomp.client](/api-docs/latest/classes/Stomp.html#client) --> [Client constructor](/api-docs/latest/classes/Client.html#constructor)
  and [Client#brokerURL](/api-docs/latest/classes/Client.html#brokerURL)
- [Stomp.over](/api-docs/latest/classes/Stomp.html#over) --> [Client constructor](/api-docs/latest/classes/Client.html#constructor)
  and [Client#webSocketFactory](/api-docs/latest/classes/Client.html#webSocketFactory)
- [connect](/api-docs/latest/classes/CompatClient.html#connect) --> [Client#activate](/api-docs/latest/classes/Client.html#activate)
    - login, passcode, host --> [Client#connectHeaders](/api-docs/latest/classes/Client.html#connectHeaders)
    - connectCallback --> [Client#onConnect](/api-docs/latest/classes/Client.html#onConnect) 
    - errorCallback --> [Client#onStompError](/api-docs/latest/classes/Client.html#onStompError)
    - closeEventCallback --> [Client#onWebSocketClose](/api-docs/latest/classes/Client.html#onWebSocketClose) 
- [disconnect](/api-docs/latest/classes/CompatClient.html#disconnect) --> [Client#deactivate](/api-docs/latest/classes/Client.html#deactivate)
    - disconnectCallback --> [Client#onDisconnect](/api-docs/latest/classes/Client.html#onDisconnect)
- [send](/api-docs/latest/classes/CompatClient.html#send) --> [Client#publish](/api-docs/latest/classes/Client.html#publish)

#### Name changes

These changes have been carried out in order to make a consistent naming convention (lowerCamelCase)
and to make meaning of the option clearer.

- [reconnect_delay](/api-docs/latest/classes/CompatClient.html#reconnect_delay) --> [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay)
- [ws](/api-docs/latest/classes/CompatClient.html#ws) --> [Client#webSocket](/api-docs/latest/classes/Client.html#webSocket)
- [version](/api-docs/latest/classes/CompatClient.html#version) --> [Client#connectedVersion](/api-docs/latest/classes/Client.html#connectedVersion)
- [onreceive](/api-docs/latest/classes/CompatClient.html#onreceive) --> [Client#onUnhandledMessage](/api-docs/latest/classes/Client.html#onUnhandledMessage)
- [onreceipt](/api-docs/latest/classes/CompatClient.html#onreceipt) --> [Client#onUnhandledReceipt](/api-docs/latest/classes/Client.html#onUnhandledReceipt)
- [heartbeat](/api-docs/latest/classes/CompatClient.html#heartbeat).incoming --> [Client#heartbeatIncoming](/api-docs/latest/classes/Client.html#heartbeatIncoming)
- [heartbeat](/api-docs/latest/classes/CompatClient.html#heartbeat).outgoing --> [Client#heartbeatOutgoing](/api-docs/latest/classes/Client.html#heartbeatOutgoing)

#### Dropped APIs

- [maxWebSocketFrameSize](/api-docs/latest/classes/CompatClient.html#maxWebSocketFrameSize) -  large messages
  work without this. Test cases have been added to test large text and binary messages.

## Migrating from Version 2

You will need to follow the instructions above with few additional considerations.

Please note:

* Auto reconnect is switched on by default.
  Set [Client#reconnectDelay](/api-docs/latest/classes/Client.html#reconnectDelay) to `0` to disable.
* After each connect (i.e., initial connect as well each reconnection) the 
  [Client#onConnect](/api-docs/latest/classes/Client.html#onConnect) (connectCallback in earlier versions)
  will be called.
* After reconnecting, it will not automatically subscribe to queues that were subscribed.
  So, if all subscriptions are part of the 
  [Client#onConnect](/api-docs/latest/classes/Client.html#onConnect) (which it would in most of the cases),
  you will not need to do any additional handling.

Additional notes:

- `Stomp.overWS` is same as `Stomp.client`. Follow the instructions for `Stomp.client` above.
- `NodeJS` is supported at same level as browser. Test suits are executed for both NodJS and browser.
  Follow the instructions as above.
- `Stomp.overTCP` is no longer supported. If your brokers supports WebStomp (STOMP over WebSocket),
  you may switch to that.
- If you are using `SockJS` please also see [SockJS support]
  
[SockJS support]: {% link _posts/2018-09-10-using-stomp-with-sockjs.md %}
[Polyfills & Critical Dependencies]: {% link _posts/2018-06-28-pollyfils-for-stompjs-v5.md %}
