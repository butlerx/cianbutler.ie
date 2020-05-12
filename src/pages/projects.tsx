import { graphql } from 'gatsby';
import React, { SFC } from 'react';
import {
  ContributionData,
  Contributions,
  Layout,
  Repositories,
  RepositoryData,
  Section,
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
            nodes: RepositoryData[];
          };
        };
        search: {
          nodes: ContributionData[];
        };
      };
    };
  };
}

const projects: SFC<ProjectPageProps> = ({
  data: {
    site: {
      siteMetadata: { description, title, author, menu },
    },
    githubData: {
      data: { user, search },
    },
  },
}) => (
  <Layout
    title={title}
    currentPage='projects'
    pages={menu}
    internalLinks={['Recent projects', 'Recent contributions']}
    twitter={author}
    description={description}
  >
    <Section label='Recent projects' />
    <Repositories data={user.repositories.nodes} />
    <Section label='Recent contributions' />
    <Contributions data={search.nodes} />
  </Layout>
);

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
          nodes {
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
        user {
          repositories {
            nodes {
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
`;
