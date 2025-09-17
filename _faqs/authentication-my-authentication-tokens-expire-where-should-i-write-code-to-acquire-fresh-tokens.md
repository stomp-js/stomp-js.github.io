---
question: 'My authentication tokens expire, where should I write code to acquire fresh tokens?'
group: Authentication
priority: GAC
---

Use the [beforeConnect](https://stomp-js.github.io/api-docs/latest/classes/Client.html#beforeConnect)
callback to fetch a fresh token and update
[connectHeaders](https://stomp-js.github.io/api-docs/latest/classes/Client.html#connectHeaders)
just before each (re)connect.

If you need async fetching (e.g., HTTP call), make `beforeConnect` an async function.
