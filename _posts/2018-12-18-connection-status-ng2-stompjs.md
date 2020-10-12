---
layout: single
title:  "Connection status in ng2-stompjs"
date:   2018-12-18 19:22:37 +0530
categories: guide ng2-stompjs rx-stomp
redirect_from:
    - /guide/ng2-stompjs/rx-stomp/2018/12/17/connection-status-ng2-stompjs.html
    - /guide/ng2-stompjs/rx-stomp/2018/12/18/connection-status-ng2-stompjs.html
    - /guide/ng2-stompjs/rx-stomp/2018/12/19/connection-status-ng2-stompjs.html
---

This guide extends the sample created in [ng2-stompjs-with-angular7].

Original and extended source code at [ng2-stompjs-angular7-sample].
Branch `connection-status` has code from this guide.

This guide applies to both `ng2-stompjs` and `rx-stomp`.

## The API

[RxStompService] and [InjectableRxStompConfig] are injectable versions of [RxStomp] 
and [RxStompConfig] respectively. These offer same functionality otherwise.

[RxStomp] exposes [RxStomp#connectionState$] as an [RxJS BehaviorSubject].
It will yield the current state immediately and subsequently notify each state change.
State is defined as [RxStompState] - an Enum using same values as [WebSocket States].

```typescript
    rxStompService.connectionState$.subscribe((state) => {
      // state is an Enum (Integer), RxStompState[state] is the corresponding string
      console.log(RxStompState[state]);
    });
```

[RxStompState] can have one of the following values:
- CONNECTING
- OPEN
- CLOSING
- CLOSED 

This allows to easily write an indicator for UI. See the following code from the sample:

```typescript
export class StatusComponent {
  public connectionStatus$: Observable<string>;

  constructor(public rxStompService: RxStompService) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
  }
}
```

{% raw  %}
```angular2html
<div id="status">
  <div id="indicator" class="{{connectionStatus$|async}}"></div>
  <span id="status-label">{{connectionStatus$|async}}</span>
</div>

```
{% endraw %}

With little CSS the indicator can be made to change color red/ember/green.

```css
/* Make it a circle */
/* Make it a circle */
div#indicator {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin: 0 10px;
    display: inline-block;
    background: #ffbf00; /* Ember by default, will be used for CONNECTING and CLOSING */
}

div.CLOSED#indicator {
    background: red;
}

div.OPEN#indicator {
    background: green;
}
```

## Responding to successful connection 

[RxStomp#connected$] is an [RxJS Observable] which will trigger immediately if Stomp broker
is already connected. It will trigger in each subsequent connect.

```typescript
    // In case you want to respond to each connection establishment
    rxStompService.connected$.subscribe(() => {
      console.log('I will be called for each time connection is established.');
    });

    // If you want to execute only once. It will execute immediately if connected
    // otherwise on first subsequent connection.
    rxStompService.connected$.pipe(take(1)).subscribe(() => {
      console.log('I will be called only once.');
    });
```

The following is the code from the library. [RxStomp#connected$] is filtered [RxStomp#connectionState$].

```typescript
    this.connected$ = this.connectionState$.pipe(
      filter((currentState: RxStompState) => {
        return currentState === RxStompState.OPEN;
      })
    );
```

The above can be used to implement watch for any other state (like `CLOSED`).


[ng2-stompjs-with-angular7]: {% link _posts/2018-11-04-ng2-stomp-with-angular7.md %}
[ng2-stompjs-angular7-sample]: https://github.com/stomp-js/ng2-stompjs-angular7

[RxStomp]: /api-docs/latest/classes/RxStomp.html
[RxStompConfig]: /api-docs/latest/classes/RxStompConfig.html
[RxStompState]: /api-docs/latest/miscellaneous/enumerations.html#RxStompState
[RxStomp#connected$]: https://stomp-js.github.io/api-docs/latest/classes/RxStomp.html#connected$
[RxStomp#connectionState$]: https://stomp-js.github.io/api-docs/latest/classes/RxStomp.html#connectionState$

[RxStompService]: /api-docs/latest/injectables/RxStompService.html
[InjectableRxStompConfig]: /api-docs/latest/injectables/InjectableRxStompConfig.html
[WebSocket States]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
[RxJS BehaviorSubject]: http://reactivex.io/rxjs/manual/overview.html#behaviorsubject
[RxJS Observable]: http://reactivex.io/rxjs/manual/overview.html#observable
