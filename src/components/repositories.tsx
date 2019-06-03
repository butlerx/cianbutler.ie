import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import ReactMarkdown from 'react-markdown';
import { trimReadme } from '../utils';
import { Card, Cards } from './cards';

export interface RepositoryData {
  nameWithOwner: string;
  description: string;
  url: string;
  stargazers: {
    totalCount: number;
  };
  readme: {
    text: string;
  };
}

interface RepositoriesProps {
  data: RepositoryData[];
  readMeLength: number;
}

export const Repositories: SFC<RepositoriesProps> = ({ data, readMeLength }) => (
  <Cards>
    {data.map(({ url, nameWithOwner, stargazers, readme }, i) => (
      <Card key={i} url={url} title={nameWithOwner} icon='github' count={stargazers.totalCount}>
        <ReactMarkdown
          source={
            readme.text.length > readMeLength ? trimReadme(readme.text, readMeLength) : readme.text
          }
        />
      </Card>
    ))}
  </Cards>
);

Repositories.defaultProps = {
  readMeLength: 400,
};
