import { graphql, Link } from 'gatsby';
import React, { Component } from 'react';
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

export default class ProjectPage extends Component<ProjectPageProps, {}> {
  public render() {
    const { description, title, author, menu } = this.props.data.site.siteMetadata;
    const { user, search } = this.props.data.githubData.data;
    return (
      <Layout
        title={title}
        currentPage='projects'
        pages={menu}
        internalLinks={['Recent projects', 'Recent contributions']}
      >
        <SEO pageTitle='Projects' author={author} title={title} description={description} />
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
  }
}
