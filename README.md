# cianbutler.ie

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/butlerx/cianbutler.ie/blob/master/LICENSE.md)

A Hugo static site to display past work experience and projects I've worked on.

# Installation

Install [mise](https://mise.jdx.dev/) then run `mise run build` to install dependencies and build the site.

# Usage

## Development

To preview the site run `mise run serve` then open a browser and navigate to `localhost:1313`. The site will live reload
based on any changes.

## Publish

To build the site for deployment run `mise run build`, the site will be output to `public` folder. This can then be
served from any hosting. The site is auto deployed using cloudflare hosting.

## Content

All pages content sections can be edited from `./content`. These files are simple markdown with front-matter yaml.

A portion of the content is stored in `data` such as `work.yaml`, and `education.yaml`. The text in the yaml files are
treated as markdown and rendered out in to the templates.

The Social links can be found in `data/info.yaml`.

## Github

A portion of the site uses Github as a source for rendering templates. Given it is not possible to render graphql data
from hugo, `github.go` exists. `github.go` is a Go script to etl data from github's graphql api for use in hugo. Run
`mise run github-data` to fetch the latest data.
