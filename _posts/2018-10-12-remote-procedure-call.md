---
layout: post
title:  "RPC - Remote Procedure Call"
date:   2018-10-12 09:12:00 +0530
categories: guide rx-stomp ng2-stompjs
---

Messaging usually works one way.
There is however a convention for two way communication (i.e. request/response).
This involves `reply-to` queues which routes the response back to correct client program
and `correlation-id` to uniquely match a response to the correct request.

See: [https://www.rabbitmq.com/tutorials/tutorial-six-python.html]
(https://www.rabbitmq.com/tutorials/tutorial-six-python.html)
for a sample using a very similar approach.

See a sample RPC server and broker at: 
[https://github.com/stomp-js/samples/](https://github.com/stomp-js/samples/)

## Outline

This feature will work with `@stomp/rx-stomp` and `@stomp/ng2-stompjs`.

While working with Angular (`@stomp/ng2-stompjs`) if you will use classes to be
injected as dependencies, you should use following equivalent classes:

- [RxStomp] --> [RxStompService]
- [RxStompRPC] --> [RxStompRPCService]
- [RxStompRPCConfig] --> [InjectableRxStompRpcConfig]

## Implementing the RPC server endpoint

This can be implemented in any language, in most cases it will be there in some backend server.

```typescript
    const myServiceEndPoint = '/topic/echo';

    rxStomp.watch(myServiceEndPoint).subscribe((message: Message) => {
      // The response needs to be sent back here
      const replyTo = message.headers['reply-to'];
      
      // Same correlation id needs to be sent back as message header
      const correlationId = message.headers['correlation-id'];
      
      // Process the request, compute the response
      const incomingMessage = message.body;

      const outgoingMessage = 'Echoing - ' + incomingMessage;
      
      // Send the response back to destination `replyTo` with `correlation-id` header
      rxStomp.publish({
        destination: replyTo,
        body: outgoingMessage,
        headers: {'correlation-id' : correlationId}
      });
    });
```

## Using it from the client

### RabbitMQ

RabbitMQ has special support for `temp-queues` in `reply-to` messages
which make things to work magically. Really I mean it.

If you don't believe me check details at 
[https://www.rabbitmq.com/stomp.html#d.tqd](https://www.rabbitmq.com/stomp.html#d.tqd)

Well the client code looks equally simple and similar to what you would expect
to use with any backend service.

Create an instance of [RxStompRPC], you will need an instance of [RxStomp] in the constructor:
```typescript
  const rxStompRPC = new RxStompRPC(rxStomp);
```

Angular Dependency Injection can be used to inject [RxStompRPCService].
You will need [RxStompService] to be provided as well.

Making the RPC call is simple, takes same parameters as [RxStomp#publish]
and returns an `Observable` which will trigger once.

```typescript
    const myServiceEndPoint = '/topic/echo';

    const request = 'Hello';
    // It accepts a optional third argument a Hash of headers to be sent as part of the request
    rxStompRPC.rpc({destination: myServiceEndPoint, body: request}).subscribe((message: Message) => {
      // Consume the response
      console.log(message.body);
    });
```

You can notice similarity with Angular HTTP calls.

There is another method [RxStompRPC#stream] that will not terminate after one response.
This can be used to receive stream of responses for a single request.
If you use that it will be your responsibility to unsubscribe when you do not expect
any additional messages.

### Other Brokers

There are few requirements:

- the reply queue name **must** be unique across the broker.
- ideally, for security reasons only the client creating the queue should have access to it.

Many brokers have `temp-queue` concept which should simplify your work. 

Following gives an outline:

```typescript
  const stompRPCConfigForActiveMQ = {
    // A unique name, BTW angular2-uuid module is already added as dependency
    replyQueueName: `/topic/replies.${UUID.UUID()}`,
    
    // Simply subscribe, you would need to secure by adding broker specific options
    setupReplyQueue: (replyQueueName: string, stompService: StompRService) => {
      return stompService.subscribe(replyQueueName);
    }
  };
```

This custom config would need to be passed as second parameter in `StompRPCService`
constructor, or, can be passed as an Angular Dependency.

Apart from this additional setup step usage remains same as RabbitMQ case as documented above.


[RxStomp]: /api-docs/latest/classes/RxStomp.html
[RxStomp#publish]: /api-docs/latest/classes/RxStomp.html#publish
[RxStompService]: /api-docs/latest/injectables/RxStompService.html
[RxStompRPC]: /api-docs/latest/classes/RxStompRPC.html
[RxStompRPCService]: /api-docs/latest/injectables/RxStompRPCService.html
[RxStompRPCConfig]: /api-docs/latest/classes/RxStompRPCConfig.html
[InjectableRxStompRpcConfig]: /api-docs/latest/injectables/RxStompRPCService.html
[RxStompRPC#stream]: /api-docs/latest/classes/RxStompRPC.html#stream
