package main

import (
	"fmt"
	"testing"
)

func TestBuildContributions(t *testing.T) {
	events := []publicEvent{
		{
			Type: "PushEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "unexpected/should-not-be-read"},
		},
		{
			Type: "PullRequestEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/wetty"},
			Payload: struct {
				PullRequest struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				} `json:"pull_request"`
			}{
				PullRequest: struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				}{
					Title:    "Merged PR",
					HTMLURL:  "https://github.com/butlerx/wetty/pull/1",
					State:    "closed",
					Body:     "body 1",
					MergedAt: "2026-07-29T00:00:00Z",
				},
			},
		},
		{
			Type: "PullRequestEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/wetty"},
			Payload: struct {
				PullRequest struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				} `json:"pull_request"`
			}{
				PullRequest: struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				}{
					Title:   "Duplicate PR event",
					HTMLURL: "https://github.com/butlerx/wetty/pull/1",
					State:   "closed",
					Body:    "body duplicate",
				},
			},
		},
		{
			Type: "PullRequestEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/asciify"},
			Payload: struct {
				PullRequest struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				} `json:"pull_request"`
			}{
				PullRequest: struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				}{
					Title:   "Open PR",
					HTMLURL: "https://github.com/butlerx/asciify/pull/2",
					State:   "open",
					Body:    "body 2",
				},
			},
		},
	}

	lookups := 0
	contributions, err := buildContributions(events, func(fullName string) (contributionRepo, error) {
		lookups++
		switch fullName {
		case "butlerx/wetty":
			return contributionRepo{URL: "https://github.com/butlerx/wetty", Name: "wetty", Owner: "butlerx", Stars: 10}, nil
		case "butlerx/asciify":
			return contributionRepo{URL: "https://github.com/butlerx/asciify", Name: "asciify", Owner: "butlerx", Stars: 5}, nil
		default:
			return contributionRepo{}, fmt.Errorf("unexpected repo lookup: %s", fullName)
		}
	}, 10)
	if err != nil {
		t.Fatalf("buildContributions returned error: %v", err)
	}

	if got, want := len(contributions), 2; got != want {
		t.Fatalf("expected %d contributions, got %d", want, got)
	}

	if got, want := contributions[0].State, "MERGED"; got != want {
		t.Fatalf("expected first contribution state %q, got %q", want, got)
	}

	if got, want := contributions[1].State, "OPEN"; got != want {
		t.Fatalf("expected second contribution state %q, got %q", want, got)
	}

	if got, want := contributions[0].BodyHTML, "body 1"; got != want {
		t.Fatalf("expected first contribution body %q, got %q", want, got)
	}

	if got, want := lookups, 2; got != want {
		t.Fatalf("expected %d repo lookups after dedupe, got %d", want, got)
	}
}

func TestBuildContributionsStopsAtLimit(t *testing.T) {
	events := []publicEvent{
		{
			Type: "PullRequestEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/one"},
			Payload: struct {
				PullRequest struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				} `json:"pull_request"`
			}{
				PullRequest: struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				}{
					Title:   "First",
					HTMLURL: "https://github.com/butlerx/one/pull/1",
					State:   "open",
				},
			},
		},
		{
			Type: "PullRequestEvent",
			Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/two"},
			Payload: struct {
				PullRequest struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				} `json:"pull_request"`
			}{
				PullRequest: struct {
					Title    string `json:"title"`
					HTMLURL  string `json:"html_url"`
					State    string `json:"state"`
					Body     string `json:"body"`
					MergedAt string `json:"merged_at"`
				}{
					Title:   "Second",
					HTMLURL: "https://github.com/butlerx/two/pull/2",
					State:   "open",
				},
			},
		},
	}

	contributions, err := buildContributions(events, func(fullName string) (contributionRepo, error) {
		return contributionRepo{URL: "https://github.com/" + fullName}, nil
	}, 1)
	if err != nil {
		t.Fatalf("buildContributions returned error: %v", err)
	}

	if got, want := len(contributions), 1; got != want {
		t.Fatalf("expected %d contribution, got %d", want, got)
	}

	if got, want := contributions[0].Title, "First"; got != want {
		t.Fatalf("expected first contribution title %q, got %q", want, got)
	}
}
