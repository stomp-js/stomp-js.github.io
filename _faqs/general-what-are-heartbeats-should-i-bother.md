---
question: 'What are heartbeats? Should I bother?'
group: General
priority: AEA
---

Most STOMP 1.1+ brokers support heartbeats — periodic pings either
from the broker to the client (incoming) or the client to the broker (outgoing).
If heartbeats are not received within a configured time (plus grace), the connection is considered stale and closed.

SockJS may not support heartbeats with some brokers.
See {% link _posts/2018-09-10-using-stomp-with-sockjs.md %}.

Whether you should enable heartbeats depends on your needs:
- Pro: stale connections are detected sooner.
- Con: small packets continue even when there is no app traffic.

See the Heart-beating section for usage details: {% link _posts/2018-06-29-using-stompjs-v5.md %}#heart-beating
