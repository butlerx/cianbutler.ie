---
title: Static Webdesign
tags: [redbrick, hugo, static-webdesign]
description:
  Talk for redbrick on web development using hugo to create a static site
layout: slides
date: 2020-02-05T11:25:00Z
slideOptions:
  theme: redbrick
---

# Static Site

---

## Why

There are many
[problems with cms](http://blog.theinternets.be/the-problem-with-modern-content-management-systems/)
some due to security others dues to infrastructure dependency, database or
running a server. Allows us to separate layout from content. Produces HTML which
is easy to host and share.

---

## Dynamic vs static

===

### Static Site

A static site is one that does not change once the content is set.

- plain old html site
- redbrick

===

### Dynamic Site

A dynamic is one that is generated everytime you load it.

- wordpress
- facebook
- twitter

===

# Hugo

Written in go, so runs on anything. Uses markdown and yaml to store setting and
contents.

---

## Using Hugo

Hugo is already installed on pygmalion, so everyone just needs to ssh there to
use it

```bash
ssh username@pygmalion.redbrick.dcu.ie
```

===

## Creating your first site

To generate your first site you can type the command:

```bash
hugo new site ~/my-website
```

===

Jump into your new site and have a look around at the files

```bash
cd ~/my-website
ls -F
```

===

Open up the `config.yaml` file to change the configuration of your website

```bash
nano config.yaml
```

Edit the content/index.md with what ever you want to say

```bash
nano content/index.md
```

---

## Making it your own

===

### Changing images

To get started you will want to add your own pictures for your avatar, banner
and about photos.

To change these you will need to add these to your `/static/img/` folder.

- avatar.jpg
- banner.jpg
- about.jpg

===

### Customising pages

- Change the baseURL `baseURL: "http://username.redbrick.dcu.ie/"` to include
  your username
- Change `title: A Redbrick users site` to the title of your main page
- You can also add your social media links in here after `link: '#'`

===

### Adding new pages

```bash
hugo new about.md
```

This will generate a new page with some metadata all ready in it.

Take a look at this new file with

```bash
nano content/about.md
```

---

## Building the Site

To build your site we type the command

```bash
hugo
```

This will output all the code into the `public` folder.

===

To publish it to redbrick

```bash
mv public/* ~/public_html
cd ~/public_html
chmod -R 755 *
chmod -r 644 *.html *.css *.html *.jpg *.png
```

---

## Why is my static site really slow to load?

===

### Images

Don't use high-res scale them down and compress them

- thumbnails 200px
- banners 800px (These are rough estimates every page is different)

Compression removes details but makes them smaller

===

### Minification

Minification removes white spaces reducing the size of the file allowing you to
load your site faster. You can minify html, css, or js.

Tools for minification:

- Gulp
- Grunt
- Webpack

---

## Blog

hugo can be used for a blog.

Youll need a theme that supports blog posts.

Just run `hugo new post/my-post-name.md`

---

# Questions?
