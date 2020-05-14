import React, { SFC } from 'react';
import { Avatar } from './shared/avatar';
import { ContributionData, Contributions } from './projects/contributions';
import { Experience, ExperienceData } from './shared/experience';
import { Languages } from './shared/languages';
import { Layout } from './shared/layout';
import { Repositories, RepositoryData } from './shared/repositories';
import { Section } from './shared/section';

interface ProjectProps {
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

export const Projects: SFC<ProjectProps> = ({
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
