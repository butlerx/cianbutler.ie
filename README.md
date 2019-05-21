# C.V.

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/butlerx/cv/blob/master/LICENSE.md)

A Gatsby static site To display past work experience and projects i've worked on.

# Installation

Run `yarn` to install dependencies.

# Usage

## Development

To Preview the site do `yarn start` The Browser will open the main page
automagically. The Site will live reload based on any changes.

## Publish

To Build the site for deployment run `yarn build`, the site will be output to
`dist` folder. This can then be served from any hosting. To see how to auto
deploy to a GitHub Pages see `./.circleci/config.yml`

## PDF

To Export a PDF on the `me` page run `yarn print`, this is save `cv.pdf` in the
root dir.

## Content

All pages content sections can be edited from `./site/content`. These files are
simple markdown with front-matter yaml

A of the content is shared and stored in `./site/data` such as
`experience.yaml`, `education.yaml` and `projects.yaml`. The tech in the yaml
files are treated as markdown and rendered out in to the templates.

The Social links can be found in `./site/config.toml`. Each link have slightly
different structure for there unique need, so you can refer to the template
`./site/layouts/partials/social.html` for specifics

## Extending the Site

If you wish to extend the site or add more pages then just add markdown files to
`./site/content`. You might want to create special layouts for these pages, if
you do refer to [hugo's templating docs](https://gohugo.io/documentation/)
