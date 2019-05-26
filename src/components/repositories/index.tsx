import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
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

export class Repositories extends React.Component<RepositoriesProps, {}> {
  public static defaultProps = {
    readMeLength: 400,
    titleLength: 20,
  };
  public render() {
    const { data, titleLength, readMeLength } = this.props;
    return (
      <div style={{ display: 'flex', width: '100%', 'flex-flow': 'row wrap' }}>
        {data.map(({ node }, i) => (
          <div
            key={i}
            className={styles.projectOuter}
            style={{
              //height: '232px',
              'margin-top': '1rem',
              padding: '0',
              //width: '33%',
            }}
          >
            <div
              className={styles.project}
              style={{
                border: '0 solid #7d97ad',
                'box-shadow': '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
                display: 'flex',
                'flex-direction': 'column',
                //height: '200px',
                margin: '0 0.4rem',
                padding: '16px 1rem',
                transition: '0.4s',
              }}
            >
              <div
                className={styles.projectTitle}
                style={{
                  display: 'flex',
                  'flex-direction': 'row',
                  'font-size': '1.5rem',
                  height: 'auto',
                  'min-height': '2rem',
                }}
              >
                <span style={{ margin: '0 1rem 0 0', width: '100%' }}>{node.nameWithOwner}</span>
                <span style={{ width: '100%' }} />
                <span
                  style={{
                    margin: '0 1rem',
                    opacity: 0.54,
                    'white-space': 'nowrap',
                  }}
                >
                  <a
                    href={node.url}
                    target='_blank'
                    style={{
                      height: '1rem',
                      'margin-left': '0 0.2rem 0 0.4rem',
                      width: '1rem',
                    }}
                    title='GitHub'
                  >
                    <FontAwesomeIcon icon={['fab', 'github']} />
                  </a>
                </span>
              </div>
              <ReactMarkdown
                className={styles.projectDesc}
                style={{
                  'flex-grow': 100,
                  margin: '0.5rem 0 0 0',
                  opacity: 0.65,
                }}
                source={
                  node.readme.text.length > readMeLength
                    ? this.trimReadme(node.readme.text, readMeLength)
                    : node.readme.text
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  private trimReadme = (readme: string, length: number): string =>
    `${readme.substring(0, length)}...`;
}
