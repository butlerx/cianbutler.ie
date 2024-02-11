package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/exp/slog"
	"golang.org/x/oauth2"
)

const (
	githubUser    = "butlerx"
	errorExitCode = 2
	numCliArgs    = 2
	numSearchArgs = 10
	outputPerms   = 0o600
)

type SearchResults struct {
	User            User            `graphql:"user(login: $author)"`
	Search          Search          `graphql:"search(query: $q, type: ISSUE, first: $searchFirst)"`
	RepositoryOwner RepositoryOwner `graphql:"repositoryOwner(login: $author)"`
}

type RepoNode struct {
	Name  string
	Owner struct {
		Login string
	}
}

type User struct {
	Repositories struct {
		Nodes []RepoNode
	} `graphql:"repositories(first: $userFirst, orderBy: {field: STARGAZERS, direction: DESC})"`
}

type RepositoryOwner struct {
	PinnedItems struct{ Nodes []RepoNode } `graphql:"pinnedItems(first: 6)"`
}

type Search struct {
	Nodes []struct {
		Title      string
		URL        string
		State      string
		BodyHTML   string `graphql:"bodyHTML"`
		Repository struct {
			RepoURL    string `graphql:"url"`
			Name       string
			Stargazers struct {
				TotalCount int
			}
		}
	} `graphql:"nodes"`
}

type Repo struct {
	Repo string `json:"repo"`
	User string `json:"user"`
}

type Contribution struct {
	Repo     ContributionRepo `json:"repo"`
	Title    string           `json:"title"`
	URL      string           `json:"url"`
	State    string           `json:"state"`
	BodyHTML string           `json:"bodyHTML"`
}

type ContributionRepo struct {
	URL   string `json:"url"`
	Name  string `json:"name"`
	Stars int    `json:"stars"`
}

type Output struct {
	PinnedRepos   []Repo         `json:"pinnedRepos"`
	Repos         []Repo         `json:"repos"`
	Contributions []Contribution `json:"contributions"`
}

func getDataFilePath() string {
	if len(os.Args) < numCliArgs {
		return "data/github.json"
	}

	return os.Args[1]
}

func main() {
	githubToken := os.Getenv("GITHUB_TOKEN")
	if githubToken == "" {
		slog.Error("Environment variable GITHUB_TOKEN is not set")
		os.Exit(errorExitCode)
	}

	ctx := context.Background()

	results, err := queryGitHub(ctx, githubToken)
	if err != nil {
		slog.Error("Failed to query GitHub", "user", githubUser, "error", err)
		os.Exit(errorExitCode)
	}

	pinnedRepos := serialiseRepos(results.RepositoryOwner.PinnedItems.Nodes)
	repos := serialiseRepos(results.User.Repositories.Nodes)

	contributions := make([]Contribution, len(results.Search.Nodes))
	for i, contribution := range results.Search.Nodes {
		contributions[i] = Contribution{
			Repo: ContributionRepo{
				URL:   contribution.Repository.RepoURL,
				Name:  contribution.Repository.Name,
				Stars: contribution.Repository.Stargazers.TotalCount,
			},
			Title:    contribution.Title,
			URL:      contribution.URL,
			State:    contribution.State,
			BodyHTML: contribution.BodyHTML,
		}
	}

	path := getDataFilePath()

	if err = writeDataFile(path, pinnedRepos, repos, contributions); err != nil {
		slog.Error("Failed to create data file", "path", path, "error", err)
		os.Exit(errorExitCode)
	}

	slog.Info("Written to file", "path", path)
}

func queryGitHub(ctx context.Context, githubToken string) (SearchResults, error) {
	src := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: githubToken})
	httpClient := oauth2.NewClient(ctx, src)
	client := githubv4.NewClient(httpClient)

	var results SearchResults
	if err := client.Query(ctx, &results, map[string]any{
		"author":      githubv4.String(githubUser),
		"userFirst":   githubv4.Int(numSearchArgs),
		"searchFirst": githubv4.Int(numSearchArgs),
		"q":           githubv4.String(fmt.Sprintf("author:%s type:pr", githubUser)),
	}); err != nil {
		return SearchResults{}, fmt.Errorf("error querying GitHub: %w", err)
	}

	return results, nil
}

func serialiseRepos(nodes []RepoNode) []Repo {
	repos := make([]Repo, len(nodes))
	for i, repo := range nodes {
		repos[i] = Repo{Repo: repo.Name, User: repo.Owner.Login}
	}

	return repos
}

func writeDataFile(path string, pinnedRepos, repos []Repo, contributions []Contribution) error {
	output := Output{PinnedRepos: pinnedRepos, Repos: repos, Contributions: contributions}

	outputJSON, err := json.Marshal(output)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	err = os.WriteFile(path, outputJSON, outputPerms)
	if err != nil {
		return fmt.Errorf("failed to write to file: %w", err)
	}

	return nil
}
