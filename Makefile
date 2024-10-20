SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
.DEFAULT_GOAL := help
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

DESTDIR := public
HUGO_VERSION := 0.122.0
HUGO := .cache/hugo_$(HUGO_VERSION)
SASS_VERSION := 1.70.0
SASS := .cache/dart_sass_$(SASS_VERSION)
PLATFORM := Linux-64bit
GITHUB_BIN := .cache/github

export PATH := $(PATH):$(PWD)/$(SASS)
BINS = $(HUGO) $(SASS)

.PHONY: build
build: public  ## Build Site
public: $(BINS) config.toml content layouts assets data/github.json data/*.yml
	@echo "🍳 Generating site"
	$< --gc --minify -d $(DESTDIR)

.PHONY: update
update: $(BINS) ## Update themes and binaries
	@echo "🛎 Updating Theme"
	$(HUGO) mod get -u ./...

.PHONY: serve
serve: $(BINS) data/github.json ## Run development server in debug mode
	$< server -D -w --ignoreCache

.PHONY: clean
clean: ## Clean built site
	@echo "🧹 Cleaning old build"
	rm -rf public resources $(GITHUB_BIN)

.PHONY: lint lint-scss lint-markdown lint-html format
lint: lint-scss lint-markdown lint-html ## Run all linter
format: ## Format Markdown files
	@prettier --write .
	deno fmt

lint-scss: format ## Run scss linter
	@echo "🍜 Testing SCSS"
	stylelint "assets/scss/**/*.{css,scss,sass}"

lint-markdown: format ## Run markdown linter
	@echo "🍜 Testing Markdown"
	docker run --rm -v $$(pwd):/hugo ruby:2-alpine sh -c 'gem install mdl && mdl -i /hugo/content/ -s /hugo/.markdown.style.rb'

lint-html: public ## Run HTML linter
	@echo "🍜 Testing HTML"
	docker run --rm -v $$(pwd):/hugo ruby:2 sh -c 'gem install html-proofer && htmlproofer --allow-hash-href --check-html --empty-alt-ignore --disable-external /hugo/public'

$(HUGO): ## Install dependencies for hugo
	@echo "🤵 Getting Hugo"
	wget -q -P tmp/ https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_$(PLATFORM).tar.gz
	tar xf tmp/hugo_extended_$(HUGO_VERSION)_$(PLATFORM).tar.gz -C tmp/
	mkdir -p .cache
	mv -f tmp/hugo $@
	rm -rf tmp/

$(SASS):  ## Install dependencies for sass
	echo "🤵 Getting sass"
	wget -q -P tmp/ https://github.com/sass/dart-sass/releases/download/$(SASS_VERSION)/dart-sass-$(SASS_VERSION)-linux-x64.tar.gz
	mkdir -p $@
	tar xf tmp/dart-sass-$(SASS_VERSION)-linux-x64.tar.gz -C tmp/
	mv -f tmp/dart-sass/* $@
	rm -rf tmp/

data/github.json: ## build github data file
	deno run --allow-env --allow-net --allow-write $< || exit 0

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
