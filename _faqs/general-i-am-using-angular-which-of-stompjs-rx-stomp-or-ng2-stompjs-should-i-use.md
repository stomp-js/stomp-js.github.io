---
question: 'I am using Angular, which of stompjs, rx-stomp, or ng2-stompjs should I use?'
group: General
priority: ACE
---

Angular makes heavy use of [RxJS](https://github.com/ReactiveX/RxJS),
Using `rx-stomp` or `ng2-stompjs` should feel natural with Angular.

If you are going to use [Angular Dependency Injection](https://angular.io/guide/dependency-injection),
`ng2-stompjs` would be the way to go.
`ng2-stompjs` makes `rx-stomp` classes Injectable and sets up some factories.

Having said all of these, you can actually use any of the variants.
Developers have reported successfully using `stompjs` directly with Angular.
