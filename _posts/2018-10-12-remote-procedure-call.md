---
layout: single
title: 'RPC - Remote Procedure Call'
date: 2018-10-12 09:12:00 +0530
categories: guide rx-stomp
toc: true
redirect_from:
  - /guide/rx-stomp/ng2-stompjs/2018/10/11/remote-procedure-call.html
  - /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html
  - /guide/rx-stomp/ng2-stompjs/2018/10/13/remote-procedure-call.html
  - /guide/rx-stomp/ng2-stompjs/remote-procedure-call.html
---

**This is an advanced topic.
You may choose to understand the philosophy by reading the initial sections,
or, you may just skip to the [usage](#usage) sections which are not complicated.**

Messaging usually works one way.
There is, however, a convention for two-way communication (i.e. request/response).
This involves `reply-to` queues which routes the response back to correct client program
and `correlation-id` to uniquely match a response to the correct request.

See: [https://www.rabbitmq.com/tutorials/tutorial-six-python.html]
(https://www.rabbitmq.com/tutorials/tutorial-six-python.html)
for a sample using a very similar approach.

See sample RPC servers and clients at:
[https://github.com/stomp-js/samples/]

## Why RPC using messaging

REST calls using JSON encoded payloads over http(s) are quite popular.
These have become almost ubiquitous and supported by a variety of frameworks
and have become the most common technique to access third party APIs.

There are, however, some limitations with REST/JSON/http(s) approach:

- http(s) can only wait for finite time before timing out.
  Typically, for long-running operations as an alternative a request will be submitted
  and the client will keep polling to check if results are ready.
- There are some other interesting scenarios where the request is submitted to process A.
  However, the final response is better handled by process B.
  REST/JSON/http(s) will mandate that B communicates back to A which then intimates the client.
  This scenario is quite common in credit card processing.
- As an extension to the long-running tasks, there is no easy way to intimate the client about the
  progress of the task.
- We have gotten accustomed to the overheads of the REST /JSON/http(s) approach.
  However, for every request, there is connection setup (including TLS/SSL)
  before a request is made.

The approach suggested in this guide solves all of the above issues/patterns.
On top of that, it offers some interesting bonus as well:

- It offers _natural_ load balancing. Just boot up a new servers.
- Even more — this form of load balancing automatically takes care of fast and slow
  instances.
- It allows fault tolerance — if a process dies before completing,
  it would be submitted to another node.
- If there are no servers available when a request is made, these can be queued
  till a server becomes available.
- It offers a mechanism where a server may indicate a temporary failure while processing
  a request.
  This will allow the request to be resubmitted for processing again.

The samples at [https://github.com/stomp-js/samples/] demonstrate most of the above.

## Usage

This feature will work with `@stomp/rx-stomp`.

## Implementing the RPC server endpoint

All code snippets are from [https://github.com/stomp-js/samples/].

This can be implemented in any language. In most cases, it will be executed in a backend server.

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

A very similar server in Ruby (it is a single-threaded blocking server):

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
which make things to work magically. Please check details at
[https://www.rabbitmq.com/stomp.html#d.tqd](https://www.rabbitmq.com/stomp.html#d.tqd)

The client code looks simple and similar to JSON and HTTP-based backend services.

Create an instance of [RxStompRPC],
you will need an instance of [RxStomp] in the constructor:

```typescript
const rxStompRPC = new RxStompRPC(rxStomp);
```

Making the RPC call is simple, takes same parameters as [RxStomp#publish]
and returns an `Observable` which will trigger once.

```typescript
const myServiceEndPoint = '/topic/echo';

const request = 'Hello';
// It accepts a optional third argument a Hash of headers to be sent as part of the request
rxStompRPC
  .rpc({ destination: myServiceEndPoint, body: request })
  .subscribe((message: Message) => {
    // Consume the response
    console.log(message.body);
  });
```

You can notice similarity with Angular HTTP calls.

See [https://github.com/stomp-js/samples/] for a sample client.

### Other Brokers

There are few requirements:

- the reply queue name **must** be unique across the broker.
- ideally, for security reasons, only the client creating the queue should have access to it.

Many brokers have `temp-queue` concept which should simplify your work.

The following gives an outline:

```typescript
const stompRPCConfigForActiveMQ = {
  // A unique name, BTW angular2-uuid module is already added as dependency
  replyQueueName: `/topic/replies.${UUID.UUID()}`,

  // Simply subscribe, you would need to secure by adding broker specific options
  setupReplyQueue: (replyQueueName: string, stompService: StompRService) => {
    return stompService.subscribe(replyQueueName);
  },
};
```

Apart from this additional setup step usage remains the same as RabbitMQ as documented above.

## What Next

In [Why RPC using messaging](#why-rpc-using-messaging), few additional benefits
like reporting progress, fault tolerance etc. are discussed.

There are samples which cover some of these patterns:

- Multithreaded Ruby server.
- Manual acknowledgement — it will retry in case of failure.
- Factoring out boilerplate server code.
- Implementing server/client using [RxStompRPC#stream] to report progress.

If you have questions, or you would like to see more guides, please raise an issue at
[https://github.com/stomp-js/rx-stomp/issues](https://github.com/stomp-js/rx-stomp/issues).

[rxstomp]: /api-docs/latest/classes/RxStomp.html
[rxstomp#publish]: /api-docs/latest/classes/RxStomp.html#publish
[rxstompservice]: /api-docs/latest/injectables/RxStompService.html
[rxstomprpc]: /api-docs/latest/classes/RxStompRPC.html
[rxstomprpcservice]: /api-docs/latest/injectables/RxStompRPCService.html
[rxstomprpcconfig]: /api-docs/latest/classes/RxStompRPCConfig.html
[injectablerxstomprpcconfig]: /api-docs/latest/injectables/RxStompRPCService.html
[rxstomprpc#stream]: /api-docs/latest/classes/RxStompRPC.html#stream
[https://github.com/stomp-js/samples/]: https://github.com/stomp-js/samples/
