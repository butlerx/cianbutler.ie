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
  titleLength: number;
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
  data: ContributionData[];
}

const Contribution: SFC<ContributionProps> = ({
  title,
  titleLength,
  merged,
  url,
  state,
  bodyHTML,
}) => (
  <div className={styles.project}>
    <span className={styles.projectElement}>
      <div className={styles.projectElementHeader}>
        <div>
          <h4
            className={
              title.length < titleLength
                ? styles.projectElementTitle
                : styles.projectElementTitleSmall
            }
          >
            <a href={url}>{title}</a>
          </h4>
        </div>
        <State status={state} />
      </div>
      <span
        dangerouslySetInnerHTML={{ __html: bodyHTML }}
        className={styles.projectElementDescription}
      />
    </span>
  </div>
);

Contribution.defaultProps = {
  titleLength: 30,
};

export const Contributions: SFC<ContributionsProps> = ({ data }) => (
  <Cards>
    {data.map(({ repository, title, merged, url, state, bodyHTML }, i) => (
      <Card
        key={i}
        icon='github'
        url={repository.repoUrl}
        title={repository.name}
        count={repository.stargazers.totalCount}
      >
        <Contribution
          title={title}
          merged={merged}
          url={url}
          state={state}
          bodyHTML={bodyHTML}
        />
      </Card>
    ))}
  </Cards>
);
