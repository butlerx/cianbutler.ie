---
title: Tracing 101 with OTEL and rust
description:
  Overview of tracing core concepts in opentelemetry and how to use them in rust
layout: slides
date: 2023-11-06T11:05:00Z
slideOptions:
  theme: evervault
---

## Tracing 101

### Opentelemtry and Rust tracing

Notes:

Overview on opentelemetry and rust tracing and how we can leverage them.

---

![Opentelemetry](https://opentelemetry.io/img/logos/opentelemetry-horizontal-color.svg)

===

## Traces

![traces are fancy logs](https://www.honeycomb.io/wp-content/uploads/2023/05/image-6.png)

<!-- source: honeycomb.io -->

- Unique Trace IDs for _1_ user action
  - shared across multiple services

===

## Spans

- Resource Attributes
  - shared by spans in a service
- Span Attributes
  - High Cardinality data for each span.
- Events
  - Gives us timing, and details inside the span

Notes:

- A trace is made up of multiple spans
  - Can be 1 span from every service or mutiple spans from 1 service
- Spans can be expensive to create and store so dont need to be created for
  every function

===

## Sampling

- We don't want traces for all events
  - That'd be expensive `$$$$$$$$$$`
- Sample rate should be representative of out users

Notes:

- We use 1% sampling by default.
- Trace headers are used to determine if the span is already samples

===

## Trace Headers

` traceparent` & `tracestate`

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  │                                │                │
version ◄────┘  │                                │                │
trace-id ◄──────┘                                │                │
parent-id  ◄─────────────────────────────────────┘                │
trace-flags (01 = sampled) ◄──────────────────────────────────────┘

tracestate: key=value,vendorname1=opaqueValue1,vendorname2=opaqueValue2
```

Notes:

- Used for propagation of the context between different services
- W3C standard on Trace Context

---

## Rust Tracing

[docs.rs/tracing](https://docs.rs/tracing/latest/tracing/)

===

## Events

```rust
use tracing::{event, info, Level};

// records an event outside of any span context:
event!(Level::INFO, "something happened");

info!(foo=blah, "something else happened")

info!(target:"otel::tracing", "Only exported to tracing")
```

Notes:

- Events are logged by default
- all events less then info are compiled out at release
- all events for target `otel::tracing` are only exported to opentelemetry

===

## Spans

```rust
use tracing::{span, Level};

let span = span!(Level::info, "my span");
// Enter the span, returning a guard object.
let _enter = span.enter();

let json = info_span!("json.parse").in_scope(||
    serde_json::from_slice(&buf)
)?;
// Any trace events that occur before the guard is
// dropped will occur within the span.

// Dropping the guard will exit the span.
```

Notes:

- spans will be in logs but details will be in otel
- can be manually entered or wrap callback

===

### Automatic Instrumentation

```rust
#[tracing::instrument]
pub fn my_function(my_arg: usize) {
    // This event will be recorded inside a span named `my_function`
    // with the field `my_arg`.
    info!("inside my_function!");
}
```

Notes:

- function arguments will be recorded. Ensure not to record user data.

---

### Otel semantic convention

[opentelemetry.io/docs/specs/semconv](https://opentelemetry.io/docs/specs/semconv/)

Notes:

- Semantic convention is a way make traces better understood in different
  backends.
- Is a suggestion on things to log/annotate events with and naming scheme
- otel names can be dynamic while tracings arnt so can be set as `otel.name` as
  the key in the span attribute.

---

## Demo

Lets looks at some dashboards

---

# Kweschens?
