---
layout: single
date: 2025-09-20 19:42:22 +0530
title: 'STOMP.js Family'
author_profile: true
---

These libraries provide [STOMP] over [WebSocket] connectivity for web browsers and other JavaScript runtimes.

[stompjs] is the core JavaScript library.
[rx-stomp] is a wrapper that exposes the same functionality as [RxJS] primitives.
If you already use [RxJS] or prefer reactive patterns, start with [rx-stomp].

## Getting started

Start here:

- [Using StompJS] - a step-by-step guide.
- [Using rx-stomp with Angular] — originally written for Angular 13; works with Angular 7+.
- Guide to [Connection status in RxStomp].
- Guide to [How to Use RxStomp with React](https://www.freecodecamp.org/news/build-chat-app-with-stomp-and-react/).

All of these guides are written by the maintainers and follow best practices.

Samples:

- [Samples](https://github.com/stomp-js/samples/) for [stompjs] and [rx-stomp].
- [Sample](https://github.com/stomp-js/rx-stomp-angular) for [rx-stomp] with Angular (7+).
- [Sample](https://gitlab.com/harsh183/rxstomp-react-tutorial) for [rx-stomp] with React.

[API documentation](/api-docs/latest/) for NPM released versions.

## Upgrading

- [Migrate ng2-stompjs to rx-stomp] — migrate Angular projects to use [rx-stomp].
- [Upgrading from old versions] — to upgrade from versions 2, 3, or 4.

## Other topics

- Read the [FAQs] — a curated list of common questions and answers.
- List of [Polyfills] — you may need these in some environments.
- Notes on using these libraries with [SockJS].
- Support for [Remote Procedure Calls] — powerful but less commonly used.
- Notes for using these libraries with [React Native].

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
[Connection status in RxStomp]: {% link _posts/2018-12-18-connection-status-rx-stomp.md %}
[FAQs]: {% link _posts/2019-05-20-faqs.html %}
[React Native]: {% link _posts/2019-06-10-react-native-additional-notes.md %}
[Migrate ng2-stompjs to rx-stomp]: {% link _posts/2022-03-03-ng2-stompjs-to-rx-stomp.md %}
