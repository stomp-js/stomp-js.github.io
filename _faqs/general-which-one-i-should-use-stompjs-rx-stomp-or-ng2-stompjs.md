---
question: "Which one I should use - stompjs, rx-stomp, or ng2-stompjs?"
group: General
priority: ACA
---

`stompjs` is the core underlying library, usable almost everywhere.

`rx-stomp` exposes functionality as [RxJS](https://github.com/ReactiveX/RxJS) primitives.
If you are already using RxJS in your project or familiar with it,
please consider using `rx-stomp`.

`ng2-stompjs` offers same functionally as `rx-stomp`.
`ng2-stompjs` makes `rx-stomp` classes Injectable and sets up some factories.
If you are using Angular you should consider this variant.
