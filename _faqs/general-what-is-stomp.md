---
question: 'What are STOMP and WebStomp?'
group: General
priority: AAA
---

[STOMP](https://stomp.github.io/index.html) is a very simple text protocol to
interact with messaging brokers.
Typically one of [AMQP](https://www.amqp.org/),
[MQTT](http://mqtt.org/), [JMS](https://en.wikipedia.org/wiki/Java_Message_Service),
or a similar protocol is used to connect to a messaging broker.
In a language like JavaScript it may not be easy to implement any of these protocols.
So, STOMP becomes a reasonable option.

Further web browsers do not allow TCP connections from web pages.
Thankfully these support [WebSockets](https://en.wikipedia.org/wiki/WebSocket).
This library implements STOMP protocol over WebSockets, which is sometimes
referred as WebStomp.
