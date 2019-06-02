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
  data: Array<{
    node: RepositoryData;
  }>;
  readMeLength: number;
}

export const Repositories: SFC<RepositoriesProps> = ({ data, readMeLength }) => (
  <Cards>
    {data.map(({ node }, i) => (
      <Card
        key={i}
        url={node.url}
        title={node.nameWithOwner}
        icon='github'
        count={node.stargazers.totalCount}
      >
        <ReactMarkdown
          source={
            node.readme.text.length > readMeLength
              ? trimReadme(node.readme.text, readMeLength)
              : node.readme.text
          }
        />
      </Card>
    ))}
  </Cards>
);

Repositories.defaultProps = {
  readMeLength: 400,
};
