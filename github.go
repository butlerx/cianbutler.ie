package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
)

const graphqlURL = "https://api.github.com/graphql"
const query = `query (
  $author: String = ""
  $userFirst: Int = 0
  $searchFirst: Int = 0
  $q: String = ""
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
  search(query: $q, type: ISSUE, first: $searchFirst) {
    nodes {
      ... on PullRequest {
        title
        url
        state
        bodyHTML
        repository {
          stargazers {
            totalCount
          }
          repoUrl: url
          name
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
		Search struct {
			Nodes []struct {
				Title      string `json:"title"`
				URL        string `json:"url"`
				State      string `json:"state"`
				BodyHTML   string `json:"bodyHTML"`
				Repository struct {
					RepoURL string `json:"repoUrl"`
					Name    string `json:"name"`
					Owner   struct {
						Login string `json:"login"`
					} `json:"owner"`
					Stargazers struct {
						TotalCount int `json:"totalCount"`
					} `json:"stargazers"`
				} `json:"repository"`
			} `json:"nodes"`
		} `json:"search"`
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

	out := buildOutput(gqlResp)

	if err = writeJSONToFile(cfg.outputPath, out); err != nil {
		return fmt.Errorf("writing output to %s: %w", cfg.outputPath, err)
	}
	return nil
}

func fetchGitHubData(token, user string) (*graphQLResponse, error) {
	reqBody := graphQLRequest{
		Query: query,
		Variables: map[string]any{
			"author":      user,
			"userFirst":   10,
			"searchFirst": 10,
			"q":           fmt.Sprintf("author:%s type:pr is:public", user),
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

func buildOutput(gqlResp *graphQLResponse) output {
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

	contributions := make([]contributionEntry, 0, len(gqlResp.Data.Search.Nodes))
	for _, n := range gqlResp.Data.Search.Nodes {
		contributions = append(contributions, contributionEntry{
			Repo: contributionRepo{
				URL:   n.Repository.RepoURL,
				Name:  n.Repository.Name,
				Owner: n.Repository.Owner.Login,
				Stars: n.Repository.Stargazers.TotalCount,
			},
			Title:    n.Title,
			URL:      n.URL,
			State:    n.State,
			BodyHTML: n.BodyHTML,
		})
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
