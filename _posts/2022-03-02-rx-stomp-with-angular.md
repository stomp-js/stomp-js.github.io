---
layout: single
title: 'rx-stomp with Angular'
date: 2025-09-19 09:20:00 +0530
categories: guide rx-stomp
toc: true
redirect_from:
  - /guide/ng2-stompjs/ng2-stomp-with-angular7.html
---

This step-by-step guide creates a new Angular application and demonstrates how to use [rx-stomp].

While preparing this guide, `Angular 13.2.0` and `@stomp/rx-stomp 1.1.4` were used. The concepts apply to Angular 7+.

For the impatient, the final code from this tutorial is here: [https://github.com/stomp-js/rx-stomp-angular]

## Prerequisites

- Install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/).
- Basic familiarity with Angular and TypeScript. If unsure, start with [Tour of Heroes][tour-of-heroes].

## Instructions

### Create a new Angular application

Install the latest Angular CLI:

```bash
npm i @angular/cli -g
```

Scaffold the project:

```bash
ng new rx-stomp-angular --skip-install --defaults
cd rx-stomp-angular/
npm i
```

Run locally and open http://localhost:4200/:

```bash
ng serve
```

Keep this running. Angular CLI will rebuild and live-reload on changes.

_Use your favorite IDE to edit code while the dev server runs._

### Add @stomp/rx-stomp and inject RxStompService

Install the library:

```bash
npm i @stomp/rx-stomp
```

We’ll define configuration and wire it via Angular Dependency Injection when creating `RxStompService`.

#### Configuration

Create `src/app/my-rx-stomp.config.ts`:

```typescript
import { RxStompConfig } from '@stomp/rx-stomp';

export const myRxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:15674/ws',

  // Headers (typical keys: login, passcode, host)
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  // Heartbeats (ms). Set 0 to disable.
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,

  // Reconnect delay (ms). Set 0 to disable.
  reconnectDelay: 200,

  // Console diagnostics (avoid in production)
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};
```

Works out-of-the-box with a default RabbitMQ STOMP-over-WebSocket setup; adjust for your broker.

#### The RxStompService

Create `src/app/rx-stomp.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root',
})
export class RxStompService extends RxStomp {
  constructor() {
    super();
  }
}
```

#### Factory to create and initialize RxStompService

Create `src/app/rx-stomp-service-factory.ts`:

```typescript
import { RxStompService } from './rx-stomp.service';
import { myRxStompConfig } from './my-rx-stomp.config';

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
```

#### Angular DI setup

In `src/app/app.module.ts`, add a provider:

```typescript
providers: [
  {
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  },
];
```

And import near the top:

```typescript
import { RxStompService } from './rx-stomp.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
```

### Messages

We’ll build a component that:

- Sends a message on button click.
- Subscribes and lists received messages.

#### Skeleton

Create the `Messages` component:

```bash
ng generate component messages
```

Set `src/app/messages/messages.component.html`:

```html
<div id="messages">
  <button class="btn btn-primary">Send Test Message</button>
  <h2>Received messages</h2>
  <ol>
    <!-- list will be populated via Angular binding -->
    <li class="message">message</li>
  </ol>
</div>
```

Add the component to the main UI (`src/app/app.component.html`):

```html
<div style="text-align:center">
  <h1>Welcome to {{ title }}!</h1>
</div>
<app-messages></app-messages>
```

Check the browser to confirm the updated UI. If the page is blank, check terminal output from `ng serve` and the browser console for errors.

#### Sending messages

Inject `RxStompService` into `MessagesComponent` (`src/app/messages/messages.component.ts`):

```typescript
constructor(private rxStompService: RxStompService) {}
```

Add a click handler:

```typescript
onSendMessage() {
  const message = `Message generated at ${new Date()}`;
  this.rxStompService.publish({ destination: '/topic/demo', body: message });
}
```

_See [RxStomp#publish][rx-stomp-publish] for options like headers, receipts, and binary payloads._

`src/app/messages/messages.component.ts` (so far):

```typescript
import { Component, OnInit } from '@angular/core';
import { RxStompService } from '../rx-stomp.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  constructor(private rxStompService: RxStompService) {}

  ngOnInit(): void {}

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({ destination: '/topic/demo', body: message });
  }
}
```

Wire the button in the template with `(click)="onSendMessage()"`:

```html
<div id="messages">
  <button class="btn btn-primary" (click)="onSendMessage()">
    Send Test Message
  </button>
  <h2>Received messages</h2>
  <ol>
      <!-- list will be populated via Angular binding -->
    <li class="message">message</li>
  </ol>
</div>
```

Open the browser console. Clicking “Send Test Message” should log frame activity from the debug logger.

#### Receiving messages

Use [RxStomp#watch][rx-stomp-watch] to subscribe to `/topic/demo`:

```typescript
ngOnInit() {
  this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
    this.receivedMessages.push(message.body);
  });
}
```

Import `Message` from `@stomp/stompjs` and declare the array. Then bind the list with `ngFor`.
A few other modules also expose `Message` classes, so you need to be careful.

_If you are coming from `@stomp/stompjs`, please notice that you do not
need to subscribe within the callback of stomp getting connected.
This library internally ensures that actual subscription happens
when the broker is actually connected.
It also keeps track of broker re-connections and automatically resubscribes._


Update `src/app/messages/messages.component.html` to render messages:

```html
<li class="message" *ngFor="let message of receivedMessages">{{ message }}</li>
```

Complete files:

```typescript
import { Component, OnInit } from '@angular/core';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  receivedMessages: string[] = [];

  constructor(private rxStompService: RxStompService) {}

  ngOnInit(): void {
    this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({ destination: '/topic/demo', body: message });
  }
}
```

```html
<div id="messages">
  <button class="btn btn-primary" (click)="onSendMessage()">
    Send Test Message
  </button>
  <h2>Received messages</h2>
  <ol>
    <li class="message" *ngFor="let message of receivedMessages">
      {{ message }}
    </li>
  </ol>
</div>
```

Try sending a few messages, then open another browser tab/window: both should receive messages.

### Stopping the watch

Unsubscribe when the component is destroyed to avoid leaks:

- Implement `OnDestroy`.
- Store the `Subscription` returned by `subscribe`.
- Call `unsubscribe()` in `ngOnDestroy`.

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  receivedMessages: string[] = [];
  private topicSubscription!: Subscription;

  constructor(private rxStompService: RxStompService) {}

  ngOnInit() {
    this.topicSubscription = this.rxStompService
      .watch('/topic/demo')
      .subscribe((message: Message) => {
        this.receivedMessages.push(message.body);
      });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({ destination: '/topic/demo', body: message });
  }
}
```

Tip: You can also use the RxJS takeUntil pattern with a Subject if you prefer that style.

## Troubleshooting and tips

- Connection URL: Ensure `brokerURL` points to your broker’s STOMP-over-WebSocket endpoint (e.g., RabbitMQ default: `ws://localhost:15674/ws`).
- CORS/HTTPS: When serving the Angular app over HTTPS, use `wss://` and ensure certificates are valid.
- Heartbeats: Some proxies or brokers may need heartbeats tuned; start with `incoming: 0`, `outgoing: 20000` and adjust.
- Debug logs: Keep `debug` enabled during development to see connection and frame flow.
- Auth tokens: For token-based auth, see the [token authentication](/faqs/faqs.html#p-can-i-use-token-based-authentication-with-these-libraries-p) FAQ and set headers in `connectHeaders`.

## Where next

- Browse the sample code: [https://github.com/stomp-js/rx-stomp-angular]
- Explore [RxStomp][rx-stomp] to discover more methods and options.
- Learn [Angular Dependency Injection][angular-di].
- Show connection status in the UI: [Observing STOMP connection][connection-status-ng2-stompjs].
- Use [token authentication](/faqs/faqs.html#p-can-i-use-token-based-authentication-with-these-libraries-p) with your broker.

[tour-of-heroes]: https://angular.io/tutorial
[angular-di]: https://angular.io/guide/dependency-injection
[rx-stomp]: /api-docs/latest/classes/RxStomp.html
[rx-stomp-publish]: /api-docs/latest/classes/RxStomp.html#publish
[rx-stomp-watch]: /api-docs/latest/classes/RxStomp.html#watch
[https://github.com/stomp-js/rx-stomp-angular]: https://github.com/stomp-js/rx-stomp-angular
[connection-status-ng2-stompjs]: {% link _posts/2018-12-18-connection-status-rx-stomp.md %}
