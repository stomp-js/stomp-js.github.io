---
question: 'Can I use Token based authentication with these libraries?'
group: Authentication
priority: GAA
---

Even though [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
is somewhat similar to HTTP(S), it differs in one very important aspect - it
does not allow control of headers.

This poses a limitation on using token based authentication schemes using HTTP headers.

Conventional brokers do not expect any authentication information as part of
HTTP headers or HTTP connection parameters.
These instead rely on STOMP protocol's
[CONNECT Frame](https://stomp.github.io/stomp-specification-1.2.html#CONNECT_or_STOMP_Frame).
This frame can have header key/value pairs.
You can control these by setting
[connectHeaders](https://stomp-js.github.io/api-docs/latest/classes/Client.html#connectHeaders)
configuration option.
You can pass any pair of strings as key and values.

So, typically for token based authentication you will pass the token as part of
[connectHeaders](https://stomp-js.github.io/api-docs/latest/classes/Client.html#connectHeaders).
Check your broker documentation for details.

If you are using Spring, please check
[https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-stomp-authentication-token-based](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-stomp-authentication-token-based)
