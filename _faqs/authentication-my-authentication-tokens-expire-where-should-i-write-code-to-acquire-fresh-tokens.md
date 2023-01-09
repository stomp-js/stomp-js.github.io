---
question: 'My authentication tokens expire, where should I write code to acquire fresh tokens?'
group: Authentication
priority: GAC
---

The suggested place to acquire fresh tokens is
[beforeConnect](https://stomp-js.github.io/api-docs/latest/classes/Client.html#beforeConnect)
callback.
You can update the
[connectHeaders](https://stomp-js.github.io/api-docs/latest/classes/Client.html#connectHeaders)
after you have acquired a fresh token.

If you need to fetch a token using an async request (say using an XHR),
you can set an async function as the callback.
