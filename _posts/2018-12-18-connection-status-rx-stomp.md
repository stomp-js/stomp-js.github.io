---
layout: single
title: 'Connection status with @stomp/rx-stomp'
date: 2025-09-19 19:22:37 +0530
categories: guide rx-stomp
toc: true
redirect_from:
  - /guide/ng2-stompjs/rx-stomp/2018/12/17/connection-status-ng2-stompjs.html
  - /guide/ng2-stompjs/rx-stomp/2018/12/18/connection-status-ng2-stompjs.html
  - /guide/ng2-stompjs/rx-stomp/2018/12/19/connection-status-ng2-stompjs.html
  - /guide/ng2-stompjs/rx-stomp/connection-status-ng2-stompjs.html
  - /guide/rx-stomp/connection-status-ng2-stompjs.html
---

This guide shows how to observe and display the STOMP connection status in an Angular app using @stomp/rx-stomp and RxStomp.

See [rx-stomp with Angular] for a complete Angular setup.

## The API

RxStomp exposes connectionState$ as an RxJS BehaviorSubject. It emits the current state immediately, then on every change. States are defined by the RxStompState enum and correspond to WebSocket readyState semantics:

- CONNECTING
- OPEN
- CLOSING
- CLOSED

Example: log state transitions

```typescript
import { RxStomp, RxStompState } from '@stomp/rx-stomp';

const rxStomp = new RxStomp();
// ...configure and activate...
rxStomp.connectionState$.subscribe(state => {
  console.log(RxStompState[state]); // e.g., 'OPEN'
});
```

In Angular, when using an injected RxStompService (a simple subclass of RxStomp wired via DI), you can map the enum to strings for binding:

```typescript
import { Observable, map } from 'rxjs';
import { RxStompService, RxStompState } from '@stomp/rx-stomp';

export class StatusComponent {
  connectionStatus$: Observable<string>;

  constructor(rxStompService: RxStompService) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(
      map(state => RxStompState[state])
    );
  }
}
```

Template (AsyncPipe binds to the latest value):

```angular2html
<div id="status">
  <div id="indicator" class="{{ connectionStatus$ | async }}"></div>
  <span id="status-label">{{ connectionStatus$ | async }}</span>
</div>
```

Minimal CSS for a traffic-light indicator:

```css
div#indicator {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin: 0 10px;
  display: inline-block;
  background: #ffbf00; /* CONNECTING, CLOSING */
}

div.CLOSED#indicator { background: red; }
div.OPEN#indicator   { background: green; }
```

## Responding to successful connection

RxStomp also provides connected$ (Observable). It emits immediately if already connected, and on every subsequent connect. Use it to trigger logic that must run after the session is established (and on reconnects).

```typescript
import { take } from 'rxjs/operators';
import { RxStompService } from '@stomp/rx-stomp';

// On every (re)connection
rxStompService.connected$.subscribe(() => {
  console.log('Connected (or reconnected).');
});

// Only once (immediately if already connected)
rxStompService.connected$.pipe(take(1)).subscribe(() => {
  console.log('Connected once.');
});
```

Internally, connected$ is a filtered view of connectionState$ for RxStompState.OPEN:

```typescript
this.connected$ = this.connectionState$.pipe(
  filter(state => state === RxStompState.OPEN)
);
```

You can similarly watch for CLOSED, CONNECTING, or CLOSING if you need custom handling.

## Notes

- You do not need to delay subscribe/watch calls until after connection; RxStomp queues and (re)subscribes automatically when the broker is connected again.
- For a complete Angular setup, see [rx-stomp with Angular].

[RxStomp]: /api-docs/latest/classes/RxStomp.html
[RxStompConfig]: /api-docs/latest/classes/RxStompConfig.html
[RxStompState]: /api-docs/latest/miscellaneous/enumerations.html#RxStompState
[RxStompService]: /api-docs/latest/injectables/RxStompService.html
[InjectableRxStompConfig]: /api-docs/latest/injectables/InjectableRxStompConfig.html
[WebSocket States]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
[RxJS BehaviorSubject]: http://reactivex.io/rxjs/manual/overview.html#behaviorsubject
[RxJS Observable]: http://reactivex.io/rxjs/manual/overview.html#observable
[rx-stomp with Angular]: {% link _posts/2022-03-02-rx-stomp-with-angular.md %}