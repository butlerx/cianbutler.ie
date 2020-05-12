import React, { SFC } from 'react';
import ReactMarkdown from 'react-markdown';
import { trimReadme } from '../utils';
import { Cards } from './cards';
import { GithubCard } from './cards/githubCard';

export interface RepositoryData {
  name: string;
  owner: {
    login: string;
  };
}

interface RepositoriesProps {
  data: RepositoryData[];
}

export const Repositories: SFC<RepositoriesProps> = ({ data }) => (
  <Cards>
    {data
      .filter(({ name, owner }) => name !== null && owner !== null)
      .map(({ name, owner }, i) => (
        <GithubCard key={i} repo={name} user={owner.login} />
      ))}
  </Cards>
);
