---
question: 'What are STOMP and WebStomp?'
group: General
priority: AAA
---

[STOMP](https://stomp.github.io/index.html) is a simple text protocol for messaging brokers.
Implementing broker-native protocols like [AMQP](https://www.amqp.org/),
[MQTT](http://mqtt.org/), or [JMS](https://en.wikipedia.org/wiki/Java_Message_Service)
in JavaScript can be complex; STOMP is a practical alternative.

Browsers do not allow raw TCP connections from web pages. To overcome this,
many brokers support STOMP over [WebSocket](https://en.wikipedia.org/wiki/WebSocket),
commonly called WebStomp.
