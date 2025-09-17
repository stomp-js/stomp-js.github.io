---
question: "Are there any missing features from Jeff Mesnil's stompjs?"
group: Jeff Mesnil's stompjs
priority: ZAE
---

The original `stompjs` offered STOMP over TCP in Node.js.
`@stomp/stompjs` focuses on STOMP over WebSocket (WebStomp), which is supported by most brokers.

`@stomp/stompjs` adheres more strictly to the STOMP specification than the original library,
so behavior may differ in edge cases. If you hit issues, please raise an issue.

If you specifically need STOMP over TCP in Node.js, consider using the TCP Wrapper:
https://github.com/stomp-js/tcp-wrapper
