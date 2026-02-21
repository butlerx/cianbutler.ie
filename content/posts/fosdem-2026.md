---
title: 'FOSDEM 2026: Building performance-critical Python tools with Rust'
date: 2026-02-01T13:00:00+01:00
author: butlerx
description:
  My talk at FOSDEM 2026 on building performance-critical Python tools with Rust, lessons from production at Cloudsmith
tags:
  - FOSDEM
  - Rust
  - Python
  - Performance
audio: []
images: []
series: []
videos: []
---

I gave a talk at [FOSDEM 2026](https://fosdem.org/2026/) in the
[Rust devroom](https://fosdem.org/2026/schedule/track/rust/) on building performance-critical Python tools with Rust.

Python dominates web development, but often comes with performance and scaling issues. Recently, the Python ecosystem
has seen massive performance gains from projects written in Rust, such as `uv` and `ruff`. At
[Cloudsmith](https://cloudsmith.com), we achieved 2x throughput on our 10-year-old Django monolith by integrating
Rust-based tools and contributed features back upstream.

The talk covers our methodology: establishing performance baselines through load testing, identifying bottlenecks, and
integrating existing Rust-based tools with minimal code changes. We also share our experience contributing observability
features upstream to [Granian](https://github.com/emmett-framework/granian), ensuring production-ready monitoring that
benefits the entire community.

[Slides](https://butlerx.github.io/presentation/slides/rust-building-performance-critical-python-apps/#/)

<video controls preload="metadata" width="100%">
  <source src="https://video.fosdem.org/2026/ub2252a/RCFALN-rust-building-performance-critical-python-apps.av1.webm" type="video/webm; codecs=av01.0.08M.08">
  <source src="https://video.fosdem.org/2026/ub2252a/RCFALN-rust-building-performance-critical-python-apps.mp4" type="video/mp4">
  Your browser does not support the video element.
</video>
