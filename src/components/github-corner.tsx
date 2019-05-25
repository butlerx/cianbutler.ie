import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as styles from './github-corner.module.scss';
import OctoCat from './github-corner.svg';

interface GithubCornerProps {
  repo: string;
}

export class GithubCorner extends Component<GithubCornerProps, {}> {
  public static defaultProps = {
    repo: 'butlerx/cv',
  };
  public render() {
    const { repo } = this.props;
    const url = `https://github.com/${repo}`;
    return (
      <a href={url} className={styles.githubCorner} aria-label='View source on Github'>
        <OctoCat />
      </a>
    );
  }
}
