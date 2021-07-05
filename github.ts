import { graphql } from "https://cdn.skypack.dev/@octokit/graphql";

const GITHUB_USER = "butlerx";
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

interface SearchResults {
  user: {
    repositories: {
      nodes: RepositoryData[];
    };
  };
  search: {
    nodes: ContributionData[];
  };
  repositoryOwner: {
    pinnedItems: {
      nodes: RepositoryData[];
    };
  };
}

interface RepositoryData {
  name: string;
  owner: {
    login: string;
  };
}

interface ContributionData {
  repository: {
    repoUrl: string;
    name: string;
    stargazers: {
      totalCount: number;
    };
  };
  title: string;
  url: string;
  state: string;
  bodyHTML: string;
}

const { user, search, repositoryOwner }: SearchResults = await graphql(
  `
    query(
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
                owner {
                  login
                }
              }
            }
          }
        }
      }
    }
  `,
  {
    author: GITHUB_USER,
    userFirst: 10,
    searchFirst: 10,
    q: `author:${GITHUB_USER} type:pr`,
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  },
);

try {
  const path = "data/github.json";
  const pinnedRepos = repositoryOwner.pinnedItems.nodes.map(
    ({ name, owner }) => ({
      repo: name,
      user: owner.login,
    }),
  );

  const repos = user.repositories.nodes
    .filter(({ name, owner }) => name !== null && owner !== null)
    .map(({ name, owner }, i) => ({ repo: name, user: owner.login }));

  const contributions = search.nodes.map(
    ({ repository, title, url, state, bodyHTML }) => ({
      repo: {
        url: repository.repoUrl,
        name: repository.name,
        stars: repository.stargazers.totalCount,
      },
      title: title,
      url: url,
      state: state,
      bodyHTML: bodyHTML,
    }),
  );

  Deno.writeTextFileSync(
    path,
    JSON.stringify({ pinnedRepos, repos, contributions }),
  );

  console.log(`Written to ${path}`);
} catch (e) {
  console.error(e.message);
}
