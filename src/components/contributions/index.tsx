import React, { SFC } from 'react';
import { Card, Cards } from '..';
import * as styles from './contributions.module.scss';
import { State } from './state';

interface ContributionProps {
  title: string;
  merged: string;
  url: string;
  state: string;
  bodyHTML: string;
}
export interface ContributionData extends ContributionProps {
  repository: {
    repoUrl: string;
    name: string;
    stargazers: {
      totalCount: number;
    };
  };
}

interface ContributionsProps {
  data: Array<{
    node: ContributionData;
  }>;
}

const Contribution: SFC<ContributionProps> = ({ title, merged, url, state, bodyHTML }) => (
  <div className={styles.project}>
    <span className={styles.projectElement}>
      <div className={styles.projectElementHeader}>
        <h4 className={styles.projectElementTitle}>
          <a href={url}>{title}</a>
        </h4>
        <State status={state} />
      </div>
      <span
        dangerouslySetInnerHTML={{ __html: bodyHTML }}
        className={styles.projectElementDescription}
      />
    </span>
  </div>
);

export const Contributions: SFC<ContributionsProps> = ({ data }) => (
  <Cards>
    {data.map(({ node }, i) => (
      <Card
        key={i}
        icon='github'
        url={node.repository.repoUrl}
        title={node.repository.name}
        count={node.repository.stargazers.totalCount}
      >
        <Contribution
          title={node.title}
          merged={node.merged}
          url={node.url}
          state={node.state}
          bodyHTML={node.bodyHTML}
        />
      </Card>
    ))}
  </Cards>
);
