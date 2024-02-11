---
title: How to Redbrick
description: intoduction to using redbrick
tags: [redbrick, how-to]
layout: slides
date: 2020-02-05T11:25:00Z
slideOptions:
  theme: redbrick
---

# How to Redbrick

IRC Clients, Multiplexers, Web Hosting, Development

Note: What is redbrick

---

## Login

How to ssh

===

Does anyone need a redbrick login or password?

===

## Type this in your terminal

`~$ ssh username@redbrick.dcu.ie`

- Your password won't show up for those damn screenlookers

===

![login screen](https://i.imgur.com/HS5VDaA.png)

---

## Multiplexer

A terminal multiplexer is used so that you can have multiple terminals open but
in the one terminal window

===

## The Choice

Tmux vs screen

===

### Tmux

- Lighter than screen (which ~~is shit~~ we don't use)
- Better plugins
- Scriptable
- Already setup, just type `tmux` to get it going

===

### Auto Attach

- nano ~/.zlogin
- add the followin line `tmux attach -d`

---

## IRC Clients

irssi or weechat

===

### Weechat

- Command Line irc client
- Some advantages over irrsi
- Looks nicer
- Easier to install scripts
- alternatives include irssi

===

#### Useful Commands

- /script
  - **iset.pl** - nice interface for changing settings
  - **screen_away.pl** - sets away status when you detach from screen
  - **cmdind.pl** -tells you is its command or message
  - **grep** - lets you grep in weechat
  - **pushover.pl** - notification center
- Remember to /save when you update settings
- And run /autojoin --run

---

## Webspace

- Open up the FTP Client (Winscp and filezilla)
- Login to
  - Host: sftp://redbrick.dcu.ie
  - User: RedbrickUsername
  - Pass: RedbrickPassword
  - Port: 22

===

- Navigate to public_html/ (it's in your home directory)
- Drag and drop your file to upload or select from the filesystem
- SSH into the Redbrick
- In your home directory (~) enter the following commands:

```
cd public_html
chmod 755 .
```

- You would have to create this file first `chmod 644 index.html` This sets
  permissions for the folder and file

---

### SSH Keys

Make ssh easier

===

### Step One

- Create the RSA Key Pair `keygen -t rsa`

===

### Step Two

```
Enter file in which to save the key (/home/demo/.ssh/id_rsa):
```

You can press enter here just to store in home

```
Enter passphrase (empty for no passphrase):
```

- Set a passphrase for the key
- It's up to you whether you want to use a passphrase.

===

### Step three

- Copy the public key `ssh-copy-id username@redbrick.dcu.ie`

---

## Questions?
