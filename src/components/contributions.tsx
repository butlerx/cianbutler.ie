import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import * as styles from './contributions.module.scss';

export interface ContributionData {
  title: string;
  merged: string;
  state: string;
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

export class Contributions extends Component<ContributionsProps, {}> {
  public static defaultProps = {};

  public render() {
    const { data } = this.props;
    return (
      <div className={styles.projectList}>
        {data.map(({ node }, i) => (
          <div key={i} className={styles.project}>
            <span className={styles.projectListElement}>
              <h3 className={styles.projectListElementTitle}>
                <strong>
                  <a href={node.repository.repoUrl}>{node.title}</a>
                </strong>
              </h3>
              <span className={styles.projectListElementDescription}>
                <ReactMarkdown source={node.state} />,
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
}
