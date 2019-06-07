---
question: "I am using SockJS, my automatic reconnection does not work?"
group: SockJS
priority: EAC
---

You need to pass a factory that returns a SockJS instance.

Please see
[Using STOMP with SockJS](/guide/stompjs/rx-stomp/ng2-stompjs/2018/09/10/using-stomp-with-sockjs.html)
if you are using recent versions of these libraries.

If you are using `Stomp.over` compatibility mode (or older version), please refer to
[Stomp.over API docs](/api-docs/latest/classes/Stomp.html#over).
