---
question: "Can this library be used with NodeJS?"
group: NodeJS
priority: GAA
---

Yes, NodeJS is supported using WebSockets as communication mechanism.
Please see [NodeJS topic in using StompJS guide](/guide/stompjs/2018/06/29/using-stompjs-v5.html#in-nodejs).
In addition check the needed [PolyFills](/guide/stompjs/rx-stomp/ng2-stompjs/2018/06/29/pollyfils-for-stompjs-v5.html).

While this library can be used with NodeJS, if your broker supports,
you should consider
[AMQP](https://www.amqp.org/) or
[MQTT](http://mqtt.org/).
These protocols are likely to give more flexibility than STOMP.
