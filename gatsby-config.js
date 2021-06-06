require('dotenv').config();

const author = 'Cian Butler';
const blurb = 'Open Source Developer';
const job = 'SRE';

const siteMetadata = {
  title: author,
  description: `${author}, ${blurb} and ${job}`,
  blurb,
  job,
  siteUrl: 'https://cianbutler.ie',
  author,
  repo: 'butlerx/cianbutler.ie',
  colour: '#ffffff',
  menu: ['me', 'projects', 'blog'],
  languages: [
    'AWS',
    'GCP',
    'C',
    'Docker',
    'Go',
    'Java',
    'JavaScript',
    'Kotlin',
    'Kubernetes',
    'Linux',
    'Node',
    'PostgreSQL',
    'Puppet',
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
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-tslint',
    'gatsby-plugin-typescript',
    'gatsby-remark-images',
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
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
        name: 'yaml',
        path: `${__dirname}/content/data`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
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
          q: `author:${siteMetadata.social.github.user} type:pr`,
        },
      },
    },
  ],
};
