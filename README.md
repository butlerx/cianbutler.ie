# C.V.

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/butlerx/cv/blob/master/LICENSE.md)
[![Netlify Status](https://api.netlify.com/api/v1/badges/72ca1f9c-2c7e-47d8-a644-5d01446272be/deploy-status)](https://app.netlify.com/sites/butlerx-cv/deploys)

A Gatsby static site To display past work experience and projects i've worked on.

# Installation

Run `yarn` to install dependencies.

# Usage

## Development

To Preview the site do `yarn start` The Browser will open the main page automagically. The Site will
live reload based on any changes.

## Publish

To Build the site for deployment run `yarn build`, the site will be output to `public` folder. This
can then be served from any hosting. The site is auto deployed using netlify hosting

## PDF

To Export a PDF on the `me` page run `yarn print`, this is save `cv.pdf` in the root dir.

## Content

All pages content sections can be edited from `./src/content`. These files are simple markdown with
front-matter yaml

A of the content is shared and stored in `./src/data` such as `experience.yaml`, and
`education.yaml`. The text in the yaml files are treated as markdown and rendered out in to the
templates.

The Social links can be found in `./gatsby-config.js`. Each link have slightly different structure
for there unique need, so you can refer to the template `./src/components/social.tsx` for specifics
