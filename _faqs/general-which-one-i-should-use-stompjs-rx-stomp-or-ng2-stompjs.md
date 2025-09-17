---
question: 'Which one should I use - stompjs or rx-stomp?'
group: General
priority: ACA
---

`stompjs` is the core library.

`rx-stomp` exposes functionality as [RxJS] primitives. If you already use RxJS or prefer reactive
streams, consider `rx-stomp`.

A key difference: with `stompjs`, use the [client] primarily inside the [onConnect] callback;
using it outside can lead to races. `rx-stomp` avoids this limitation.

Rule of thumb: if you need to interact with the client outside the connect lifecycle,
prefer `rx-stomp`. With Angular (which relies heavily on RxJS), `rx-stomp` feels natural.


[RxJS]: https://github.com/ReactiveX/RxJS
[client]: /api-docs/latest/classes/Client.html
[onConnect]: /api-docs/latest/classes/Client.html#onConnect
