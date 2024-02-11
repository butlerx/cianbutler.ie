---
title: Observability, is it a buzz word or something you should care about
description: >-
  Cian is an SRE for demonware's data pipeline team working on metrics, logs and
  game events systems. In the talk he be going in to Observability and what it
  is. He will talk about why you should care about observability in your
  programs and how to use it.
author: Cian Butler <butlerx@notthe.cloud>
link: github.com/butlerx
layout: slides
date: 2020-02-20T11:25:00Z
---

### Observability, is it a buzz word or something you should care about

Note:

- Who's heard of Observability?
- Who am I.
- Why I'm talking about Observability

===

# Yes

## But Actually No

Note:

Yes Observability is a bit of a buzz word but it is actually very important to
understanding what your application is doing in a production environment.

---

## What is Observability?

Observability is a term from control theory.

> In control theory, observability is a measure of how well internal states of a
> system can be inferred by knowledge of its external outputs. The observability
> and controllability of a system are mathematical duals. -
>
> - Wikipedia "observability"

Note:

Well this is quite a dry explanation so what is observability in the real tech?
Observability is about being able to understand what is happening in a
production system.

---

## How to Observe production

- Code compiled
- Passed all tests
- Worked on your laptop
- You deployed to prod

**Now what?**

Note:

Story Time:

- We have a http server on a server in the nebulous cloud
- how many requests is it getting?
- how much data is in it?
- is it having errors?
- is it even still up?

---

## Check the logs

- What do we search for?
- Can you search, k8s?
- What Server are those logs on?

Note:

- You ssh to a server
- You grep the logs
- You wc your grep

or your lucky you've central logs

===

## Understanding the logs

I can see my log but I dont know whats happening

Logs from WeTTy Version 0.5.0

```bash
Tue Feb 18 2020 12:55:02 GMT+0000 (UTC) Connection accepted.
Tue Feb 18 2020 12:55:02 GMT+0000 (UTC) PID=73 STARTED on behalf of user localhost
disconnect
Tue Feb 18 2020 13:42:08 GMT+0000 (UTC) PID=73 ENDED
exit with code: 0
Tue Feb 18 2020 16:06:51 GMT+0000 (UTC) Connection accepted.
Tue Feb 18 2020 16:06:51 GMT+0000 (UTC) PID=85 STARTED on behalf of user localhost
Tue Feb 18 2020 16:49:35 GMT+0000 (UTC) Connection accepted.
Tue Feb 18 2020 16:49:35 GMT+0000 (UTC) PID=97 STARTED on behalf of user localhost
```

===

## Structured Logs to the rescue

Logs from WeTTy Version 1.3.1

```json
{
  "port":3000,
  "base":"/wetty/",
  "title":"WeTTy - The Web Terminal Emulator",
  "level":"info",
  "message":"Starting server",
  "label":"Wetty",
  "timestamp":"2020-02-18T17:55:43.841Z"
}
{"port":3000,"connection":"http","level":"info","message":"Server started","label":"Wetty","timestamp":"2020-02-18T17:55:43.865Z"}
{"message":"Connection accepted.","level":"info","label":"Wetty","timestamp":"2020-02-18T17:55:47.686Z"}
{"message":"Authentication Type: password","level":"info","label":"Wetty","timestamp":"2020-02-18T17:55:47.688Z"}
{
  "pid":4038178,
  "address":"butlerx@localhost",
  "level":"info",
  "message":"Process Started on behalf of user",
  "label":"Wetty",
  "timestamp":"2020-02-18T17:55:54.410Z"
}
{"code":255,"pid":4038178,"level":"info","message":"Process exited","label":"Wetty","timestamp":"2020-02-18T17:55:54.433Z"}
```

===

## So Why JSON Logs

- No Special parsing
- Understood by everyone
- Search on key value
- Can use traditional log messages mixed with structured data

Refs:

- https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html
- https://docs.timber.io/guides/structured-logging-best-practices

---

### So lets quantify things

Graphite Tagged metric format

```
service.events_count;state=active;backend=mysql;env=prod 8.0 1582136043
service.events_count;state=completed;backend=mysql;env=prod 14.0 1582136043
service.events_count;state=scheduled;backend=mysql;env=prod 90.0 1582136043
service.build_info;branch=master;goversion=go1.13.4;version=6.5.1 1 1582136043
```

Note: Known Questions you want to ask the service Metrics Allow you to produce
Known State of your system at a specific time. These can be used to:

- see is a system healthy
- alert on
- notice trends in graphs, determine how users interface with the system.

---

## Demo time

### PSA

There are other metrics and logging systems.

**using**: prometheus, loki and grafana

**code**: github.com/butlerx/metrics-logs-demo

---

# Questions?

===

### Demonware

```text
                 D8888D         ZI8                 8IZ
                 7****7         ?**I8             8I**?
                 7*??*7         7*?**78         87**?*$
                 7*??*7          $?***?D       D?***?$
                 7*??*7            DDN           NDD
                 7*??*7
       8Z$777$OD $*??*7    8O8N                         N8O8
    N$?*********7I*??*7    D**??7N       88888       NI??**D
   O?*????****??*????*7     7*??*Z      O*****O      Z*??*7
  Z*????*?7ZZ$I*?????*7     8*???I     N???????N     ????*8
 D*?????O      8?????*7      I*??*O    $*?????*$    O*??*I
 7*????D        D????*7      O*??*I   8*???*???*D   I*??*O
 ????*7          7*??*7      N????*8  I*???Z???*I  8*????
 ????*$          7*??*7       $*??*7 Z*??*$ $*??*O I*??*$
 I*????          ????*7       D*????Z?????N N?????Z????*D
 O*???*IN      N7*???*7        7*???*???*Z   Z*???*???*7
  7*???*?7O88O$?*????*7        8*????????    N????????*8
   $**???******??*???*7         I??????*O     Z*??????I
    8I***?????**I$?*?*7         Z*?**?*I       ?*?**?*Z
      DZ7I???I$O  $III$         NIIIIII8       8IIIIIIN
```

#### We have internships

Emails: jobs@demonware.net

Note: c, python interships
