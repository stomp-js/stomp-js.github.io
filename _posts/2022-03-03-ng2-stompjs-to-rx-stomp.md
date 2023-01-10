---
layout: single
title: 'ng2-stompjs to rx-stomp'
date: 2022-03-02 00:51:00 +0530
categories: guide rx-stomp ng2-stompjs
toc: true
---

These steps have been tested with Angular 7 and Angular 13. So these should work for Angular 7+.

See also [Using rx-stomp with Angular].

## Instructions

### Compile target

[rx-stomp] uses ES6 classes, so the Angular project needs to set compile target at least `es6`. Please check and adjust `target` in your `tsconfig.json`.

### Uninstall ng2-stompjs, install rx-stomp

```bash
$ npm uninstall @stomp/ng2-stompjs
$ npm i @stomp/rx-stomp
```

### Change classes and imports

Change `InjectableRxStompConfig` from `@stomp/ng2-stompjs` -> [RxStompConfig] from `@stomp/rx-stomp`.

Next, we will create `RxStompService` and `rxStompServiceFactory`. These were provided by `ng2-stompjs`. If you were using code similar to the tutorials, the following would work as-is.

Create `rx-stomp.service.ts` file inside `src/app/` with the following content:

```typescript
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root',
})
export class RxStompService extends RxStomp {}
```

Create `rx-stomp-service-factory.ts` file inside `src/app/` with the following content:

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

If you are using a custom setup, you may need to adjust the factory code.

### Angular DI setup

You will need to update the configuration for Angular DI.

Remove the provider configuration for `InjectableRxStompConfig` and adjust the setup for `RxStompService`.

```typescript
providers: [
  {
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  },
]
```

Remove the old imports and add the imports from the newly created modules.

```typescript
import { RxStompService } from './rx-stomp.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
```

### Adjust imports

Change the import path for `RxStompService` from `@stomp/ng2-stompjs` to the local module.

[rx-stomp]: /api-docs/latest/classes/RxStomp.html
[RxStompConfig]: /api-docs/latest/classes/RxStompConfig.html
[Using rx-stomp with Angular]: {% link _posts/2022-03-02-rx-stomp-with-angular.md %}
