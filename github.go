package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"
)

const graphqlURL = "https://api.github.com/graphql"
const restURL = "https://api.github.com"
const openPullRequestMaxAge = 180 * 24 * time.Hour
const recentCommitLimit = 12
const topProjectLimit = 21
const query = `query (
  $author: String = ""
  $userFirst: Int = 0
) {
  user(login: $author) {
    createdAt
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
    contributionsCollection {
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
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

const contributionProjectsQuery = `query (
  $author: String!
  $from: DateTime!
  $to: DateTime!
) {
  user(login: $author) {
    contributionsCollection(from: $from, to: $to) {
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
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
}`

type graphQLRequest struct {
	Query     string         `json:"query"`
	Variables map[string]any `json:"variables"`
}

type graphQLResponse struct {
	Data struct {
		User struct {
			CreatedAt    string `json:"createdAt"`
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
			ContributionsCollection struct {
				CommitContributionsByRepository []struct {
					Repository struct {
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
					} `json:"repository"`
				} `json:"commitContributionsByRepository"`
			} `json:"contributionsCollection"`
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

type contributionProjectsResponse struct {
	Data struct {
		User struct {
			ContributionsCollection struct {
				CommitContributionsByRepository []struct {
					Repository struct {
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
					} `json:"repository"`
				} `json:"commitContributionsByRepository"`
			} `json:"contributionsCollection"`
		} `json:"user"`
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

type commitEntry struct {
	Repo    string `json:"repo"`
	SHA     string `json:"sha"`
	Message string `json:"message"`
	URL     string `json:"url"`
	Date    string `json:"date"`
}

type output struct {
	PinnedRepos   []repoEntry         `json:"pinnedRepos"`
	Repos         []repoEntry         `json:"repos"`
	Commits       []commitEntry       `json:"commits"`
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

type pullRequestDetails struct {
	APIURL   string `json:"url"`
	Title    string `json:"title"`
	HTMLURL  string `json:"html_url"`
	State    string `json:"state"`
	Body     string `json:"body"`
	MergedAt string `json:"merged_at"`
}

type pullRequestSearchItem struct {
	Title         string `json:"title"`
	HTMLURL       string `json:"html_url"`
	State         string `json:"state"`
	Body          string `json:"body"`
	RepositoryURL string `json:"repository_url"`
	UpdatedAt     string `json:"updated_at"`
}

type commitDetails struct {
	SHA     string `json:"sha"`
	HTMLURL string `json:"html_url"`
	Commit  struct {
		Message string `json:"message"`
		Author  struct {
			Date string `json:"date"`
		} `json:"author"`
	} `json:"commit"`
}

type publicEvent struct {
	Type string `json:"type"`
	Repo struct {
		Name string `json:"name"`
	} `json:"repo"`
	Payload struct {
		Before      string             `json:"before"`
		Head        string             `json:"head"`
		Ref         string             `json:"ref"`
		PullRequest pullRequestDetails `json:"pull_request"`
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

	events, err := fetchPublicEvents(token, cfg.user, 100)
	if err != nil {
		return fmt.Errorf("fetching public events: %w", err)
	}

	contributions, err := fetchContributions(token, cfg.user, events, 10)
	if err != nil {
		return fmt.Errorf("fetching contributions: %w", err)
	}

	commits, err := fetchRecentCommits(token, events, recentCommitLimit)
	if err != nil {
		return fmt.Errorf("fetching recent commits: %w", err)
	}

	historicalProjects, err := fetchHistoricalProjects(token, cfg.user, gqlResp.Data.User.CreatedAt, time.Now().UTC())
	if err != nil {
		return fmt.Errorf("fetching historical projects: %w", err)
	}

	out := buildOutput(gqlResp, contributions)
	out.Commits = commits
	out.Repos = mergeRecentProjects(historicalProjects, out.Repos, topProjectLimit)

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

func fetchHistoricalProjects(token, user, createdAt string, until time.Time) ([]repoEntry, error) {
	from, err := time.Parse(time.RFC3339, createdAt)
	if err != nil {
		return nil, fmt.Errorf("parsing GitHub account creation time: %w", err)
	}

	projects := make([]repoEntry, 0)
	for from.Before(until) {
		to := from.AddDate(1, 0, 0)
		if to.After(until) {
			to = until
		}

		periodProjects, fetchErr := fetchContributionProjects(token, user, from, to)
		if fetchErr != nil {
			return nil, fetchErr
		}
		projects = append(projects, periodProjects...)
		from = to
	}

	return projects, nil
}

func fetchContributionProjects(token, user string, from, to time.Time) ([]repoEntry, error) {
	reqBody := graphQLRequest{
		Query: contributionProjectsQuery,
		Variables: map[string]any{
			"author": user,
			"from":   from.Format(time.RFC3339),
			"to":     to.Format(time.RFC3339),
		},
	}
	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshalling contribution projects request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, graphqlURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("creating contribution projects request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	var response contributionProjectsResponse
	if err = doGitHubRequest(token, req, &response); err != nil {
		return nil, fmt.Errorf("fetching contribution projects from %s: %w", from.Format(time.DateOnly), err)
	}
	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL contribution projects error: %s", response.Errors[0].Message)
	}

	projects := make([]repoEntry, 0, len(response.Data.User.ContributionsCollection.CommitContributionsByRepository))
	for _, contribution := range response.Data.User.ContributionsCollection.CommitContributionsByRepository {
		n := contribution.Repository
		if n.Name == "" || n.Owner.Login == "" || n.IsPrivate {
			continue
		}
		entry := repoEntry{Repo: n.Name, User: n.Owner.Login, Description: n.Description, Stars: n.StargazerCount, Forks: n.ForkCount}
		if n.PrimaryLanguage != nil {
			entry.Language = &repoLanguage{Name: n.PrimaryLanguage.Name, Color: n.PrimaryLanguage.Color}
		}
		projects = append(projects, entry)
	}
	return projects, nil
}

func fetchContributions(token, user string, events []publicEvent, limit int) ([]contributionEntry, error) {
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

	updatedAfter := time.Now().UTC().Add(-openPullRequestMaxAge)
	openItems, err := fetchOpenPullRequests(token, user, updatedAfter, limit)
	if err != nil {
		return nil, err
	}
	openContributions, err := buildOpenContributions(openItems, repoLookup, updatedAfter, limit)
	if err != nil {
		return nil, err
	}

	events, err = hydratePullRequestEvents(events, func(apiURL string) (pullRequestDetails, error) {
		return fetchPullRequestDetails(token, apiURL)
	})
	if err != nil {
		return nil, err
	}
	recentContributions, err := buildContributions(events, repoLookup, limit)
	if err != nil {
		return nil, err
	}

	return mergeContributions(openContributions, recentContributions, limit), nil
}

func fetchOpenPullRequests(token, user string, updatedAfter time.Time, limit int) ([]pullRequestSearchItem, error) {
	query := fmt.Sprintf("author:%s type:pr is:public is:open updated:>=%s", user, updatedAfter.Format(time.DateOnly))
	endpoint := fmt.Sprintf("%s/search/issues?per_page=%d&sort=updated&order=desc&q=%s", restURL, limit, url.QueryEscape(query))
	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("creating open pull requests request: %w", err)
	}

	var response struct {
		Items []pullRequestSearchItem `json:"items"`
	}
	if err = doGitHubRequest(token, req, &response); err != nil {
		return nil, fmt.Errorf("fetching open pull requests: %w", err)
	}
	return response.Items, nil
}

func buildOpenContributions(
	items []pullRequestSearchItem,
	repoLookup func(fullName string) (contributionRepo, error),
	updatedAfter time.Time,
	limit int,
) ([]contributionEntry, error) {
	contributions := make([]contributionEntry, 0, limit)
	for _, item := range items {
		updatedAt, err := time.Parse(time.RFC3339, item.UpdatedAt)
		if err != nil || updatedAt.Before(updatedAfter) {
			continue
		}

		fullName := strings.TrimPrefix(item.RepositoryURL, restURL+"/repos/")
		if fullName == item.RepositoryURL || fullName == "" || item.HTMLURL == "" || item.Title == "" {
			continue
		}

		repo, err := repoLookup(fullName)
		if err != nil {
			return nil, err
		}
		contributions = append(contributions, contributionEntry{
			Repo:     repo,
			Title:    item.Title,
			URL:      item.HTMLURL,
			State:    normalizeContributionState(item.State, ""),
			BodyHTML: item.Body,
		})
		if len(contributions) == limit {
			break
		}
	}
	return contributions, nil
}

func mergeContributions(primary, secondary []contributionEntry, limit int) []contributionEntry {
	contributions := make([]contributionEntry, 0, limit)
	seen := make(map[string]struct{}, limit)
	for _, entries := range [][]contributionEntry{primary, secondary} {
		for _, contribution := range entries {
			if contribution.URL == "" {
				continue
			}
			if _, ok := seen[contribution.URL]; ok {
				continue
			}
			contributions = append(contributions, contribution)
			seen[contribution.URL] = struct{}{}
			if len(contributions) == limit {
				return contributions
			}
		}
	}
	return contributions
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

func fetchRecentCommits(token string, events []publicEvent, limit int) ([]commitEntry, error) {
	return buildRecentCommits(events, func(repo, before, head string) ([]commitDetails, error) {
		return fetchPushCommits(token, repo, before, head)
	}, limit)
}

func fetchPushCommits(token, fullName, before, head string) ([]commitDetails, error) {
	owner, repoName, ok := strings.Cut(fullName, "/")
	if !ok || owner == "" || repoName == "" || head == "" {
		return nil, fmt.Errorf("invalid push event for repository %q", fullName)
	}

	if before == "" || strings.Trim(before, "0") == "" {
		req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/repos/%s/%s/commits/%s", restURL, owner, repoName, head), nil)
		if err != nil {
			return nil, fmt.Errorf("creating commit details request: %w", err)
		}

		var details commitDetails
		if err = doGitHubRequest(token, req, &details); err != nil {
			return nil, fmt.Errorf("fetching commit details for %s: %w", fullName, err)
		}
		return []commitDetails{details}, nil
	}

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/repos/%s/%s/compare/%s...%s", restURL, owner, repoName, before, head), nil)
	if err != nil {
		return nil, fmt.Errorf("creating commit comparison request: %w", err)
	}

	var comparison struct {
		Commits []commitDetails `json:"commits"`
	}
	if err = doGitHubRequest(token, req, &comparison); err != nil {
		return nil, fmt.Errorf("fetching commits for %s: %w", fullName, err)
	}
	return comparison.Commits, nil
}

func buildRecentCommits(
	events []publicEvent,
	lookup func(repo, before, head string) ([]commitDetails, error),
	limit int,
) ([]commitEntry, error) {
	commits := make([]commitEntry, 0, limit)
	seen := make(map[string]struct{}, limit)

	for _, event := range events {
		if event.Type != "PushEvent" || event.Repo.Name == "" || event.Payload.Head == "" {
			continue
		}

		details, err := lookup(event.Repo.Name, event.Payload.Before, event.Payload.Head)
		if err != nil {
			return nil, err
		}

		for i := len(details) - 1; i >= 0; i-- {
			commit := details[i]
			if commit.SHA == "" || commit.Commit.Message == "" {
				continue
			}
			if _, ok := seen[commit.SHA]; ok {
				continue
			}

			commitURL := commit.HTMLURL
			if commitURL == "" {
				commitURL = fmt.Sprintf("https://github.com/%s/commit/%s", event.Repo.Name, commit.SHA)
			}
			commits = append(commits, commitEntry{
				Repo:    event.Repo.Name,
				SHA:     commit.SHA,
				Message: strings.SplitN(commit.Commit.Message, "\n", 2)[0],
				URL:     commitURL,
				Date:    commit.Commit.Author.Date,
			})
			seen[commit.SHA] = struct{}{}

			if len(commits) == limit {
				return commits, nil
			}
		}
	}

	return commits, nil
}

func mergeRecentProjects(recent, existing []repoEntry, limit int) []repoEntry {
	projects := make([]repoEntry, 0, len(recent)+len(existing))
	indexes := make(map[string]int, len(recent)+len(existing))

	for _, entries := range [][]repoEntry{existing, recent} {
		for _, project := range entries {
			if project.User == "" || project.Repo == "" {
				continue
			}
			key := strings.ToLower(project.User + "/" + project.Repo)
			if index, ok := indexes[key]; ok {
				if project.Language == nil {
					project.Language = projects[index].Language
				}
				projects[index] = project
				continue
			}
			indexes[key] = len(projects)
			projects = append(projects, project)
		}
	}

	sort.SliceStable(projects, func(i, j int) bool {
		return projects[i].Stars > projects[j].Stars
	})
	if len(projects) > limit {
		projects = projects[:limit]
	}
	return projects
}

func fetchPullRequestDetails(token, apiURL string) (pullRequestDetails, error) {
	if !strings.HasPrefix(apiURL, restURL+"/repos/") {
		return pullRequestDetails{}, fmt.Errorf("invalid pull request API URL %q", apiURL)
	}

	req, err := http.NewRequest(http.MethodGet, apiURL, nil)
	if err != nil {
		return pullRequestDetails{}, fmt.Errorf("creating pull request details request: %w", err)
	}

	var details pullRequestDetails
	if err = doGitHubRequest(token, req, &details); err != nil {
		return pullRequestDetails{}, fmt.Errorf("fetching pull request details: %w", err)
	}

	return details, nil
}

func hydratePullRequestEvents(
	events []publicEvent,
	lookup func(apiURL string) (pullRequestDetails, error),
) ([]publicEvent, error) {
	cache := make(map[string]pullRequestDetails)

	for i := range events {
		event := &events[i]
		if event.Type != "PullRequestEvent" || event.Payload.PullRequest.Title != "" {
			continue
		}

		apiURL := event.Payload.PullRequest.APIURL
		if apiURL == "" {
			continue
		}

		details, ok := cache[apiURL]
		if !ok {
			var err error
			details, err = lookup(apiURL)
			if err != nil {
				return nil, err
			}
			cache[apiURL] = details
		}

		event.Payload.PullRequest = details
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

	contributedRepos := make([]repoEntry, 0, len(gqlResp.Data.User.ContributionsCollection.CommitContributionsByRepository))
	for _, contribution := range gqlResp.Data.User.ContributionsCollection.CommitContributionsByRepository {
		n := contribution.Repository
		if n.Name == "" || n.Owner.Login == "" || n.IsPrivate {
			continue
		}
		entry := repoEntry{Repo: n.Name, User: n.Owner.Login, Description: n.Description, Stars: n.StargazerCount, Forks: n.ForkCount}
		if n.PrimaryLanguage != nil {
			entry.Language = &repoLanguage{Name: n.PrimaryLanguage.Name, Color: n.PrimaryLanguage.Color}
		}
		contributedRepos = append(contributedRepos, entry)
	}
	repos = mergeRecentProjects(contributedRepos, repos, 20)

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
