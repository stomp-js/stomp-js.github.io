---
question: 'Can this library be used with NodeJS?'
group: NodeJS
priority: GAA
---

Yes. Node.js is supported using WebSockets as the transport.
See the guide: {% link _posts/2018-06-29-using-stompjs-v5.md %}

Also ensure required polyfills are present: {% link _posts/2018-06-28-polyfills-for-stompjs.md %}

If your broker supports them, you may also consider broker-native protocols like
[AMQP](https://www.amqp.org/) or [MQTT](http://mqtt.org/).
