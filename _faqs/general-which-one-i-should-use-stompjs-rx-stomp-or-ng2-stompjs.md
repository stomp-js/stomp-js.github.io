---
question: 'Which one should I use - stompjs or rx-stomp?'
group: General
priority: ACA
---

`stompjs` is the underlying core library, usable almost everywhere.

`rx-stomp` exposes functionality as [RxJS] primitives.
If you are already using RxJS in your project or are familiar with it, please consider using `rx-stomp`.

Other than syntactical differences,
these two variants have a very important difference.
In `stompjs`, the [client] must only be used within the [onConnect] callback.
Using it outside may produce strange errors.
The `rx-stomp` does not suffer from this limitation.

So, as a rule of thumb, if your application needs to use the [client] object
outside the [onConnect] callback, use `rx-stomp`.

When using with Angular, `rx-stomp` seems natual as 
Angular relies heavily on [RxJS].


[RxJS]: https://github.com/ReactiveX/RxJS
[client]: /api-docs/latest/classes/Client.html
[onConnect]: /api-docs/latest/classes/Client.html#onConnect
