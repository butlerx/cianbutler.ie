---
title: Intro to Docker
description: An introduction to using docker for redbrick admin talks
tags: [redbrick, docker]
layout: slides
date: 2020-02-05T11:25:00Z
slideOptions:
  theme: redbrick
---

## Docker: The Cloud in a box

---

## You want to get on the cloud?

===

![There is No Cloud](https://i.imgur.com/WO3P9w2.png)

---

## Containers

===

![container](https://i.imgur.com/mwFYmzx.jpg)

===

### Containers

- What is it
- How is it different to VM?
- LXC vs Docker

===

### Docker

- Well Documented<!-- .element: class="fragment" data-fragment-index="1" -->
- Lots of tools<!-- .element: class="fragment" data-fragment-index="2" -->
  - Docker-compose<!-- .element: class="fragment" data-fragment-index="3" -->
  - aws & google
    cloud<!-- .element: class="fragment" data-fragment-index="4" -->

---

# Running Docker

```bash
docker run --name my-nginx\
-v /etc/docker-configs/my-nginx/nginx.conf:/etc/nginx/nginx.conf:ro\
-d nginx
```

===

### What Does this do

- Pulls from [hub.docker.com](https://hub.docker.com)
- Start the container
- Name it
- And Create Volume

===

### What did he just say?

`docker pull` `docker run` Volumes

---

### This seems complicated

because it kind of is<!-- .element: class="fragment" data-fragment-index="1" -->

### Is there a better way?<!-- .element: class="fragment" data-fragment-index="2" -->

Yes Docker-compose<!-- .element: class="fragment" data-fragment-index="3" -->

===

### Docker Compose

```bash
docker-compose up
```

===

### That simple?

Not really Lets have a look at the docker-compose.yml

===

```yamlversion: '2'
services:
  nginx:
    image: nginx
    container_name: nginx
    restart: 'always'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - '/etc/nginx/conf.d:/etc/nginx/conf.d'
      - '/etc/nginx/vhost.d:/etc/nginx/vhost.d'
      - '/usr/share/nginx/html'
      - '/etc/nginx/ssl:/etc/nginx/certs:ro'

  nginx-gen:
    image: jwilder/docker-gen
    container_name: nginx-gen
    restart: 'always'
    volumes:
      - '/var/run/docker.sock:/tmp/docker.sock:ro'
      - './nginx.tmpl:/etc/docker-gen/templates/nginx.tmpl:ro'
    volumes_from:
      - nginx
    entrypoint: /usr/local/bin/docker-gen -notify-sighup nginx -watch -wait 5s:30s /etc/docker-gen/templates/nginx.tmpl /etc/nginx/conf.d/default.conf

  letsencrypt-nginx-proxy-companion:
    image: jrcs/letsencrypt-nginx-proxy-companion
    container_name: letsencrypt-nginx-proxy-companion
    volumes_from:
      - nginx
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
      - '/etc/nginx/ssl:/etc/nginx/certs:rw'
    environment:
      - NGINX_DOCKER_GEN_CONTAINER=nginx-gen

  landing-page:
    image: nginx
    container_name: landing-page
    restart: 'always'
    volumes:
      - '/var/www/main:/usr/share/nginx/html'
    environment:
      VIRTUAL_HOST: 'mycoolsite.com'
      VIRTUAL_PORT: 80
      VIRTUAL_NETWORK: nginx-proxy
      LETSENCRYPT_HOST: 'mycoolsite.com'
      LETSENCRYPT_EMAIL: 'username@redbrick.dcu.ie'

  plex:
    image: plexinc/pms-docker
    container_name: 'plex'
    restart: 'always'
    ports:
      - '32400:32400'
    environment:
      VIRTUAL_HOST: 'plex.mycoolsite.com'
      VIRTUAL_PORT: 32400
      VIRTUAL_NETWORK: nginx-proxy
      LETSENCRYPT_HOST: 'plex.mycoolsite.com'
      LETSENCRYPT_EMAIL: 'username@redbrick.dcu.ie'
      PLEX_UID: 0
      PLEX_GID: 0
      TZ: 'Europe/Dublin'
      VERSION: 'latest'
      PLEX_CLAIM: ''
    volumes:
      - '/etc/docker-compose/services/plex/config:/config'
      - '/var/tv:/tv'
      - '/var/plex:/plex'
      - '/var/movies:/movies'
      - '/var/downloads:/downloads'
      - '/var/transcode:/transcode'
  nextcloud:
    image: wonderfall/nextcloud
    restart: 'always'
    container_name: nextcloud
    hostname: next.mycoolsite.com
    environment:
      - VIRTUAL_HOST=next.mycoolsite.com
      - VIRTUAL_PORT=8888
      - VIRTUAL_NETWORK=nginx-proxy
      - LETSENCRYPT_HOST=next.mycoolsite.com
      - LETSENCRYPT_EMAIL=username@redbrick.dcu.ie
      - UID=1000
      - GID=1000
      - UPLOAD_MAX_SIZE=10G
      - APC_SHM_SIZE=128M
      - OPCACHE_MEM_SIZE=128
      - REDIS_MAX_MEMORY=64mb
      - CRON_PERIOD=15m
      - TZ=Europe/Dublin
      - ADMIN_USER=root
      - ADMIN_PASSWORD=CHNAGEME
      - DB_NAME=nextcloud
      - DB_USER=nextcloud
      - DB_PASSWORD=CHNAGEMETOANITHERPW
      - DB_HOST=nextcloud-db
    volumes:
      - /var/nextcloud:/data
      - ./config:/config
      - ./apps:/apps2

volumes:
  nextcloud-db-data:

networks:
  default:
    external:
      name: nginx-proxy
```

===

### Demo

#### Lets do it live

---

### NAH We actually prepared guide is at [www.redbrick.dcu.ie/help/tutorials/admin-docker](https://www.redbrick.dcu.ie/help/tutorials/admin-docker)
