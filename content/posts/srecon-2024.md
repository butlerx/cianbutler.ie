---
title: SREcon EMEA 2024
date: 2024-10-31T18:00:00+00:00
description: Notes and thoughts from SREcon 2024 in Dublin
tags:
  - SREcon
  - Notes
---

## Introduction

At the end of October I attended SREcon EMEA 2024 in Dublin. This was the tenth anniversary of SREcon, and the
conference was held at the Convention Centre Dublin overlooking the Liffey.

These are my notes and references from the talks I attended. As always, I'd recommend watching the actual talks for the
full picture — my notes only capture what stuck with me on the day.

{{< toc >}}

## Tuesday, 29 October

### Dude, You Forgot the Feedback

> Laura de Vesine, Datadog —
> [Dude, You Forgot the Feedback: How Your Open Loop Control Planes Are Causing Outages](https://www.usenix.org/conference/srecon24emea/presentation/de-vesine)

What is it we actually do? SREs are people who specialise in building and using control planes — and we are terrible at
it.

How can we be better? Feedback loops.

A control plane manages the data plane and all the infrastructure beneath it. In an outage the problem is usually the
control plane, not the person operating it. The key question to ask is: how did the control plane lead you astray?

Bad feedback loops lead to longer production outages. A classic example: did your change actually go out? If you can't
tell, you're flying blind.

Keep the feedback in the same place as the action. Slack alerts are an anti-pattern — no one takes ownership, they're
bad at feedback, and people assume others are taking care of it.

Give feedback early. Don't just describe the input; show what the effect would be on prod. Show what a regex change
would actually match. Differentiate environments and ensure you're connected to the right one.

How do you ensure situational awareness?

- Have fewer engineers with prod access
- Use confirmation actions with situational context — e.g. type the name of the environment
- Validate the code against prod before applying

### You Depend on Time, This Is How It Works and You Won't Believe It

> Philip Rowlands, Jane Street —
> [You Depend on Time, This Is How It Works and You Won't Believe It](https://www.usenix.org/conference/srecon24emea/presentation/rowlands)

Many, many leap years and calendars. A history of time and how we keep track of it.

### Achieving Excellence: SLO Thresholds That Transform Service Quality

> Thiara Ortiz, Netflix —
> [Achieving Excellence: SLO Thresholds That Transform Service Quality](https://www.usenix.org/conference/srecon24emea/presentation/ortiz)

An overview of Netflix's system design and their approach to defining meaningful SLO thresholds.

### Why You're (Probably) Doing Service Catalogs Wrong

> Lisa Karlin Curtis, incident.io —
> [Why You're (Probably) Doing Service Catalogs Wrong](https://www.usenix.org/conference/srecon24emea/presentation/curtis)

"Love to see more people using it."

#### Why Build?

It's a list of things and a list of connections. You use it to collect data, determine who to page, and understand
what's connected.

#### What Makes It Hard?

Build vs buy is a massive information-gathering exercise. It's wide, it has lots of history, and you end up chasing
people and burning social capital. People think it's cool but don't use it.

#### How to Do Better?

**Unclear objectives.** Too many objectives, trying to be all things to everyone. Focus on the problem, not the solution
— but a catalog is very multi-faceted.

**Lack of buy-in.** People didn't want to fill in forms when the service wasn't shipped yet. Don't focus on the whole
company; focus on one team. Let them become part of the process and become champions.

**Data decay.** Data not being used becomes stale, and once it's stale it's dangerous. Displaying data is not the same
as using it — it needs to be actively queried in processes, and it needs to be easy to update.

#### Takeaway

Clarity is key. Start with a single team.

> One team that loves you is better than everyone knowing you exist.

Keep it always up to date. Make it easy to update. Ensure barriers are low.

### SRE Stakeholders: A Spotter's Guide

> Dave O'Connor —
> [SRE Stakeholders: A Spotter's Guide](https://www.usenix.org/conference/srecon24emea/presentation/oconnor)

Group therapy.

### Panel Discussion: Is Reliability a Luxury Good?

> Moderator: Emil Stolarsky, Increase; Panelists: Andrew Ellam, Niall Murphy, Joan O'Callaghan, Avleen Vig

FANGs cause hair loss.

## Wednesday, 30 October

### Lessons from Unix History

> Diomidis Spinellis, Athens University of Economics and Business & TU Delft —
> [Lessons from Unix History](https://www.usenix.org/conference/srecon24emea/presentation/spinellis)

A brief overview of Unix and the design principles that emerged from its history:

- Write small programs
- Build modular code by layer and partitioning
- Value developer time over machine time
  - Separation of file metadata from file naming
  - Devices as files, file I/O API
- Prototype software before polishing it
- Make each program do one thing and do it well
- Avoid captive interfaces
- Write extensible programs
  - Abstraction of I/O
- Write programs that work together as filters on text streams
  - e.g. pipe
- Write maintainable software
  - Language-independent API
  - Data structure definition and reuse
- Avoid unnecessary output and make failure easy to diagnose
  - Use stderr
- Use shell scripts to increase leverage and portability
- Choose appropriately powerful abstractions
- Separate mechanisms from policy
  - Dynamic user memory allocation
  - Static analysis
  - Environment variables
  - File system directory hierarchy
- Write abstract programs that generate code rather than writing code by hand
- Raise abstraction through DSLs
- Architectural innovations are sticky and face increasing resistance
  - Rate of decisions declines over time
- Package managers grow ecosystems and communities

### Treat Your Code as a Crime Scene

> Adam Tornhill, CodeScene —
> [Treat Your Code as a Crime Scene](https://www.usenix.org/conference/srecon24emea/presentation/tornhill)

Optimising for ease of understanding is a big win, but very hard. Intuition doesn't scale.

Who doesn't love Hannibal? But his techniques only work in the movies.

Geographical offender profiling works because criminals, most of the time, behave like us — shopping, school, work,
friends. Crime scenes are never random; they contain information about the criminal.

#### How to Use This in Code?

Code behaviour analysis combines code, people, and context from version control.

Use hotspots as a behavioural data source to prioritise technical debt. Hotspots are code that changes frequently; the
majority of the code is stable, low-interest code.

Not all dependencies are equal. Code changes for a reason: good coupling (unit tests evolve with the code, MVC updates
all the places it's used), bad coupling (god class where many modules depend on one).

Evaluate change coupling according to architecture. Unfamiliarity breeds risk.

- [Code Red: The Business Impact of Code Quality](https://arxiv.org/abs/2203.04374)

Eventually poor code quality collides with a low bus factor — the highway to legacy code.

Example: React's bus factor is 2, Vue.js's bus factor is 1. Estimated 70% of knowledge concentrated.

Code quality issues amplify organisational problems. Unhealthy code with a low bus factor is particularly dangerous.

- [On-boarding Costs in Unhealthy Code](https://arxiv.org/pdf/2304.11636.pdf)
- [CodeScene Code Health](https://codescene.com/code-health)

### Anomaly Detection in Time Series from Scratch Using Statistical Analysis

> Ivan Shubin —
> [Anomaly Detection in Time Series from Scratch Using Statistical Analysis](https://www.usenix.org/conference/srecon24emea/presentation/shubin)

An overview of standard deviation and z-score for anomaly detection.

#### Z-Score Drawbacks

Too sensitive to small deviations, not practical for alerting.

They built Granomaly to read multiple Graphite sources, do the maths, and produce Graphite metrics. Compared each series
to itself in the previous week, using the 95th percentile to remove outliers.

They also built a simulator to test metrics — to see what threshold values are needed and whether the time series would
work for a given metric.

#### Problems

- Excluding past incidents or distortions in the graph can skew the window in the wrong direction
- Daylight savings
- When you over-perform
- Known events: weekends, holidays
- Complexity of queries — they built a query builder library in JavaScript to automate dashboard generation

### Generative AI: Beyond the Hype

> Todd Underwood —
> [Generative AI: Beyond (Just) Hype](https://www.usenix.org/conference/srecon24emea/presentation/underwood)

We've been sold so many things. "AI will run all the computers."

What they're bad at:

- Root cause analysis
- Being cost-effective

What they're good at:

- Coding — helpful, but requires expertise in the language and program domain to ensure they're doing the right thing
- Bureaucracy: performance reviews, job descriptions
- Knowledge base search — train models on docs, chat logs, all code. Simple way to ask questions. Speeds up onboarding
  and debugging
- Document summarisation — but needs to be checked
- Code and config auditing

Might get better with agents.

### Noisy Neighbors, through Networking

> René Treffer and Ben Kochie, Reddit —
> [Noisy Neighbors, through Networking](https://www.usenix.org/conference/srecon24emea/presentation/treffer)

Reddit had Telegraf and StatsD. They removed the service that Telegraf wrote to, so it went to /dev/null. UDP kept
writing and the system just couldn't handle all the UDP overhead.

The service auto-scaled up, which triggered a cluster scale-up, resulting in single-tenant nodes.

All cores were pinned — each pod pinned to 5 CPUs, leaving no cores to process network traffic.
`netdev_max_backlog >> 1000`. The service was configured to only use 4 CPUs. Not all CPU was being used as the network
took CPU processing time. The kernel couldn't move tasks due to pinning — unlucky core pick.

Conntrack issues followed: a Kubernetes AMI update introduced an undetected config change. The 1M conntrack limit was
too low. A Kubernetes upgrade triggered a node rollover which exposed a bugfix in kube-proxy.

#### What Now?

Optimise connections: keep track of connection lifetime (×2). Use client-side load balancing with gRPC. How many
requests do you do per connection?

Removed CPU pinning and set `GOMAXPROCS` to match the CPU request.

Turned off StatsD.

Enabled Receive Packet Steering, thread IRQs, or `IRQ_TIME_ACCOUNTING`.

CPU costs in iptables exceeded 4000 cores. eBPF cut that cost in half.

### Configuration Languages Are the Bane of Our Existence

> Paul Komkoff —
> [Configuration Languages Are the Bane of Our Existence](https://www.usenix.org/conference/srecon24emea/presentation/komkoff)

### Enabling Product Scalability through Load Testing

> Monica Baluna and Ehab Tawfik, Bloomberg —
> [Enabling Product Scalability through Load Testing](https://www.usenix.org/conference/srecon24emea/presentation/baluna)

## Thursday, 31 October

### Get Your Non-SREs Oncall Ready

> JC van Winkel and Brad Lipinski, Google —
> [Get Your Non-SREs Oncall Ready!](https://www.usenix.org/conference/srecon24emea/presentation/van-winkel)
