import { graphql, Link } from 'gatsby';
import React, { SFC } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

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
      <ScrollableAnchor id='Recent projects'>
        <Section label='Recent projects' />
      </ScrollableAnchor>
      <Repositories data={user.repositories.edges} />
      <ScrollableAnchor id='Recent contributions'>
        <Section label='Recent contributions' />
      </ScrollableAnchor>
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
