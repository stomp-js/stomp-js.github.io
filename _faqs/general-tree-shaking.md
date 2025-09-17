---
question: 'Do these libraries work well with tree shaking?'
group: General
priority: ADM
---

Yes — when you consume them as ES modules.

Tips for best results:
- Use ESM and named imports:
  ```javascript
  import { Client } from '@stomp/stompjs';
  // good: only Client is bundled
  ```
  Avoid wildcard or UMD usage in apps you intend to tree-shake:
  ```javascript
  // avoid for app bundles (prevents effective tree-shaking)
  // import * as StompJs from '@stomp/stompjs';
  // <script src=".../stomp.umd.js"></script>
  ```
- Import only what you use; don’t re-export the entire package from your own index.
- Build in production mode so your bundler can perform dead-code elimination.
  - Webpack: `mode: 'production'` (enables `optimization.usedExports`)
  - Rollup/Vite/Parcel: production builds enable tree-shaking by default
- Keep “side-effect free” usage:
  - Prefer top-level imports of symbols you actually use over side-effect-only imports.
- Verify with a bundle analyzer (e.g., `webpack-bundle-analyzer`, `rollup-plugin-visualizer`).

Note:
- The UMD bundle is intended for direct `<script>` use in browsers and is not tree‑shakeable.
- If you still see unexpected code retained, ensure all dependencies and your bundler are up to date and that you’re not pulling the UMD build accidentally.
