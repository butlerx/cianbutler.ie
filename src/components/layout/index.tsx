import React, { SFC } from 'react';
import { Footer, GithubCorner, Navigation, SEO } from '..';
import { humanize } from '../../utils';
import './base.scss';
import './icons';
import * as styles from './layout.module.scss';
import './print.scss';

interface LayoutProps {
  title: string;
  currentPage: string;
  pages: string[];
  internalLinks: string[];
  twitter: string;
  description: string;
}

export const Layout: SFC<LayoutProps> = ({
  title,
  currentPage,
  pages,
  internalLinks,
  twitter,
  description,
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
    <SEO
      pageTitle={humanize(currentPage)}
      author={twitter}
      title={title}
      description={description}
    />
    <div className={styles.markdownBody}>
      <div className={styles.wrapper}>
        <section className={styles.about}>
          <main>{children}</main>
        </section>
      </div>
    </div>
    <Footer />
  </div>
);