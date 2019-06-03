import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import * as styles from './projects.module.scss';

export interface PinnedRepositoryData {
  name: string;
  url: string;
  description: string;
}

interface ProjectsProps {
  data: PinnedRepositoryData[];
}

export const Projects: SFC<ProjectsProps> = ({ data }) => (
  <div className={styles.projectList}>
    {data.sort().map(({ url, name, description }, i) => (
      <div key={i} className={styles.project}>
        <span className={styles.projectListElement}>
          <h3 className={styles.projectListElementTitle}>
            <FontAwesomeIcon icon={['fab', 'github']} size='lg' />
            <strong>
              <a href={url}>{name}</a>
            </strong>
          </h3>
          <span className={styles.projectListElementDescription}>{description}</span>
        </span>
      </div>
    ))}
  </div>
);
