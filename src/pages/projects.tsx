import { graphql, Link } from 'gatsby';
import React, { SFC } from 'react';
import {
  ContributionData,
  Contributions,
  Layout,
  Repositories,
  RepositoryData,
  Section,
  SEO,
} from '../components';

interface ProjectPageProps {
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

const projects: SFC<ProjectPageProps> = props => {
  const { description, title, author, menu } = props.data.site.siteMetadata;
  const { user, search } = props.data.githubData.data;
  return (
    <Layout
      title={title}
      currentPage='projects'
      pages={menu}
      internalLinks={['Recent projects', 'Recent contributions']}
      twitter={author}
      description={description}
    >
      <Section label='Recent projects' />
      <Repositories data={user.repositories.edges} />
      <Section label='Recent contributions' />
      <Contributions data={search.edges} />
    </Layout>
  );
};

export default projects;
export const ProjectPageQuery = graphql`
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
              bodyHTML
              repository {
                name
                repoUrl
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
        user {
          repositories {
            edges {
              node {
                nameWithOwner
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
