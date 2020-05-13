import React, { SFC } from 'react';
import { GithubCorner } from './layout/githubCorner';
import { Footer } from './layout/footer';
import { Navigation } from './layout/nav';
import { SEO } from './layout/seo';
import { humanize } from '../utils/humanize';
import './layout/base.scss';
import './layout/icons';
import * as styles from './layout/layout.module.scss';
import './shared/print.scss';

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
