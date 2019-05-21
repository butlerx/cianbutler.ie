import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import * as styles from './repositories.scss';

export interface RepositoryData {
  name: string;
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
}

export class Repositories extends React.Component<RepositoriesProps, {}> {
  public static defaultProps = {
    titleLength: 20,
  };

  public render() {
    const { data, titleLength } = this.props;
    return (
      <>
        {data.map(({ node }, i) => (
          <div key={i} className={styles.projectOuter}>
            <div className={styles.project}>
              <div
                className={
                  node.name.length > titleLength ? styles.projectTitleSmall : styles.projectTitle
                }
              >
                <span className={styles.projectName}>{node.name}</span>
                <span style={{ flexGrow: 100 }} />
                <span className={styles.projectLinks}>
                  <a
                    href={node.url}
                    target='_blank'
                    className={[styles.logo, 'fa fa-github'].join(' ')}
                    title='GitHub'
                  />
                </span>
              </div>
              <ReactMarkdown className={styles.projectDesc} source={node.readme.text} />,
            </div>
          </div>
        ))}
      </>
    );
  }
}
