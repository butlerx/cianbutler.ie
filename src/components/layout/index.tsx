import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React, { SFC } from 'react';

import { GithubCorner, Navigation } from '..';
import styles from './layout.module.scss';
import './print.scss';

library.add(fab, faEnvelope);

interface LayoutProps {
  title: string;
  currentPage: string;
  pages: string[];
  internalLinks: string[];
}

export const Layout: SFC<LayoutProps> = ({
  title,
  currentPage,
  pages,
  internalLinks,
  children,
}) => (
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
        <main>{children}</main>
      </section>
    </div>
    <footer>
      <div className='hidden-print'>Built on {new Date().getFullYear()}</div>
    </footer>
  </div>
);
