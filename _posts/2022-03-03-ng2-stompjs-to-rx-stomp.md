---
layout: single
title: 'Migrate from ng2-stompjs to rx-stomp'
date: 2025-09-21 00:51:00 +0530
categories: guide rx-stomp ng2-stompjs
toc: true
---

This guide shows how to migrate an Angular app from `@stomp/ng2-stompjs` to `@stomp/rx-stomp`.

Tested with Angular 7 and 13; the steps apply to Angular 7+.

See also [Using rx-stomp with Angular].

## Overview

- Update TypeScript target to ES2015+ (ES6) to support rx-stomp classes.
- Replace ng2-stompjs dependencies and symbols with rx-stomp equivalents.
- Create a simple RxStompService and a factory to configure and activate it.
- Update Angular DI to provide the new service.

## Prerequisites

- Angular CLI project with TypeScript configured.
- WebSocket/STOMP endpoint available.

## 1) TypeScript compile target

rx-stomp uses ES6 classes. Ensure `tsconfig.json` has:

- `target`: at least `es6` (or `es2015`).

Example: `"target": "es2017"`.

## 2) Replace dependency

Uninstall ng2-stompjs and install rx-stomp:

```bash
npm uninstall @stomp/ng2-stompjs
npm i @stomp/rx-stomp
```

## 3) Update imports and types

- Replace `InjectableRxStompConfig` (ng2-stompjs) with [RxStompConfig] (rx-stomp).
- You will provide your configuration object (e.g., `myRxStompConfig`) to `RxStomp.configure`.

## 4) Create RxStompService

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

## 5) Create a factory for the service

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

If you use a custom setup (e.g., dynamic URLs, auth headers), adjust the factory accordingly before `activate()`.

## 6) Update Angular DI

Remove the `InjectableRxStompConfig` provider from ng2-stompjs. Provide `RxStompService` via the factory:

```typescript
providers: [
  {
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  },
];
```

Update imports where needed:

```typescript
import { RxStompService } from './rx-stomp.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
```

## 7) Adjust local imports

Replace any `@stomp/ng2-stompjs` service imports with the local `RxStompService`.

## Notes

- Keep your configuration shape compatible with [RxStompConfig].
- Ensure `rxStomp.activate()` is called once (the factory pattern above guarantees that).

[rx-stomp]: /api-docs/latest/classes/RxStomp.html
[RxStompConfig]: /api-docs/latest/classes/RxStompConfig.html
[Using rx-stomp with Angular]: {% link _posts/2022-03-02-rx-stomp-with-angular.md %}
