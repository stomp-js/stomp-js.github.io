---
layout: single
title:  "RPC - Remote Procedure Call"
date:   2018-10-12 09:12:00 +0530
categories: guide rx-stomp ng2-stompjs
redirect_from:
    - /guide/rx-stomp/ng2-stompjs/2018/10/11/remote-procedure-call.html
    - /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html
    - /guide/rx-stomp/ng2-stompjs/2018/10/13/remote-procedure-call.html
---

**This is an advanced topic.
You may choose to understand the philosophy by reading the initial sections,
or, you may just skip to the [usage](#usage) sections which is not complicated.**

Messaging usually works one way.
There is however a convention for two way communication (i.e. request/response).
This involves `reply-to` queues which routes the response back to correct client program
and `correlation-id` to uniquely match a response to the correct request.

See: [https://www.rabbitmq.com/tutorials/tutorial-six-python.html]
(https://www.rabbitmq.com/tutorials/tutorial-six-python.html)
for a sample using a very similar approach.

See sample RPC servers and clients at: 
[https://github.com/stomp-js/samples/]

## Why RPC using messaging

REST calls using JSON encoded payloads over http(s) is quite popular.
These have become almost ubiquitous and supported by variety of frameworks
and have become most common technique to access third party APIs.

There are, however, some limitations with REST/JSON/http(s) approach:

- http(s) can only wait for finite time before timing out.
  Typically for long running operations as an alternative a request will be submitted
  and the client will keep polling to check if results are ready.
- There are some other interesting scenarios where the request to submitted to process A,
  however, the final response is better handled by process B.
  REST/JSON/http(s) will mandate that B communicates back to A which then intimates the client.
  This scenario is quite common in credit card processing.
- As an extension to the long running tasks, there is no easy way to intimate the client of the
  progress of the task.
- We have gone accustomed to the overheads of REST/JSON/http(s) approach.
  However, if you think about it for every request there is connection setup (including TLS/SSL)
  before a request is made.

The approach suggested in this guide solves all of the above issues/patterns.
On top of that it offers some interesting bonus as well:

- It offers *natural* load balancing. Spring up a new server and that's it.
  No need to inform the load balancer or anything similar. Yes really!
- Even more - this form of load balancing automatically takes care of fast and slow
  instances.
- It allows fault tolerance - if a process dies before completing,
  it would be submitted again (to other node or the same node).
- If there are no servers available when a request is made, these can be queued
  till a server springs up.
- It offers a mechanism where a server may indicate a temporary failure while processing
  a request.
  This will allow the request to be resubmitted for processing again.

The samples at [https://github.com/stomp-js/samples/] demonstrate most of the above.

## Usage

This feature will work with `@stomp/rx-stomp` and `@stomp/ng2-stompjs`.

While working with Angular (`@stomp/ng2-stompjs`) if you need classes to be
injected as dependencies, you should use following equivalent classes:

- [RxStomp] --> [RxStompService]
- [RxStompRPC] --> [RxStompRPCService]
- [RxStompRPCConfig] --> [InjectableRxStompRpcConfig]

## Implementing the RPC server endpoint

All code snippets are from [https://github.com/stomp-js/samples/].

This can be implemented in any language, in most cases it will be there in some backend server.

```typescript
    // Destination is RabbitMQ specific, change as per your environment
    const rpcEndPoint = '/amq/queue/integer-addition';

    // We will implement an endpoint
    // This endpoint will wait for random period before responding to simulate real RPC servers
    rxStomp.watch(rpcEndPoint).subscribe(function (request) {
      console.log("RPC Server: Request: " + request.body);
      // The response needs to be sent back here, it can safely be inlined
      const replyTo = request.headers['reply-to'];

      // Same correlation id needs to be sent back as message header, it can safely be inlined
      const correlationId = request.headers['correlation-id'];

      // simulate a random delay while computing
      setTimeout(function () {
        // Process the request, compute the response
        const operands = JSON.parse(request.body);
        const result = {result: Number.parseInt(operands.x) + Number.parseInt(operands.y)};
        // Completed processing

        const responseBody = JSON.stringify(result);

        console.log("RPC Server: Response: " + responseBody + " for " + request.body);
        // Send the response back to destination `replyTo` with `correlation-id` header
        rxStomp.publish({
          destination: replyTo,
          body: responseBody,
          headers: {'correlation-id': correlationId}
        });
      }, randomInt(10000));
```

A very similar server in Ruby (it is single threaded blocking server):

```ruby
amqp_conn = Bunny.new
amqp_conn.start

channel = amqp_conn.create_channel

# Notice that RabbitMQ STOMP adaptor maps queue/exchange names
queue = channel.queue("integer-addition")

queue.subscribe(block: true) do |delivery_info, metadata, payload|
  puts "Received: #{payload}"

  # Process the request, compute the response
  operands = JSON.parse(payload)
  result = {result: operands['x'].to_i + operands['y'].to_i}
  response_body = result.to_json
  # Completed processing

  puts "RPC Server: Response: #{response_body} for #{payload}"

  default_exchange = channel.default_exchange

  default_exchange.publish response_body, routing_key: metadata[:reply_to], correlation_id: metadata[:correlation_id]
end
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

See [https://github.com/stomp-js/samples/] for a sample client.

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

## Where to Next

In [Why RPC using messaging](#why-rpc-using-messaging), few additional benefits
like reporting progress, fault tolerance etc. are discussed.

There are samples which cover some of these patterns:

- Multi-threaded Ruby server.
- Manual acknowledgement - it will cause retry in case of failure.
- Factoring out boiler-plate server code.
- Implementing server/client using [RxStompRPC#stream] to report progress.

If you have questions or you will like to see more guides please raise an issue at
[https://github.com/stomp-js/rx-stomp/issues](https://github.com/stomp-js/rx-stomp/issues).



[RxStomp]: /api-docs/latest/classes/RxStomp.html
[RxStomp#publish]: /api-docs/latest/classes/RxStomp.html#publish
[RxStompService]: /api-docs/latest/injectables/RxStompService.html
[RxStompRPC]: /api-docs/latest/classes/RxStompRPC.html
[RxStompRPCService]: /api-docs/latest/injectables/RxStompRPCService.html
[RxStompRPCConfig]: /api-docs/latest/classes/RxStompRPCConfig.html
[InjectableRxStompRpcConfig]: /api-docs/latest/injectables/RxStompRPCService.html
[RxStompRPC#stream]: /api-docs/latest/classes/RxStompRPC.html#stream
[https://github.com/stomp-js/samples/]: https://github.com/stomp-js/samples/
