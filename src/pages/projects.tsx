import { graphql, Link } from 'gatsby';
import * as React from 'react';

import {
  ContributionData,
  Contributions,
  Layout,
  Repositories,
  RepositoryData,
  Section,
  SEO,
} from '../components';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
        menu: string[];
      };
    };
    githubData: {
      data: {
        user: {
          repositories: {
            edges: Array<{
              node: RepositoryData;
            }>;
          };
        };
        search: {
          edges: Array<{
            node: ContributionData;
          }>;
        };
      };
    };
  };
}

export const IndexPageQuery = graphql`
  query ProjectQuery {
    site {
      siteMetadata {
        author
        title
        menu
      }
    }
    githubData {
      data {
        search {
          edges {
            node {
              title
              merged
              url
              state
              repository {
                repoUrl
                stargazers {
                  totalCount
                }
                name
              }
            }
          }
        }
        user {
          repositories {
            edges {
              node {
                name
                description
                url
                stargazers {
                  totalCount
                }
                readme {
                  text
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default class IndexPage extends React.Component<IndexPageProps, {}> {
  public render() {
    const { description, title, author, menu } = this.props.data.site.siteMetadata;
    const { user, search } = this.props.data.githubData.data;
    return (
      <Layout title={title} currentPage='projects' pages={menu} internalLinks={[]}>
        <SEO pageTitle='Home' author={author} title={title} description={description} />
        <Section label='Recent projects' />
        <Repositories data={user.repositories.edges} />
        <Section label='Recent contributions' />
        <Contributions data={search.edges} />
      </Layout>
    );
  }
}
