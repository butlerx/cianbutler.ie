---
title: 'FOSDEM 2024: The ups and downs of running enclaves in production'
date: 2024-02-04T14:55:00+01:00
author: butlerx
description:
  My talk at FOSDEM 2024 on running enclaves in production, lessons from scaling confidential computing at Evervault
tags:
  - FOSDEM
  - Enclaves
  - Confidential Computing
  - Security
audio: []
images: []
series: []
videos: []
---

I gave a talk at [FOSDEM 2024](https://archive.fosdem.org/2024/) in the
[Confidential Computing devroom](https://archive.fosdem.org/2024/schedule/track/confidential-computing/) on the ups and
downs of running enclaves in production.

At [Evervault](https://evervault.com) we'd been running production workloads in enclaves for 3 years and built a
platform to allow others to onboard and use enclaves easily. The talk covers our experience scaling enclaves and how we
load-tested them to optimise our workloads.

I also covered how we built [Evervault Enclaves](https://evervault.com/primitives/enclaves) to allow others to leverage
what we learned to deploy and use enclaves more easily — a secure, attestable working environment.
[Evervault Enclaves](https://github.com/evervault/enclaves/) allows developers to easily deploy Docker containers to a
Secure Enclave without the engineering overhead to leverage fully attestable connections to their backend.

[Slides](https://butlerx.github.io/presentation/slides/EnclavesInProd/#/)

<video controls preload="metadata" width="100%">
  <source src="https://video.fosdem.org/2024/h2214/fosdem-2024-2317-the-ups-and-downs-of-running-enclaves-in-production.av1.webm" type="video/webm; codecs=av01.0.08M.08">
  <source src="https://video.fosdem.org/2024/h2214/fosdem-2024-2317-the-ups-and-downs-of-running-enclaves-in-production.mp4" type="video/mp4">
  Your browser does not support the video element.
</video>
