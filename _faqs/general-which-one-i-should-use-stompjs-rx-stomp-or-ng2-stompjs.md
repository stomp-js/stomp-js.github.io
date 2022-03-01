---
question: 'Which one should I use - stompjs or rx-stomp?'
group: General
priority: ACA
---

`stompjs` is the underlying core library, usable almost everywhere.

`rx-stomp` exposes functionality as [RxJS] primitives. If you are already using RxJS in your project or are familiar with it, please consider using `rx-stomp`.

Since Angular relies heavily on [RxJS], you should consider `rx-stomp` with Angular.

[RxJS]: https://github.com/ReactiveX/RxJS
