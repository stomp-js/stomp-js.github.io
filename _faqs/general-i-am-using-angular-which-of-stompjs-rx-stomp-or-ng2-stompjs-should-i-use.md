---
question: 'I am using Angular. Which of stompjs or rx-stomp should I use?'
group: General
priority: ACE
---

Angular makes heavy use of [RxJS](https://github.com/ReactiveX/RxJS). So using `rx-stomp` should feel natural with Angular.

There is a tutorial for using `rx-stomp` with Angular. Please see [guides](/#getting-started).

Having said all of these, you can use any of the variants.
Developers have reported successfully using `stompjs` directly with Angular.

Angular makes heavy use of [RxJS](https://github.com/ReactiveX/RxJS), so `rx-stomp` is the recommended choice for Angular apps.

Why `rx-stomp`:
- Native RxJS APIs (Observables) for messages, connection state, and lifecycles.
- Subscriptions auto-reestablish on reconnects without manual bookkeeping.
- Works well with Angular patterns (services, dependency injection, async pipes).

When to use `stompjs`:
- You want the lightest possible dependency set and prefer imperative APIs.
- You are not using RxJS in your app.

Helpful links:
- Angular sample using `@stomp/rx-stomp`: https://github.com/stomp-js/rx-stomp-angular
- Migrating from `ng2-stompjs` to `rx-stomp`: {% link _posts/2022-03-03-ng2-stompjs-to-rx-stomp.md %}
