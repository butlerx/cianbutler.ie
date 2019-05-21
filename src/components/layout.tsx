import * as React from 'react';

import * as styles from './layout.scss';
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
      <div className={styles.Container}>
        <Navigation
          siteTitle={title}
          currentPage={currentPage}
          pages={pages}
          internalLink={internalLinks}
        />
        <div className={styles.MarkdownBody}>
          <section className={styles.about}>
            <main>{this.props.children}</main>
          </section>
        </div>
        <footer>Built on {new Date().getFullYear()}</footer>
      </div>
    );
  }
}
