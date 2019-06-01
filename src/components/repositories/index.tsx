import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';

import ReactMarkdown from 'react-markdown';
import { trimReadme } from '../../utils';
import * as styles from './repositories.module.scss';

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
  titleLength: number;
  readMeLength: number;
}

export const Repositories: SFC<RepositoriesProps> = ({ data, titleLength, readMeLength }) => (
  <div className={styles.projectList}>
    {data.map(({ node }, i) => (
      <div key={i} className={styles.projectOuter}>
        <div className={styles.project}>
          <div className={styles.projectTitle}>
            <span className={styles.projectTitleText}>{node.nameWithOwner}</span>
            <span className={styles.projectTitleSpace} />
            <span className={styles.projectTitlelinks}>
              <a href={node.url} target='_blank' className={styles.link} title='GitHub'>
                <FontAwesomeIcon icon={['fab', 'github']} />
              </a>
            </span>
          </div>
          <ReactMarkdown
            className={styles.projectDesc}
            source={
              node.readme.text.length > readMeLength
                ? trimReadme(node.readme.text, readMeLength)
                : node.readme.text
            }
          />
        </div>
      </div>
    ))}
  </div>
);

Repositories.defaultProps = {
  readMeLength: 400,
  titleLength: 20,
};
