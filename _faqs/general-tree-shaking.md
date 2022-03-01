---
question: 'Do these libraries work well with tree shaking?'
group: General
priority: ADM
---

Yes.

The versions, `stomp-js@6+` and `rx-stomp@1+` are distributed as `es2015` UMD and modules. These lead to small code size and proper tree shaking behavior.

`rx-stomp`, before v1, was distributed as `commonjs` modules, which may not be tree shaking friendly. Please upgrade if you face issues.

`ng2-stompjs` is likely to cause issues with newer Angular versions. So, please migrate to `rx-stomp`.
