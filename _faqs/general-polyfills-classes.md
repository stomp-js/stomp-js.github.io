---
question: 'Help me, I am getting errors about missing classes - TextEncoder/TextDecoder/WebSocket'
group: General
priority: AKA
---

Please see the Polyfills guide: {% link _posts/2018-06-28-polyfills-for-stompjs.md %}

- Node.js: provide a WebSocket implementation and ensure TextEncoder/TextDecoder exist.
- React Native: add TextEncoder/TextDecoder; WebSocket is provided by RN.
- Browsers: typically no polyfills are required.
