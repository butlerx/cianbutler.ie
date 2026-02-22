# cianbutler.ie

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/butlerx/cianbutler.ie/blob/master/LICENSE.md)

My personal site — a [Hugo](https://gohugo.io/) static site for work experience, projects, blog posts, and open source
contributions. Fuelled entirely by coffee and stubbornness.

## Prerequisites

Install [mise](https://mise.jdx.dev/) and it'll handle the rest (Hugo, Go, linters, formatters — the whole lot).

## Getting Started

```sh
mise run build   # install deps + build the site
mise run serve   # dev server at localhost:1313 with live reload (includes drafts)
```

## Available Tasks

| Task                    | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `mise run build` (`b`)  | Build the site to `public/`                      |
| `mise run serve`        | Dev server with live reload and draft posts      |
| `mise run clean`        | Nuke the old build artifacts                     |
| `mise run format`       | Format everything (Prettier + gofmt)             |
| `mise run format:check` | Check formatting without writing changes         |
| `mise run lint`         | Run all linters (Markdown + CSS)                 |
| `mise run spell`        | Spell check the content                          |
| `mise run check`        | Run the full suite: format check + lint + spell  |
| `mise run github-data`  | Fetch GitHub data (needs `GH_TOKEN` — see below) |

## Content

All page content lives in `./content` as Markdown with front-matter. Easy to edit, hard to mess up.

Structured data like work history and education is stored in `data/` as TOML files:

- `data/work.toml` — work experience
- `data/education.toml` — education
- `data/info.toml` — social links, bio, skills, and other personal info

The text in those TOML files gets treated as Markdown and rendered into the templates.

## GitHub Data

A chunk of the site pulls live data from GitHub — pinned repos, top repositories, and open source contributions. Since
Hugo can't talk to GraphQL APIs on its own, `github.go` exists to bridge the gap. It fetches data from GitHub's GraphQL
API and writes it to `data/github.json` for Hugo to pick up.

```sh
GH_TOKEN=$(gh auth token) mise run github-data
```

Assumes you're already logged in with `gh auth login`.

## Deployment

The site auto-deploys via Cloudflare Pages. Push to main and it takes care of itself.
