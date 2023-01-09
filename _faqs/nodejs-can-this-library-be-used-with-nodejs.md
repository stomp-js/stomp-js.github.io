---
question: 'Can this library be used with NodeJS?'
group: NodeJS
priority: GAA
---

Yes, NodeJS is supported using WebSockets as the communication mechanism.
Please see [NodeJS topic in using StompJS guide](/guide/stompjs/using-stompjs-v5.html#in-nodejs).
In addition, check the needed [PolyFills](/guide/stompjs/rx-stomp/polyfills-for-stompjs.html).

While this library can be used with NodeJS, if your broker supports,
you should consider
[AMQP](https://www.amqp.org/) or
[MQTT](http://mqtt.org/).
These protocols are likely to give more flexibility than STOMP.
