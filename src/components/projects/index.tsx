import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import * as styles from './projects.module.scss';

export interface PinnedRepositoryData {
  name: string;
  url: string;
  description: string;
}

interface ProjectsProps {
  data: Array<{ node: PinnedRepositoryData }>;
}

export const Projects: SFC<ProjectsProps> = ({ data }) => (
  <div className={styles.projectList}>
    {data.sort().map(({ node }, i) => (
      <div key={i} className={styles.project}>
        <span className={styles.projectListElement}>
          <h3 className={styles.projectListElementTitle}>
            <FontAwesomeIcon icon={['fab', 'github']} size='lg' />
            &nbsp;&nbsp;
            <strong>
              <a href={node.url}>{node.name}</a>
            </strong>
          </h3>
          <span className={styles.projectListElementDescription}>{node.description}</span>
        </span>
      </div>
    ))}
  </div>
);
