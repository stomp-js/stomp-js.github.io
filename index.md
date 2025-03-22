---
layout: single
date: 2025-03-22 19:42:22 +0530
title: 'StompJs Family'
author_profile: true
---

These libraries provide [STOMP] over [Websocket] connectivity for web browsers or other Javascript-based environments.

[stompjs] is the core JavaScript library.
[rx-stomp] is a wrapper that exposes functionality as [RxJS] primitives.
If you are already using [RxJS] in your project or are familiar with it, check out [rx-stomp].

## Getting started

Please try the following guides:

- [Using StompJS] - a step-by-step guide.
- [Using rx-stomp with Angular] — originally written for Angular13,
  should work with Angular 7+.
- Guide to [Connection status in ng2-stompjs].
- Guide to [How to Use RxStomp with React](https://www.freecodecamp.org/news/build-chat-app-with-stomp-and-react/).

All these guides are written by the maintainers of these projects and follow best practices.

Samples:

- [Samples](https://github.com/stomp-js/samples/) for [stompjs] and [rx-stomp].
- [Sample](https://github.com/stomp-js/rx-stomp-angular) for [rx-stomp] with Angular 7+.
- [Sample](https://gitlab.com/harsh183/rxstomp-react-tutorial) for [rx-stomp] with React.

[API documentation](/api-docs/latest/) for NPM released versions.

## Upgrading

- [Migrate ng2-stompjs to rx-stomp] — migrate Angular projects to use [rx-stomp].
- [Upgrade Guide] — upgrade to the most recent versions of `stompjs` and `rx-stomp`.
- [Upgrading from old versions] — to update to stompjs@v5 from any of the older versions.

## Other topics

- Read the [FAQs]. These cover varied topics.
- List of [Polyfills] — you may need these for some environments.
- Set of additional notes for using these libraries with [SockJS].
- One of my favorites, but not widely used, excellent support for
  [Remote Procedure Calls].
- An article devoted to specific issues posed by [React Native].

[stomp]: https://stomp.github.io/index.html
[websocket]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
[rxjs]: https://github.com/ReactiveX/RxJS
[stompjs]: https://github.com/stomp-js/stompjs
[rx-stomp]: https://github.com/stomp-js/rx-stomp
[ng2-stompjs]: https://github.com/stomp-js/ng2-stompjs

[Polyfills]: {% link _posts/2018-06-28-polyfills-for-stompjs.md %}
[Using StompJS]: {% link _posts/2018-06-29-using-stompjs-v5.md %}
[Upgrading from old versions]: {% link _posts/2018-09-08-upgrading-stompjs.md %}
[SockJS]: {% link _posts/2018-09-10-using-stomp-with-sockjs.md %}
[Remote Procedure Calls]: {% link _posts/2018-10-12-remote-procedure-call.md %}
[Using rx-stomp with Angular]: {% link _posts/2022-03-02-rx-stomp-with-angular.md %}
[Connection status in ng2-stompjs]: {% link _posts/2018-12-18-connection-status-ng2-stompjs.md %}
[FAQs]: {% link _posts/2019-05-20-faqs.html %}
[React Native]: {% link _posts/2019-06-10-react-native-additional-notes.md %}
[Upgrade Guide]: {% link _posts/2020-10-21-upgrading-to-stompjs-6-rx-stomp-1.md %}
[Migrate ng2-stompjs to rx-stomp]: {% link _posts/2022-03-03-ng2-stompjs-to-rx-stomp.md %}
