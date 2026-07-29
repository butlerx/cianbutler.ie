package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

const graphqlURL = "https://api.github.com/graphql"
const restURL = "https://api.github.com"
const query = `query (
  $author: String = ""
  $userFirst: Int = 0
) {
  user(login: $author) {
    repositories(
      first: $userFirst
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      nodes {
        name
        description
        isPrivate
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
        owner {
          login
        }
      }
    }
  }
  repositoryOwner(login: $author) {
    ... on User {
      pinnedItems(first: 6) {
        nodes {
          ... on Repository {
            name
            description
            isPrivate
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            owner {
              login
            }
          }
        }
      }
    }
  }
}`

type graphQLRequest struct {
	Query     string         `json:"query"`
	Variables map[string]any `json:"variables"`
}

type graphQLResponse struct {
	Data struct {
		User struct {
			Repositories struct {
				Nodes []struct {
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
				} `json:"nodes"`
			} `json:"repositories"`
		} `json:"user"`
		RepositoryOwner struct {
			PinnedItems struct {
				Nodes []struct {
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
				} `json:"nodes"`
			} `json:"pinnedItems"`
		} `json:"repositoryOwner"`
	} `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

type repoLanguage struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

type repoEntry struct {
	Repo        string        `json:"repo"`
	User        string        `json:"user"`
	Description string        `json:"description"`
	Stars       int           `json:"stars"`
	Forks       int           `json:"forks"`
	Language    *repoLanguage `json:"language,omitempty"`
}

type contributionRepo struct {
	URL   string `json:"url"`
	Name  string `json:"name"`
	Owner string `json:"owner"`
	Stars int    `json:"stars"`
}

type contributionEntry struct {
	Repo     contributionRepo `json:"repo"`
	Title    string           `json:"title"`
	URL      string           `json:"url"`
	State    string           `json:"state"`
	BodyHTML string           `json:"bodyHTML"`
}

type output struct {
	PinnedRepos   []repoEntry         `json:"pinnedRepos"`
	Repos         []repoEntry         `json:"repos"`
	Contributions []contributionEntry `json:"contributions"`
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}

type config struct {
	outputPath string
	user       string
}

type publicEvent struct {
	Type string `json:"type"`
	Repo struct {
		Name string `json:"name"`
	} `json:"repo"`
	Payload struct {
		PullRequest struct {
			Title    string `json:"title"`
			HTMLURL  string `json:"html_url"`
			State    string `json:"state"`
			Body     string `json:"body"`
			MergedAt string `json:"merged_at"`
		} `json:"pull_request"`
	} `json:"payload"`
}

func parseFlags() config {
	var cfg config
	flag.StringVar(&cfg.outputPath, "output", "data/github.json", "output file path")
	flag.StringVar(&cfg.user, "user", "butlerx", "GitHub username")
	flag.Parse()
	return cfg
}

func run() error {
	cfg := parseFlags()

	token := os.Getenv("GH_TOKEN")
	if token == "" {
		return fmt.Errorf("GH_TOKEN environment variable is required")
	}

	gqlResp, err := fetchGitHubData(token, cfg.user)
	if err != nil {
		return fmt.Errorf("fetching github data: %w", err)
	}

	contributions, err := fetchContributions(token, cfg.user, 10)
	if err != nil {
		return fmt.Errorf("fetching contributions: %w", err)
	}

	out := buildOutput(gqlResp, contributions)

	if err = writeJSONToFile(cfg.outputPath, out); err != nil {
		return fmt.Errorf("writing output to %s: %w", cfg.outputPath, err)
	}
	return nil
}

func fetchGitHubData(token, user string) (*graphQLResponse, error) {
	reqBody := graphQLRequest{
		Query: query,
		Variables: map[string]any{
			"author":    user,
			"userFirst": 10,
		},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshalling request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, graphqlURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("executing request: %w", err)
	}
	defer func() {
		if cerr := resp.Body.Close(); cerr != nil {
			fmt.Fprintf(os.Stderr, "warning: closing response body: %v\n", cerr)
		}
	}()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API returned %d: %s", resp.StatusCode, respBody)
	}

	var gqlResp graphQLResponse
	if err = json.Unmarshal(respBody, &gqlResp); err != nil {
		return nil, fmt.Errorf("parsing response: %w", err)
	}

	if len(gqlResp.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL error: %s", gqlResp.Errors[0].Message)
	}

	return &gqlResp, nil
}

func fetchContributions(token, user string, limit int) ([]contributionEntry, error) {
	events, err := fetchPublicEvents(token, user, 100)
	if err != nil {
		return nil, err
	}

	repoCache := make(map[string]contributionRepo)
	repoLookup := func(fullName string) (contributionRepo, error) {
		if repo, ok := repoCache[fullName]; ok {
			return repo, nil
		}

		repo, lookupErr := fetchRepoDetails(token, fullName)
		if lookupErr != nil {
			return contributionRepo{}, lookupErr
		}

		repoCache[fullName] = repo
		return repo, nil
	}

	return buildContributions(events, repoLookup, limit)
}

func fetchPublicEvents(token, user string, perPage int) ([]publicEvent, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/%s/events/public?per_page=%d", restURL, user, perPage), nil)
	if err != nil {
		return nil, fmt.Errorf("creating public events request: %w", err)
	}

	events := make([]publicEvent, 0)
	if err = doGitHubRequest(token, req, &events); err != nil {
		return nil, fmt.Errorf("fetching public events: %w", err)
	}

	return events, nil
}

func fetchRepoDetails(token, fullName string) (contributionRepo, error) {
	owner, repoName, ok := strings.Cut(fullName, "/")
	if !ok || owner == "" || repoName == "" {
		return contributionRepo{}, fmt.Errorf("invalid repository name %q", fullName)
	}

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/repos/%s/%s", restURL, owner, repoName), nil)
	if err != nil {
		return contributionRepo{}, fmt.Errorf("creating repo details request: %w", err)
	}

	var repoResp struct {
		HTMLURL        string `json:"html_url"`
		StargazerCount int    `json:"stargazers_count"`
	}
	if err = doGitHubRequest(token, req, &repoResp); err != nil {
		return contributionRepo{}, fmt.Errorf("fetching repo details for %s: %w", fullName, err)
	}

	url := repoResp.HTMLURL
	if url == "" {
		url = fmt.Sprintf("https://github.com/%s", fullName)
	}

	return contributionRepo{
		URL:   url,
		Name:  repoName,
		Owner: owner,
		Stars: repoResp.StargazerCount,
	}, nil
}

func doGitHubRequest(token string, req *http.Request, target any) error {
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "token "+token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("executing request: %w", err)
	}
	defer func() {
		if cerr := resp.Body.Close(); cerr != nil {
			fmt.Fprintf(os.Stderr, "warning: closing response body: %v\n", cerr)
		}
	}()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("reading response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("GitHub API returned %d: %s", resp.StatusCode, respBody)
	}

	if err = json.Unmarshal(respBody, target); err != nil {
		return fmt.Errorf("parsing response: %w", err)
	}

	return nil
}

func buildContributions(
	events []publicEvent,
	repoLookup func(fullName string) (contributionRepo, error),
	limit int,
) ([]contributionEntry, error) {
	contributions := make([]contributionEntry, 0, limit)
	seen := make(map[string]struct{}, limit)

	for _, event := range events {
		if event.Type != "PullRequestEvent" {
			continue
		}

		pr := event.Payload.PullRequest
		if pr.HTMLURL == "" || pr.Title == "" || event.Repo.Name == "" {
			continue
		}

		if _, ok := seen[pr.HTMLURL]; ok {
			continue
		}

		repo, err := repoLookup(event.Repo.Name)
		if err != nil {
			return nil, err
		}

		contributions = append(contributions, contributionEntry{
			Repo:     repo,
			Title:    pr.Title,
			URL:      pr.HTMLURL,
			State:    normalizeContributionState(pr.State, pr.MergedAt),
			BodyHTML: pr.Body,
		})
		seen[pr.HTMLURL] = struct{}{}

		if len(contributions) == limit {
			break
		}
	}

	return contributions, nil
}

func normalizeContributionState(state, mergedAt string) string {
	if mergedAt != "" {
		return "MERGED"
	}

	return strings.ToUpper(state)
}

func buildOutput(gqlResp *graphQLResponse, contributions []contributionEntry) output {
	pinnedRepos := make([]repoEntry, 0, len(gqlResp.Data.RepositoryOwner.PinnedItems.Nodes))
	for _, n := range gqlResp.Data.RepositoryOwner.PinnedItems.Nodes {
		if n.IsPrivate {
			continue
		}
		entry := repoEntry{Repo: n.Name, User: n.Owner.Login, Description: n.Description, Stars: n.StargazerCount, Forks: n.ForkCount}
		if n.PrimaryLanguage != nil {
			entry.Language = &repoLanguage{Name: n.PrimaryLanguage.Name, Color: n.PrimaryLanguage.Color}
		}
		pinnedRepos = append(pinnedRepos, entry)
	}

	repos := make([]repoEntry, 0, len(gqlResp.Data.User.Repositories.Nodes))
	for _, n := range gqlResp.Data.User.Repositories.Nodes {
		if n.Name != "" && n.Owner.Login != "" && !n.IsPrivate {
			entry := repoEntry{Repo: n.Name, User: n.Owner.Login, Description: n.Description, Stars: n.StargazerCount, Forks: n.ForkCount}
			if n.PrimaryLanguage != nil {
				entry.Language = &repoLanguage{Name: n.PrimaryLanguage.Name, Color: n.PrimaryLanguage.Color}
			}
			repos = append(repos, entry)
		}
	}

	return output{
		PinnedRepos:   pinnedRepos,
		Repos:         repos,
		Contributions: contributions,
	}
}

func writeJSONToFile(filename string, out output) error {
	outBytes, err := json.Marshal(out)
	if err != nil {
		return fmt.Errorf("marshalling output: %w", err)
	}

	if err = os.WriteFile(filename, outBytes, 0o644); err != nil {
		return fmt.Errorf("writing file %s: %w", filename, err)
	}

	fmt.Printf("Written to %s\n", filename)
	return nil
}
