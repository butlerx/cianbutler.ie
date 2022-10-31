---
title: FOSDEM 2019
date: 2019-02-09T21:11:41+01:00
author: butlerx
description: Notes and thoughts from FOSDEM 2019
tags:
  - FOSDEM
  - Notes
audio: []
images: []
series: []
videos: []
---

FOSDEM took place over 2 days and contained a staggering amount of talks, with
over 408 hours of content and 600 speakers and 660
[tshirts](https://dashboard.fosdem.org/d/000000006/available-swag?orgId=1&from=1549094400000&to=1549220400000).
All the talks are recorded and can be found on the
[schedule](https://fosdem.org/2019/schedule/). Some of the good talks I managed
to get to are below. (if the video isn't uploaded yet sorry they try to get them
up as quick as possible)

## [Can Anyone Live in Full Software Freedom Today?](https://fosdem.org/2019/schedule/event/full_software_freedom/) - [Bradley M. Kuhn](https://fosdem.org/2019/schedule/speaker/bradley_m_kuhn/), & [Karen Sandler](https://fosdem.org/2019/schedule/speaker/karen_sandler/)

TL;RD; it's hard unless you want to go to the bank every day A nice talk on what
its like to try to live a full foss live and the issues you tun in to.

## [Blockchain: The Ethical Consideration](https://fosdem.org/2019/schedule/event/blockchain_ethics/) - [Deb Nicholson](https://fosdem.org/2019/schedule/speaker/deb_nicholson/)

Short term choices have long term consequences. In this talk, the speaker goes
over considerations of the choices we are making now in cryptocurrency and what
that could mean for the future. Owning 30% of nodes owns the network, what if
its backed by the state, do they own the country now.

## [Structured Concurrency](https://fosdem.org/2019/schedule/event/structured_concurrency/) - [Martin Sustrik](https://fosdem.org/2019/schedule/speaker/martin_sustrik/<Paste>)

This was a short lighting talk, but quite fun. The speaker talks about how Go
coroutines may just be the modern version of the goto and why that dangerous.

## [DNS over HTTPS](https://fosdem.org/2019/schedule/event/dns_over_http/) - [Daniel Stenberg](https://fosdem.org/2019/schedule/speaker/daniel_stenberg/)

DNS is 35 years old and still in clear text. This speaker goes over the basics
of what is DNS over https, as well as a few of its alternatives, and why its
needed.

## [Netfix & FreeBSD](https://fosdem.org/2019/schedule/event/netflix_freebsd/) - [Jonathan Looney](https://fosdem.org/2019/schedule/speaker/jonathan_looney/)

Netflix talked about their CDN, Open Connect, serving 100Tb/s of traffic at
peak. They discussed how they built their boxes with the shelf hardware and open
source software. Using FreeBSD HEAD and commodity parts, they got 90Gb/s serving
tls encrypted connections with ~55% CPU usage on 16 core 2.6 GHz CPUs.

## [Whats new grafana 6.0](https://fosdem.org/2019/schedule/event/grafana_6/) [Carl Bergquist](https://fosdem.org/2019/schedule/speaker/carl_bergquist/)

This was an impromptu talk that became a Q&A, lots of good questions. Grafana 6
is coming 6th of March with lots of new features, including improved panel
creation, and the explore panel for looking into metrics, and improved alerting.
As well a hint at what to expect in grafana 7

## [Critical Path Analysis](https://fosdem.org/2019/schedule/event/critical_path_analysis/) - [Jaana Dogani](https://fosdem.org/2019/schedule/speaker/jaana_dogan_jbd/)

Distributed systems are hard, and having just one person that understands them
is bad. The Speaker posits that docs aren't the answer but tooling that allows
you to visualise critical paths. She goes on to talk about how such systems
should be dynamic and debuggable and why this is an important problem that needs
to be solved.

## [On Observability Observability 101](https://fosdem.org/2019/schedule/event/on_observability_2019/) - [Richard Hartmann](https://fosdem.org/2019/schedule/spe/richard_hartmann/)

This is a great detailed introduction and overview of monitoring. It's a lot of
info [explained](explained) very well.

## [Prometheus for logs](https://fosdem.org/2019/schedule/event/loki_prometheus_for_logs/) - [Tom Wilkie](https://fosdem.org/2019/schedule/speaker/tom_wilkie/)

An overview of Loki, grafanas new logging solution. It's still in super Alpha,
but the speaker covers how it works how they used Prometheus as a base,
`sed '%s/timeSeries/logStream/g`, and the features that gives them, such as
being able to use Prometheus discovery to discover logs. It even contains a demo
of him using Prometheus, Loki and grafana 6 to investigate Grafana Labs
production errors.

## [Latency SLOs done right](https://fosdem.org/2019/schedule/event/latency_slos_done_right/) - [Heinrich Hartmann](https://fosdem.org/2019/schedule/speaker/heinrich_hartmann/)

What is an SLO and why latency matters. This talk goes into what makes a good
SLO and how to calculate it. He covers a couple of ways to calculate, as well as
the flaws in mosts. Good information if you're interested in SLO.

## [Crostini: A Linux Desktop on ChromeOS](https://fosdem.org/2019/schedule/event/crostini/) - [Guido Trotter](https://fosdem.org/2019/schedule/speaker/guido_trotter/), [Dylan Reid](https://fosdem.org/2019/schedule/speaker/dylan_reid/)

Google goes over some of the features of their new Linux env on ChromeOS
including, native google drive support and how they built Linux on
ChromeOS(Linux on Linux). Interesting tech used to provide a memory safe
read-only VM for running LXD containers.

## [FOSDEM infrastructure review](https://fosdem.org/2019/schedule/event/fosdem_infrastructure/) - [Richard Hartmann](https://fosdem.org/2019/schedule/speaker/richard_hartmann/)

A review of running the conference this year, it's short and fun when you there,
you may enjoy it in review

## [2019 - Fifty years of Unix and Linux advances](https://fosdem.org/2019/schedule/event/keynote_fifty_years_unix/) - [Jon 'maddog' Hall](https://fosdem.org/2019/schedule/speaker/jon_maddog_hall/)

A lot has happened in tech in the last 50 year. In this talk, we take a look
back at what things looked like 50 years ago and how they've changed in that
time. This was a fun talk and a good way to end the conference
