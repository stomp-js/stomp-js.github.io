---
question: 'What are Heartbeats? Should I bother?'
group: General
priority: AEA
---

Most of STOMP 1.1+ brokers will support heart beats.
These can be broker to the client (incoming) or client to the broker (outgoing).
When enabled periodic heat beats are sent.
If heart beats are not received within specified time (along with some grace time),
the connection is assumed to be stale and will be terminated.

SockJS may not support heart beats.
See [using STOMP with SockJS](/guide/stompjs/rx-stomp/ng2-stompjs/using-stomp-with-sockjs.html).

Whether you should use heart beats is a complex decision.
If you use it the disconnections will be detected sooner.
However, it also means packets (actually a one byte payload) will keep getting sent/received even when
there is no application traffic.

Please see [Heart Beats](/guide/stompjs/using-stompjs-v5.html#heart-beating)
topic on how to use it.
