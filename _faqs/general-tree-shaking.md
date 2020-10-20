---
question: "Do these libraries work well with tree shaking?"
group: General
priority: ADM
---

Yes.

The versions - `stomp-js@6`, `rx-stomp@1`, `ng2-stompjs@8` - are targeted to
`es2015`. This ensures smaller code size.
The code follows guidelines that should allow proper tree shaking behavior.

`rx-stomp`, prior to v1, was distributed as `commonjs` modules, which
may not be tree shaking friendly. Please upgrade if you face issues.
