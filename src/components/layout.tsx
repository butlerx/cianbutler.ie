import * as React from 'react';

import { GithubCorner } from './github-corner';
import styles from './layout.module.scss';
import { Navigation } from './nav';

interface LayoutProps {
  title: string;
  currentPage: string;
  pages: string[];
  internalLinks: string[];
}

export class Layout extends React.Component<LayoutProps, {}> {
  public render() {
    const { title, currentPage, pages, internalLinks } = this.props;
    return (
      <div className={styles.container}>
        <GithubCorner />
        <Navigation
          siteTitle={title}
          currentPage={currentPage}
          pages={pages}
          internalLink={internalLinks}
        />
        <div className={styles.markdownBody}>
          <section className={styles.about}>
            <main>{this.props.children}</main>
          </section>
        </div>
        <footer>Built on {new Date().getFullYear()}</footer>
      </div>
    );
  }
}
