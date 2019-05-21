import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import * as React from 'react';
import OctoCat from './github-corner.svg';
import * as styles from './layout.scss';

interface GithubCornerProps {
  repo: string;
}

export class GithubCorner extends React.Component<GithubCornerProps, {}> {
  public static defaultProps = {
    repo: 'butlerx/cv',
  };
  public render() {
    const { repo } = this.props;
    const url = `https://github.com/${repo}`;
    return (
      <a href={url} className={styles.GithubCorner} aria-label='View source on Github'>
        <OctoCat />
      </a>
    );
  }
}
