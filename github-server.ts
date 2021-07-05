import { graphql } from "https://cdn.skypack.dev/@octokit/graphql";

interface RepositoryData {
  name: string;
  owner: {
    login: string;
  };
}

interface PinnedRepos {
  repositoryOwner: {
    pinnedItems: {
      nodes: RepositoryData[];
    };
  };
}

const pinnedRepos = (user: string, token: string): PinnedRepos =>
  graphql(
    `
      query($author: String = "") {
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
      author: user,
      headers: {
        authorization: `token ${token}`,
      },
    },
  );

interface ContributionData {
  search: {
    nodes: {
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
    }[];
  };
}
const contributionSearch = (user: string, token: string): ContributionData =>
  graphql(
    `
      query($searchFirst: Int = 0, $q: String = "") {
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
      }
    `,
    {
      searchFirst: 10,
      q: `author:${user} type:pr`,
      headers: {
        authorization: `token ${token}`,
      },
    },
  );

interface UserRepoResults {
  user: {
    repositories: {
      nodes: RepositoryData[];
    };
  };
}
const userRepos = (user: string, token: string): UserRepoResults =>
  graphql(
    `
      query($author: String = "", $userFirst: Int = 0) {
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
      }
    `,
    {
      author: user,
      userFirst: 10,
      headers: {
        authorization: `token ${token}`,
      },
    },
  );

const jsonResponse = (data: object): Response =>
  new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
  if (GITHUB_TOKEN === undefined) return new Response("No token provided");
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/pinnedRepos")) {
    const { repositoryOwner } = await pinnedRepos("butlerx", GITHUB_TOKEN);
    const pinnedItems = repositoryOwner.pinnedItems.nodes.map(
      ({ name, owner }) => ({
        repo: name,
        user: owner.login,
      }),
    );
    return jsonResponse(pinnedItems);
  }
  if (pathname.startsWith("/repos")) {
    const { user } = await userRepos("butlerx", GITHUB_TOKEN);
    const repos = user.repositories.nodes
      .filter(({ name, owner }) => name !== null && owner !== null)
      .map(({ name, owner }, i) => ({ repo: name, user: owner.login }));

    return jsonResponse(repos);
  }
  if (pathname.startsWith("/contributions")) {
    const { search } = await contributionSearch("butlerx", GITHUB_TOKEN);
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
    return jsonResponse(contributions);
  }
  return jsonResponse([]);
}
