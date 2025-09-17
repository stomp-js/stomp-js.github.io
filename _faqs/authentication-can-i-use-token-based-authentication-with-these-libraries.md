---
question: 'Can I use Token-based authentication with these libraries?'
group: Authentication
priority: GAA
---

While WebSocket is initiated via HTTP(S), custom headers cannot be set during the handshake.

STOMP brokers typically expect authentication in the STOMP
[CONNECT frame](https://stomp.github.io/stomp-specification-1.2.html#CONNECT_or_STOMP_Frame)
via headers. You can supply arbitrary key/value pairs using
[connectHeaders](https://stomp-js.github.io/api-docs/latest/classes/Client.html#connectHeaders).

For token-based authentication, include your token in `connectHeaders` as required by your broker.
If using Spring, see:
https://docs.spring.io/spring-framework/reference/web/websocket/stomp/authentication.html#websocket-stomp-authentication-token-based
