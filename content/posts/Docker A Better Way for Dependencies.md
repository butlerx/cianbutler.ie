---
title: Docker A Better Way for Dependencies
description: Techweek talk on using docker for dependencies
tags: [techweek, docker, redbrick]
layout: slides
date: 2020-02-05T11:25:00Z
slideOptions:
  theme: redbrick
---

### Docker: A Better Way for Dependencies

---

### What I want to talk about

- What is Docker<!-- .element: class="fragment" data-fragment-index="1" -->
- What it gives you as a
  developer<!-- .element: class="fragment" data-fragment-index="2" -->
- And a Demo<!-- .element: class="fragment" data-fragment-index="3" -->

===

### What is Docker

The complicated part!

===

> A container image is a lightweight, stand-alone, executable package of a piece
> of software that includes everything needed to run it: code, runtime, system
> tools, system libraries, settings.

Note:

- This is long winded
- Show don't tell

===

![Docker Visulisation](https://i.imgur.com/njoGZ28.png =500x)

Note:

- This is a computer
- Each section is independent of each other
- THESE ARE NOT VM

---

### Why you should Care

===

#### Docker

- Don't need to install anything on your machine
- Can use conflicting versions
- No Clean Up
- Simple Script to build custom images

===

#### Docker Compose

- Scriptable Enviroments
  - Easily shared
  - Easily changed
- Simple commands

---

## Demo

===

### Docker Command

```bash
docker run -it --rm --name redbrick\
SECRET_API_TOKEN='somethingThatMustChange'\
RECAPTCHA_SITE_KEY='redbrickIsGreat'\
RECAPTCHA_SECRET_KEY='totalySecretKey'\
LOG_ROTATE='24h'\
-p 3000:3000 redbrick/site
```

===

### Docker Compose

```yaml
version: '3'
services:
  redbrick:
    image: 'redbrick/site:latest'
    restart: 'always'
    ports:
      - '3000:3000'
    environment:
      SECRET_API_TOKEN: 'somethingThatMustChange'
      RECAPTCHA_SITE_KEY: 'redbrickIsGreat'
      RECAPTCHA_SECRET_KEY: 'totalySecretKey'
      LOG_ROTATE: '24h'
```

===

#### Try it live?

---

## Further Reading

- [docs.docker.com/compose/compose-file](https://docs.docker.com/compose/compose-file/)
- [hub.docker.com](https://hub.docker.com/)
- [docs.docker.com/engine/tutorials](https://docs.docker.com/engine/tutorials/)
- [video.fosdem.org](https://video.fosdem.org)

===

#### Questions?

![End with a cat](https://i.imgur.com/ysOewyR.jpg =250x)
