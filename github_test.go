package main

import (
	"encoding/json"
	"fmt"
	"testing"
	"time"
)

func TestNormalizeContributionState(t *testing.T) {
	tests := []struct {
		name     string
		state    string
		mergedAt string
		want     string
	}{
		{
			name:     "merged PR",
			state:    "closed",
			mergedAt: "2026-07-29T00:00:00Z",
			want:     "MERGED",
		},
		{
			name:     "open PR",
			state:    "open",
			mergedAt: "",
			want:     "OPEN",
		},
		{
			name:     "closed but not merged",
			state:    "closed",
			mergedAt: "",
			want:     "CLOSED",
		},
		{
			name:     "lowercase state normalized",
			state:    "open",
			mergedAt: "",
			want:     "OPEN",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := normalizeContributionState(tt.state, tt.mergedAt)
			if got != tt.want {
				t.Errorf("normalizeContributionState(%q, %q) = %q, want %q", tt.state, tt.mergedAt, got, tt.want)
			}
		})
	}
}

func TestBuildOutput(t *testing.T) {
	t.Run("filters private repos from pinned items", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.RepositoryOwner.PinnedItems.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{Name: "public-repo", IsPrivate: false, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
			{Name: "private-repo", IsPrivate: true, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
		}

		out := buildOutput(resp, nil)

		if len(out.PinnedRepos) != 1 {
			t.Fatalf("expected 1 pinned repo, got %d", len(out.PinnedRepos))
		}
		if out.PinnedRepos[0].Repo != "public-repo" {
			t.Errorf("expected public-repo, got %s", out.PinnedRepos[0].Repo)
		}
	})

	t.Run("filters private repos from user repositories", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.User.Repositories.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{Name: "public-repo", IsPrivate: false, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
			{Name: "private-repo", IsPrivate: true, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
		}

		out := buildOutput(resp, nil)

		if len(out.Repos) != 1 {
			t.Fatalf("expected 1 repo, got %d", len(out.Repos))
		}
		if out.Repos[0].Repo != "public-repo" {
			t.Errorf("expected public-repo, got %s", out.Repos[0].Repo)
		}
	})

	t.Run("skips repos with empty name or owner", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.User.Repositories.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{Name: "", IsPrivate: false, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
			{Name: "repo", IsPrivate: false, Owner: struct {
				Login string `json:"login"`
			}{Login: ""}},
			{Name: "valid-repo", IsPrivate: false, Owner: struct {
				Login string `json:"login"`
			}{Login: "butlerx"}},
		}

		out := buildOutput(resp, nil)

		if len(out.Repos) != 1 {
			t.Fatalf("expected 1 repo, got %d", len(out.Repos))
		}
		if out.Repos[0].Repo != "valid-repo" {
			t.Errorf("expected valid-repo, got %s", out.Repos[0].Repo)
		}
	})

	t.Run("includes language when present", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.User.Repositories.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{
				Name:      "go-repo",
				IsPrivate: false,
				PrimaryLanguage: &struct {
					Name  string `json:"name"`
					Color string `json:"color"`
				}{Name: "Go", Color: "#00ADD8"},
				Owner: struct {
					Login string `json:"login"`
				}{Login: "butlerx"},
			},
		}

		out := buildOutput(resp, nil)

		if out.Repos[0].Language == nil {
			t.Fatal("expected language to be set")
		}
		if out.Repos[0].Language.Name != "Go" {
			t.Errorf("expected Go, got %s", out.Repos[0].Language.Name)
		}
		if out.Repos[0].Language.Color != "#00ADD8" {
			t.Errorf("expected #00ADD8, got %s", out.Repos[0].Language.Color)
		}
	})

	t.Run("handles nil language", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.User.Repositories.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{
				Name:            "no-lang-repo",
				IsPrivate:       false,
				PrimaryLanguage: nil,
				Owner: struct {
					Login string `json:"login"`
				}{Login: "butlerx"},
			},
		}

		out := buildOutput(resp, nil)

		if out.Repos[0].Language != nil {
			t.Error("expected language to be nil")
		}
	})

	t.Run("preserves all repo fields", func(t *testing.T) {
		resp := &graphQLResponse{}
		resp.Data.User.Repositories.Nodes = []struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			IsPrivate       bool   `json:"isPrivate"`
			StargazerCount  int    `json:"stargazerCount"`
			ForkCount       int    `json:"forkCount"`
			PrimaryLanguage *struct {
				Name  string `json:"name"`
				Color string `json:"color"`
			} `json:"primaryLanguage"`
			Owner struct {
				Login string `json:"login"`
			} `json:"owner"`
		}{
			{
				Name:           "wetty",
				Description:    "Terminal in the browser",
				IsPrivate:      false,
				StargazerCount: 100,
				ForkCount:      25,
				Owner: struct {
					Login string `json:"login"`
				}{Login: "butlerx"},
			},
		}

		out := buildOutput(resp, nil)

		repo := out.Repos[0]
		if repo.Repo != "wetty" {
			t.Errorf("Repo = %q, want %q", repo.Repo, "wetty")
		}
		if repo.User != "butlerx" {
			t.Errorf("User = %q, want %q", repo.User, "butlerx")
		}
		if repo.Description != "Terminal in the browser" {
			t.Errorf("Description = %q, want %q", repo.Description, "Terminal in the browser")
		}
		if repo.Stars != 100 {
			t.Errorf("Stars = %d, want %d", repo.Stars, 100)
		}
		if repo.Forks != 25 {
			t.Errorf("Forks = %d, want %d", repo.Forks, 25)
		}
	})

	t.Run("includes repositories with commit contributions", func(t *testing.T) {
		const payload = `{
			"data": {
				"user": {
					"repositories": {"nodes": []},
					"contributionsCollection": {
						"commitContributionsByRepository": [
							{
								"repository": {
									"name": "hawkeye",
									"description": "Find high-risk code",
									"isPrivate": false,
									"stargazerCount": 186,
									"forkCount": 12,
									"owner": {"login": "fast"}
								}
							}
						]
					}
				}
			}
		}`
		resp := &graphQLResponse{}
		if err := json.Unmarshal([]byte(payload), resp); err != nil {
			t.Fatalf("unmarshal GraphQL response: %v", err)
		}

		out := buildOutput(resp, nil)
		if len(out.Repos) != 1 {
			t.Fatalf("expected 1 contributed repo, got %d", len(out.Repos))
		}
		if out.Repos[0].User != "fast" || out.Repos[0].Repo != "hawkeye" {
			t.Errorf("expected fast/hawkeye, got %s/%s", out.Repos[0].User, out.Repos[0].Repo)
		}
	})

	t.Run("includes contributions in output", func(t *testing.T) {
		resp := &graphQLResponse{}
		contributions := []contributionEntry{
			{
				Repo:     contributionRepo{URL: "https://github.com/test/repo", Name: "repo", Owner: "test", Stars: 50},
				Title:    "Fix bug",
				URL:      "https://github.com/test/repo/pull/1",
				State:    "MERGED",
				BodyHTML: "Fixed the thing",
			},
		}

		out := buildOutput(resp, contributions)

		if len(out.Contributions) != 1 {
			t.Fatalf("expected 1 contribution, got %d", len(out.Contributions))
		}
		if out.Contributions[0].Title != "Fix bug" {
			t.Errorf("expected 'Fix bug', got %s", out.Contributions[0].Title)
		}
	})
}

func TestBuildOpenContributions(t *testing.T) {
	items := []pullRequestSearchItem{
		{
			Title:         "Open external contribution",
			HTMLURL:       "https://github.com/example/project/pull/42",
			State:         "open",
			Body:          "Still in review.",
			RepositoryURL: "https://api.github.com/repos/example/project",
			UpdatedAt:     "2026-09-20T12:00:00Z",
		},
		{
			Title:         "Stale contribution",
			HTMLURL:       "https://github.com/example/project/pull/7",
			State:         "open",
			RepositoryURL: "https://api.github.com/repos/example/project",
			UpdatedAt:     "2025-01-01T12:00:00Z",
		},
	}

	updatedAfter := time.Date(2026, 3, 31, 0, 0, 0, 0, time.UTC)
	contributions, err := buildOpenContributions(items, mockRepoLookup, updatedAfter, 10)
	if err != nil {
		t.Fatalf("build open contributions: %v", err)
	}
	if len(contributions) != 1 {
		t.Fatalf("expected 1 contribution, got %d", len(contributions))
	}
	if contributions[0].State != "OPEN" {
		t.Errorf("expected OPEN, got %s", contributions[0].State)
	}
	if contributions[0].Repo.Owner != "example" {
		t.Errorf("expected external repository owner, got %s", contributions[0].Repo.Owner)
	}
}

func TestBuildContributions(t *testing.T) {
	t.Run("filters non-PR events", func(t *testing.T) {
		events := []publicEvent{
			{Type: "PushEvent", Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/repo"}},
			{Type: "IssueCommentEvent", Repo: struct {
				Name string `json:"name"`
			}{Name: "butlerx/repo"}},
			makePREvent("butlerx/repo", "PR Title", "https://github.com/butlerx/repo/pull/1", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 1 {
			t.Fatalf("expected 1 contribution, got %d", len(contributions))
		}
	})

	t.Run("deduplicates by PR URL", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "PR v1", "https://github.com/butlerx/repo/pull/1", "open", ""),
			makePREvent("butlerx/repo", "PR v2", "https://github.com/butlerx/repo/pull/1", "closed", "2026-01-01T00:00:00Z"),
			makePREvent("butlerx/repo", "Different PR", "https://github.com/butlerx/repo/pull/2", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 2 {
			t.Fatalf("expected 2 contributions, got %d", len(contributions))
		}
		// First occurrence wins
		if contributions[0].Title != "PR v1" {
			t.Errorf("expected first PR title 'PR v1', got %q", contributions[0].Title)
		}
	})

	t.Run("respects limit", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/one", "PR 1", "https://github.com/butlerx/one/pull/1", "open", ""),
			makePREvent("butlerx/two", "PR 2", "https://github.com/butlerx/two/pull/2", "open", ""),
			makePREvent("butlerx/three", "PR 3", "https://github.com/butlerx/three/pull/3", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 2)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 2 {
			t.Fatalf("expected 2 contributions, got %d", len(contributions))
		}
	})

	t.Run("skips events with empty URL", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "PR Title", "", "open", ""),
			makePREvent("butlerx/repo", "Valid PR", "https://github.com/butlerx/repo/pull/1", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 1 {
			t.Fatalf("expected 1 contribution, got %d", len(contributions))
		}
	})

	t.Run("skips events with empty title", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "", "https://github.com/butlerx/repo/pull/1", "open", ""),
			makePREvent("butlerx/repo", "Valid PR", "https://github.com/butlerx/repo/pull/2", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 1 {
			t.Fatalf("expected 1 contribution, got %d", len(contributions))
		}
	})

	t.Run("skips events with empty repo name", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("", "PR Title", "https://github.com/butlerx/repo/pull/1", "open", ""),
			makePREvent("butlerx/repo", "Valid PR", "https://github.com/butlerx/repo/pull/2", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if len(contributions) != 1 {
			t.Fatalf("expected 1 contribution, got %d", len(contributions))
		}
	})

	t.Run("propagates repo lookup error", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "PR Title", "https://github.com/butlerx/repo/pull/1", "open", ""),
		}

		failingLookup := func(fullName string) (contributionRepo, error) {
			return contributionRepo{}, fmt.Errorf("lookup failed")
		}

		_, err := buildContributions(events, failingLookup, 10)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})

	t.Run("correctly maps merged state", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "Merged PR", "https://github.com/butlerx/repo/pull/1", "closed", "2026-01-01T00:00:00Z"),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if contributions[0].State != "MERGED" {
			t.Errorf("expected MERGED, got %s", contributions[0].State)
		}
	})

	t.Run("correctly maps open state", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "Open PR", "https://github.com/butlerx/repo/pull/1", "open", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if contributions[0].State != "OPEN" {
			t.Errorf("expected OPEN, got %s", contributions[0].State)
		}
	})

	t.Run("correctly maps closed (not merged) state", func(t *testing.T) {
		events := []publicEvent{
			makePREvent("butlerx/repo", "Closed PR", "https://github.com/butlerx/repo/pull/1", "closed", ""),
		}

		contributions, err := buildContributions(events, mockRepoLookup, 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if contributions[0].State != "CLOSED" {
			t.Errorf("expected CLOSED, got %s", contributions[0].State)
		}
	})
}

func TestHydratePullRequestEvents(t *testing.T) {
	const payload = `[
		{
			"type": "PullRequestEvent",
			"repo": {"name": "butlerx/pets-configurator"},
			"payload": {
				"pull_request": {
					"url": "https://api.github.com/repos/butlerx/pets-configurator/pulls/36",
					"id": 4584398650,
					"number": 36
				}
			}
		}
	]`

	var events []publicEvent
	if err := json.Unmarshal([]byte(payload), &events); err != nil {
		t.Fatalf("unmarshal event payload: %v", err)
	}

	lookupCalls := 0
	hydrated, err := hydratePullRequestEvents(events, func(apiURL string) (pullRequestDetails, error) {
		lookupCalls++
		if apiURL != "https://api.github.com/repos/butlerx/pets-configurator/pulls/36" {
			t.Fatalf("unexpected pull request URL: %s", apiURL)
		}
		return pullRequestDetails{
			Title:    "Fix Homebrew cask detection",
			HTMLURL:  "https://github.com/butlerx/pets-configurator/pull/36",
			State:    "closed",
			Body:     "Fixes cask detection.",
			MergedAt: "2026-09-20T14:17:10Z",
		}, nil
	})
	if err != nil {
		t.Fatalf("hydrate events: %v", err)
	}
	if lookupCalls != 1 {
		t.Fatalf("expected 1 pull request lookup, got %d", lookupCalls)
	}
	if hydrated[0].Payload.PullRequest.Title != "Fix Homebrew cask detection" {
		t.Errorf("expected hydrated title, got %q", hydrated[0].Payload.PullRequest.Title)
	}
	if hydrated[0].Payload.PullRequest.HTMLURL != "https://github.com/butlerx/pets-configurator/pull/36" {
		t.Errorf("expected hydrated HTML URL, got %q", hydrated[0].Payload.PullRequest.HTMLURL)
	}
	if hydrated[0].Payload.PullRequest.MergedAt == "" {
		t.Error("expected merged timestamp")
	}
}

func TestBuildRecentCommits(t *testing.T) {
	const payload = `[
		{
			"type": "PushEvent",
			"repo": {"name": "example/project"},
			"payload": {
				"before": "1111111111111111111111111111111111111111",
				"head": "3333333333333333333333333333333333333333",
				"ref": "refs/heads/main"
			}
		}
	]`

	var events []publicEvent
	if err := json.Unmarshal([]byte(payload), &events); err != nil {
		t.Fatalf("unmarshal push event payload: %v", err)
	}

	commits, err := buildRecentCommits(events, func(repo, before, head string) ([]commitDetails, error) {
		if repo != "example/project" {
			t.Fatalf("unexpected repo: %s", repo)
		}
		return []commitDetails{
			makeCommitDetails("2222222222222222222222222222222222222222", "Older commit", "2026-09-26T10:00:00Z"),
			makeCommitDetails("3333333333333333333333333333333333333333", "Newest commit\n\nDetails", "2026-09-26T11:00:00Z"),
		}, nil
	}, 10)
	if err != nil {
		t.Fatalf("build recent commits: %v", err)
	}
	if len(commits) != 2 {
		t.Fatalf("expected 2 commits, got %d", len(commits))
	}
	if commits[0].SHA != "3333333333333333333333333333333333333333" {
		t.Errorf("expected newest commit first, got %s", commits[0].SHA)
	}
	if commits[0].Message != "Newest commit" {
		t.Errorf("expected first line of commit message, got %q", commits[0].Message)
	}
	if commits[0].Repo != "example/project" {
		t.Errorf("expected example/project, got %q", commits[0].Repo)
	}
}

func TestMergeRecentProjects(t *testing.T) {
	recent := []repoEntry{
		{User: "example", Repo: "shared", Stars: 20},
		{User: "butlerx", Repo: "owned", Stars: 5},
	}
	existing := []repoEntry{
		{User: "butlerx", Repo: "owned", Stars: 5, Language: &repoLanguage{Name: "Go", Color: "#00ADD8"}},
		{User: "butlerx", Repo: "another", Stars: 10},
	}

	got := mergeRecentProjects(recent, existing, 3)
	if len(got) != 3 {
		t.Fatalf("expected 3 projects, got %d", len(got))
	}
	want := []string{"example/shared", "butlerx/another", "butlerx/owned"}
	for i, project := range got {
		if fullName := project.User + "/" + project.Repo; fullName != want[i] {
			t.Errorf("project %d = %q, want %q", i, fullName, want[i])
		}
	}
	if got[2].Language == nil || got[2].Language.Name != "Go" {
		t.Error("expected owned project metadata to be preserved")
	}
}

func TestRepoEntryJSON(t *testing.T) {
	t.Run("marshals with language", func(t *testing.T) {
		entry := repoEntry{
			Repo:        "wetty",
			User:        "butlerx",
			Description: "Terminal in browser",
			Stars:       100,
			Forks:       25,
			Language:    &repoLanguage{Name: "TypeScript", Color: "#3178c6"},
		}

		data, err := json.Marshal(entry)
		if err != nil {
			t.Fatalf("marshal error: %v", err)
		}

		var decoded repoEntry
		if err := json.Unmarshal(data, &decoded); err != nil {
			t.Fatalf("unmarshal error: %v", err)
		}

		if decoded.Language == nil {
			t.Fatal("expected language to be present")
		}
		if decoded.Language.Name != "TypeScript" {
			t.Errorf("expected TypeScript, got %s", decoded.Language.Name)
		}
	})

	t.Run("omits language when nil", func(t *testing.T) {
		entry := repoEntry{
			Repo:        "docs",
			User:        "butlerx",
			Description: "Documentation",
			Stars:       10,
			Forks:       2,
			Language:    nil,
		}

		data, err := json.Marshal(entry)
		if err != nil {
			t.Fatalf("marshal error: %v", err)
		}

		// Check that "language" key is not in JSON
		var raw map[string]any
		if err := json.Unmarshal(data, &raw); err != nil {
			t.Fatalf("unmarshal error: %v", err)
		}

		if _, exists := raw["language"]; exists {
			t.Error("expected language to be omitted from JSON")
		}
	})
}

func TestContributionEntryJSON(t *testing.T) {
	entry := contributionEntry{
		Repo: contributionRepo{
			URL:   "https://github.com/kubernetes/kubernetes",
			Name:  "kubernetes",
			Owner: "kubernetes",
			Stars: 100000,
		},
		Title:    "Fix memory leak",
		URL:      "https://github.com/kubernetes/kubernetes/pull/12345",
		State:    "MERGED",
		BodyHTML: "<p>This PR fixes a memory leak</p>",
	}

	data, err := json.Marshal(entry)
	if err != nil {
		t.Fatalf("marshal error: %v", err)
	}

	var decoded contributionEntry
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("unmarshal error: %v", err)
	}

	if decoded.Repo.Owner != "kubernetes" {
		t.Errorf("expected kubernetes, got %s", decoded.Repo.Owner)
	}
	if decoded.State != "MERGED" {
		t.Errorf("expected MERGED, got %s", decoded.State)
	}
}

func TestOutputJSON(t *testing.T) {
	out := output{
		PinnedRepos: []repoEntry{
			{Repo: "pinned1", User: "butlerx", Stars: 50},
		},
		Repos: []repoEntry{
			{Repo: "repo1", User: "butlerx", Stars: 100},
			{Repo: "repo2", User: "butlerx", Stars: 75},
		},
		Commits: []commitEntry{
			{Repo: "butlerx/repo1", SHA: "abc123", Message: "Fix bug", URL: "https://github.com/butlerx/repo1/commit/abc123"},
		},
		Contributions: []contributionEntry{
			{
				Repo:  contributionRepo{Name: "external", Owner: "other"},
				Title: "My PR",
				State: "OPEN",
			},
		},
	}

	data, err := json.Marshal(out)
	if err != nil {
		t.Fatalf("marshal error: %v", err)
	}

	var decoded output
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("unmarshal error: %v", err)
	}

	if len(decoded.PinnedRepos) != 1 {
		t.Errorf("expected 1 pinned repo, got %d", len(decoded.PinnedRepos))
	}
	if len(decoded.Repos) != 2 {
		t.Errorf("expected 2 repos, got %d", len(decoded.Repos))
	}
	if len(decoded.Commits) != 1 {
		t.Errorf("expected 1 commit, got %d", len(decoded.Commits))
	}
	if len(decoded.Contributions) != 1 {
		t.Errorf("expected 1 contribution, got %d", len(decoded.Contributions))
	}
}

func makeCommitDetails(sha, message, date string) commitDetails {
	details := commitDetails{
		SHA:     sha,
		HTMLURL: "https://github.com/example/project/commit/" + sha,
	}
	details.Commit.Message = message
	details.Commit.Author.Date = date
	return details
}

func makePREvent(repoName, title, url, state, mergedAt string) publicEvent {
	event := publicEvent{Type: "PullRequestEvent"}
	event.Repo.Name = repoName
	event.Payload.PullRequest = pullRequestDetails{
		Title:    title,
		HTMLURL:  url,
		State:    state,
		MergedAt: mergedAt,
	}
	return event
}

func mockRepoLookup(fullName string) (contributionRepo, error) {
	parts := make([]string, 2)
	if n := copy(parts, splitRepo(fullName)); n < 2 {
		return contributionRepo{}, fmt.Errorf("invalid repo: %s", fullName)
	}
	return contributionRepo{
		URL:   "https://github.com/" + fullName,
		Name:  parts[1],
		Owner: parts[0],
		Stars: 10,
	}, nil
}

func splitRepo(fullName string) []string {
	for i, c := range fullName {
		if c == '/' {
			return []string{fullName[:i], fullName[i+1:]}
		}
	}
	return []string{fullName}
}
