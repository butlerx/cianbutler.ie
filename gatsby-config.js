require('dotenv').config();

const siteMetadata = {
  title: 'Cian Butler',
  description: 'Cian Butler, open source developer and SRE',
  siteUrl: 'https://cianbutler.ie',
  author: 'Cian Butler',
  repo: 'butlerx/cianbutler.ie',
  colour: '#ffffff',
  menu: ['me', 'projects', 'blog'],
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
};

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sass',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/content/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'markdown-pages',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteMetadata.description,
        short_name: siteMetadata.title,
        start_url: '/',
        background_color: siteMetadata.colour,
        theme_color: siteMetadata.colour,
        display: 'standalone',
        icon: `${__dirname}/content/images/me.png`,
      },
    },
    {
      resolve: 'gatsby-transformer-yaml',
      options: {
        typeName: 'Yaml',
      },
    },
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
        query ($author: String = "", $userFirst: Int = 0, $searchFirst: Int = 0, $q: String = "") {
          user(login: $author) {
            repositories(first: $userFirst, orderBy: {field: STARGAZERS, direction: DESC}) {
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
                merged
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
              pinnedItems(first:6) {
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
        }`,
        variables: {
          author: siteMetadata.social.github.user,
          userFirst: 10,
          searchFirst: 10,
          q: `author:${siteMetadata.social.github.user} is:merged state:closed type:pr sort:comments`,
        },
      },
    },
  ],
};
