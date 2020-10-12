---
layout: single
title:  "React Native - Additional notes"
date:   2019-06-10 21:01:01 +0530
categories: workaround stompjs rx-stomp ng2-stompjs
toc: true
redirect_from:
    - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/09/react-native-null-chopping-issue.html
    - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/10/react-native-null-chopping-issue.html
    - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/11/react-native-null-chopping-issue.html
    - /workaround/stompjs/rx-stomp/ng2-stompjs/react-native-null-chopping-issue.html
---

# Polyfills

Before you proceed, ensure you have [polyfills for 
TextEncoder/TextDecoder](/guide/stompjs/rx-stomp/ng2-stompjs/pollyfils-for-stompjs-v5.html#in-react-native).

# Insecure connection issue in Android

Recent versions of Android SDK does not allow insecure (not HTTPS) HTTP connections.
This is likely to show up in production builds only.
You will notice STOMP connection not getting established and reconnect attempt being made.

To bypass the checks please follow suggestions at
[https://github.com/stomp-js/stompjs/issues/149#issuecomment-633734719](https://github.com/stomp-js/stompjs/issues/149#issuecomment-633734719)
and [https://blog.usejournal.com/6-daily-issues-in-android-cleartext-traffic-error-52ab31dd86c2](https://blog.usejournal.com/6-daily-issues-in-android-cleartext-traffic-error-52ab31dd86c2).

# Null Chopping

Some versions of React Native (including the current production
version as on June 10, 2019) have an underlying issue that prevents these libraries
to work correctly. See:

- [react-native/issues/12731](https://github.com/facebook/react-native/issues/12731)
- [react-native/issues/22043](https://github.com/facebook/react-native/issues/22043)
- [metro/issues/365](https://github.com/facebook/metro/issues/365)

Reported in `stompjs`:

- [stompjs/issues/55](https://github.com/stomp-js/stompjs/issues/55)
- [stompjs/issues/89](https://github.com/stomp-js/stompjs/issues/89)

The best solution would have been for the underlying issue to be fixed.
However, it seems there is not much interest in that.

It has been observed that NULL chopping happens only with strings, buffers works correctly.
Workaround 2, avoids using strings altogether by using binary
for both incoming and outgoing packets.
Workaround 1, uses outgoing binary packets and tries to reverse the damage by appending
the missing NULL.

**Workaround 1:**

*This approach has been reported to work by multiple users.*

- Upgrade to latest version of `stompjs` (at least 5.4.1).
- In you configuration set both
  [forceBinaryWSFrames](/api-docs/latest/classes/Client.html#forceBinaryWSFrames) and
  [appendMissingNULLonIncoming](/api-docs/latest/classes/Client.html#appendMissingNULLonIncoming) to `true`.

The `forceBinaryWSFrames` is completely safe - it will not cause any data loss
or incorrect protocol behavior.

However, the `appendMissingNULLonIncoming` flag may cause
data loss or unexpected connection termination.
If you are only using small messages (which do not cause fragmentation),
you should be fine.

**Workaround 2:**

*This approach has been reported to work by one user.*

If your broker supports forcing binary frames, you may try this approach.

- Upgrade to latest version of `stompjs` (at least 5.4.1).
- In you configuration set
  [forceBinaryWSFrames](/api-docs/latest/classes/Client.html#forceBinaryWSFrames) to `true`.
- Force the broker to send only binary frames.
  (For example, in RabbitMQ set `web_stomp.ws_frame = binary` in `rabbitmq.conf`)

The approach is completely safe - it will not cause any data loss
or incorrect protocol behavior.

*As of June 10, 2019, the workaround has not been propagated to `rx-stomp`/`ng2-stompjs`.*
