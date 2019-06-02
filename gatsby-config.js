const siteMetadata = {
  title: 'Cian Butler',
  description: 'Cian Butler, open source developer and SRE',
  siteUrl: 'https://cianbutler.ie',
  author: 'Cian Butler',
  repo: 'butlerx/cv',
  colour: '#ffffff',
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
};

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/content/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteMetadata.description,
        short_name: siteMetadata.title,
        start_url: '/',
        background_color: siteMetadata.colour,
        theme_color: siteMetadata.colour,
        display: 'standalone',
        icon: 'content/images/me.png',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sass',
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
          repositoryOwner(login: $author) {
            ... on User {
              pinnedRepositories(first:6) {
                edges {
                  node {
                    name
                    url
                    description
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
          q: `author:${
            siteMetadata.social.github.user
          } is:merged state:closed type:pr sort:comments`,
        },
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'content',
        name: 'markdown-pages',
      },
    },
    'gatsby-transformer-remark',
  ],
};
