---
question: 'What are Heartbeats? Should I bother?'
group: General
priority: AEA
---

Most STOMP 1.1+ brokers will support heart beats.
These can be from the broker to the client (incoming)
or the client to the broker (outgoing).
When enabled, periodic heartbeats are sent.
If heartbeats are not received within specified time (along with some grace time),
the connection is assumed to be stale and will be terminated.

SockJS may not support heart beats.
See [using STOMP with SockJS](/guide/stompjs/rx-stomp/using-stomp-with-sockjs.html).

Whether you should use heart beats is a complex decision.
If you use it, a stale connection will be detected sooner.
However, it also means packets (actually a one-byte payload) will keep getting sent/received even when
there is no application traffic.

Please see the [Heart Beats](/guide/stompjs/using-stompjs-v5.html#heart-beating)
topic for usage details.
