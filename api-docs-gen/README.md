# Navigating through the API docs

The API docs cover three libraries:

- @stomp/stompjs
- @stomp/rx-stomp - builds over @stomp/stompjs
- @stomp/ng2-stompjs - thin wrapper over @stomp/rx-stomp

The documentation for classes indicate which library each of the classes
belong. See the [guides](/) for more information.

## stompjs

Preferred entry point is [Client](./classes/Client.html).
If you are using compatibility mode your entry point would be
[Stomp](./classes/Stomp.html).

## rx-stomp

Your entry point would be [RxStomp](./classes/RxStomp.html).
For RPC [RxStompRPC](./classes/RxStompRPC.html).

## ng2-stompjs

Injectable versions of `rx-stomp` classes:

- [RxStompService](./injectables/RxStompService.html) for [RxStomp](./classes/RxStomp.html)
- [InjectableRxStompConfig](./injectables/InjectableRxStompConfig.html) for [RxStompConfig](./classes/RxStompConfig.html)
- [RxStompRPCService](./injectables/RxStompRPCService.html) for [RxStompRPC](./classes/RxStompRPC.html)
- [InjectableRxStompRPCConfig](./injectables/InjectableRxStompRPCConfig.html) for [RxStompRPCConfig](./classes/RxStompRPCConfig.html)
- [rxStompServiceFactory](./miscellaneous/functions.html#rxStompServiceFactory)

Deprecated classes:

- [StompRService](./injectables/StompRService.html)
- [StompService](./injectables/StompService.html)

