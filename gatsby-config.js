module.exports = {
  siteMetadata: {
    title: 'Cian Butler',
    description: 'Cian Butler, open source developer and SRE',
    siteUrl: 'https://cianbutler.ie',
    author: 'Cian Butler',
    repo: 'butlerx/cv',
    job: 'SRE',
    blurb: 'Open Source Developer',
    menu: ['me', 'projects'],
    languages: [
      'AWS',
      'C',
      'C++',
      'Docker',
      'Go',
      'Java',
      'JavaScript',
      'Kotlin',
      'Kubernetes',
      'Linux',
      'Node',
      'PostgreSQL',
      'Python',
      'Rust',
      'SCSS',
      'TypeScript',
    ],
    social: {
      twitter: {
        icon: 'twitter',
        user: 'cianbutlerx',
      },
      github: {
        icon: 'github-alt',
        user: 'butlerx',
      },
      email: {
        icon: 'envelope',
        address: 'butlerx@notthe.cloud',
      },
      linkedIn: {
        icon: 'linkedin',
        user: 'butlerx',
      },
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Cian Butler, Personal site`,
        short_name: `Cian Butler`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: '#ffffff',
        display: 'standalone',
        icon: `src/images/me.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-transformer-yaml`,
      options: {
        typeName: `Yaml`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`,
      },
    },
    {
      resolve: `gatsby-source-github-api`,
      options: {
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
        query ($author: String = "", $userFirst: Int = 0, $searchFirst: Int = 0, $q: String = "") {
          user(login: $author) {
            repositories(first: $userFirst, orderBy: {field: STARGAZERS, direction: DESC}) {
              edges {
                node {
                  nameWithOwner
                  description
                  url
                  stargazers {
                    totalCount
                  }
                  readme: object(expression:"master:README.md"){
                    ... on Blob{
                      text
                    }
                  }
                }
              }
            }
          }
          search(query: $q, type: ISSUE, first: $searchFirst) {
            edges {
              node {
                ... on PullRequest {
                  title
                  merged
                  url
                  state
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
          repositoryOwner(login: $author) {
            ... on User {
              pinnedRepositories(first:6) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }`,
        variables: {
          author: 'butlerx',
          userFirst: 10,
          searchFirst: 10,
          q: 'author:butlerx is:merged state:closed type:pr sort:comments',
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `src/content`,
        name: 'markdown-pages',
      },
    },
    `gatsby-transformer-remark`,
  ],
};
