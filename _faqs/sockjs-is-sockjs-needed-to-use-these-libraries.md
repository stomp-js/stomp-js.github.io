---
question: 'Is SockJS needed to use these libraries?'
group: SockJS
priority: EAA
---

No. SockJS is optional.

Prefer native WebSockets by default. Use SockJS only to support environments without WebSocket,
or when your deployment requires HTTP-only transport.

See: {% link _posts/2018-09-10-using-stomp-with-sockjs.md %}
