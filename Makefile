SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
.DEFAULT_GOAL := help
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

DESTDIR := public
HUGO_VERSION := 0.83.1
HUGO := .cache/hugo_$(HUGO_VERSION)
SASS_VERSION := 1.0.0-beta.7
SASS := .cache/dart-sass-embedded_$(SASS_VERSION)
PLATFORM := Linux-64bit

THEME := $(shell awk -F\= '/theme/ {gsub(/"/,"",$$2);gsub(/ /, "", $$2);print $$2}' config.toml)
THEME_DIR := themes/$(THEME)

PATH := $(PATH):$(SASS)

$(THEME_DIR):
	@git submodule init
	@git submodule sync
	@git submodule update

.PHONY: build
build: public  ## Build Site
public: $(HUGO) config.toml $(THEME_DIR) content data/github.json data/*.yml
	@echo "🍳 Generating site"
	$< --gc --minify -d $(DESTDIR)
	@echo "🧂 Optimizing images"
	find $@ -not -path "*/static/*" \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) -print0 | xargs -0 -P8 -n2 mogrify -strip -thumbnail '1000>'

.PHONY: deploy
deploy:  public ## Manually deploy site to netlify
	netlify $@

.PHONY: update
update: ## Update themes
	@echo "🛎 Updating Them"
	git submodule update --remote --merge

.PHONY: serve
serve: $(HUGO) data/github.json ## Run development server in debug mode
	$< server -D -w --ignoreCache

.PHONY: clean
clean: ## Clean built site
	@echo "🧹 Cleaning old build"
	rm -rf public resources .cache

.PHONY: lint lint-scss lint-markdown lint-html format
lint: lint-scss lint-markdown lint-html ## Run all linter
format: ## Format Markdown files
	@prettier --write .
	@deno fmt

lint-scss: format ## Run scss linter
	@echo "🍜 Testing SCSS"
	@stylelint "assets/scss/**/*.{css,scss,sass}"

lint-markdown: format ## Run markdown linter
	@echo "🍜 Testing Markdown"
	@docker run --rm -v $$(pwd):/hugo ruby:2-alpine sh -c 'gem install mdl && mdl -i /hugo/content/ -s /hugo/.markdown.style.rb'

lint-html: public ## Run HTML linter
	@echo "🍜 Testing HTML"
	@docker run --rm -v $$(pwd):/hugo ruby:2 sh -c 'gem install html-proofer && htmlproofer --allow-hash-href --check-html --empty-alt-ignore --disable-external /hugo/public'

$(HUGO): $(SASS)
	@echo "🤵 Getting Hugo"
	@wget -q -P tmp/ https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_$(PLATFORM).tar.gz
	@tar xf tmp/hugo_extended_$(HUGO_VERSION)_$(PLATFORM).tar.gz -C tmp/
	@mkdir -p .cache
	@mv -f tmp/hugo $@
	@rm -rf tmp/

$(SASS):  ## Install dependencies for sass
	@echo "🤵 Getting embedded sass"
	@wget -q -P tmp/ https://github.com/sass/dart-sass-embedded/releases/download/$(SASS_VERSION)/sass_embedded-$(SASS_VERSION)-linux-x64.tar.gz
	@mkdir -p  $@
	@tar xf tmp/sass_embedded-$(SASS_VERSION)-linux-x64.tar.gz -C tmp/
	@mv -f tmp/sass_embedded/dart-sass-embedded $@
	@rm -rf tmp/

.PHONY: api-server
api-server: github-server.ts ## Run dev server for github etl
	@deployctl run --watch --env .env $<

.cache/github: github.ts
	deno compile -o $@ --allow-env --allow-net --allow-write $<

data/github.json: .cache/github
	$<

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
