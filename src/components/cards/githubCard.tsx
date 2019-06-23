import React, { FC } from 'react';
import * as styles from './cards.module.scss';

interface GithubCardProps {
  user: string;
  repo: string;
}

export const GithubCard: FC<GithubCardProps> = ({ repo, user }) => (
  <div className={styles.cardOuter}>
    <a href={`https://github.com/${user}/${repo}`}>
      <img
        src={`https://gh-card.dev/repos/${user}/${repo}.svg?fullname`}
        className={styles.ghCard}
      />
    </a>
  </div>
);
