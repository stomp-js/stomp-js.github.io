---
layout: single
title: 'React Native - Additional notes'
date: 2025-03-22 10:01:01 +0530
categories: workaround stompjs rx-stomp
toc: true
redirect_from:
  - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/09/react-native-null-chopping-issue.html
  - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/10/react-native-null-chopping-issue.html
  - /workaround/stompjs/rx-stomp/ng2-stompjs/2019/06/11/react-native-null-chopping-issue.html
  - /workaround/stompjs/rx-stomp/ng2-stompjs/react-native-null-chopping-issue.html
  - /workaround/stompjs/rx-stomp/ng2-stompjs/react-native-additional-notes.html
---

The largest number of tickets raised for these projects is related to using these libraries with React Native.
There are some platform issues in React Native that cause these libraries to fail.
Unfortunately, the React Native team is not inclined to resolve these issues.
Please follow the advice on this page to effectively use these libraries with React Native.

## Prefer [rx-stomp]

This advice is not specific to React Native, but in general, to Single Page Applications.
Your code is going to be far less convoluted and will handle edge cases much better.
Managing the Client objest and state can be tricky with React hooks.
Please see
[How to Use RxStomp with React](https://www.freecodecamp.org/news/build-chat-app-with-stomp-and-react/) and [Sample](https://gitlab.com/harsh183/rxstomp-react-tutorial).

## Polyfills

Before you proceed, ensure you have [polyfills for
TextEncoder/TextDecoder]({% link _posts/2018-06-28-polyfills-for-stompjs.md %}).

## Insecure connection issue in Android

Recent versions of Android SDK do not allow insecure (not HTTPS) HTTP connections.
This is likely to show up in production builds only.
You will notice STOMP connection not getting established and reconnect attempt being made.

To bypass the checks, please follow suggestions at
[https://github.com/stomp-js/stompjs/issues/149#issuecomment-633734719](https://github.com/stomp-js/stompjs/issues/149#issuecomment-633734719)
and [https://blog.usejournal.com/6-daily-issues-in-android-cleartext-traffic-error-52ab31dd86c2](https://blog.usejournal.com/6-daily-issues-in-android-cleartext-traffic-error-52ab31dd86c2).

## Null Chopping

Some versions of React Native (including the current production
version as on April 26, 2024) have an underlying issue that prevents these libraries
from working correctly.
Please see:

- [react-native/issues/24129](https://github.com/facebook/react-native/issues/24129)
- [react-native/issues/12731](https://github.com/facebook/react-native/issues/12731)
- [react-native/issues/22043](https://github.com/facebook/react-native/issues/22043)
- [metro/issues/365](https://github.com/facebook/metro/issues/365)

Reported in `stompjs`:

- [stompjs/issues/55](https://github.com/stomp-js/stompjs/issues/55)
- [stompjs/issues/89](https://github.com/stomp-js/stompjs/issues/89)

The best solution would have been for the underlying issue to be fixed.
However, it seems there is not much interest in that.
Reference [react-native/issues/24129](https://github.com/facebook/react-native/issues/24129).

It has been observed that NULL chopping happens only with strings, buffers works correctly.
Workaround 2, avoids using strings altogether by using binary
for both incoming and outgoing packets.
Workaround 1, uses outgoing binary packets and tries to reverse the damage by appending
the missing NULL.

**Workaround 1:**

_This approach has been reported to work by multiple users._

- Upgrade to the latest version of `stompjs` (at least 5.4.1).
- In you configuration set both
  [forceBinaryWSFrames](/api-docs/latest/classes/Client.html#forceBinaryWSFrames) and
  [appendMissingNULLonIncoming](/api-docs/latest/classes/Client.html#appendMissingNULLonIncoming) to `true`.

The `forceBinaryWSFrames` is completely safe — it will not cause any data loss
or incorrect protocol behavior.

However, the `appendMissingNULLonIncoming` flag may cause
data loss or unexpected connection termination.
If you are only using small messages (which do not cause fragmentation),
you should be fine.

**Workaround 2:**

_This approach has been reported to work by one user._

If your broker supports forcing binary frames, you may try this approach.

- Upgrade to the latest version of `stompjs` (at least 5.4.1).
- In you configuration set
  [forceBinaryWSFrames](/api-docs/latest/classes/Client.html#forceBinaryWSFrames) to `true`.
- Force the broker to send only binary frames.
  (For example, in RabbitMQ set `web_stomp.ws_frame = binary` in `rabbitmq.conf`)

The approach is completely safe — it will not cause any data loss
or incorrect protocol behavior.


[rxjs]: https://github.com/ReactiveX/RxJS
[stompjs]: https://github.com/stomp-js/stompjs
[rx-stomp]: https://github.com/stomp-js/rx-stomp
