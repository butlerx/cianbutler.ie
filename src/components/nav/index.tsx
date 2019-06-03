import { Link } from 'gatsby';
import React, { SFC } from 'react';
import * as styles from './nav.module.scss';
//import * as printStyles from './print.module.scss';

import { humanize } from '../../utils';
import { SubNav } from './subNav';

interface NavigationProps {
  currentPage: string;
  siteTitle: string;
  pages: string[];
  internalLink: string[];
}

export const Navigation: SFC<NavigationProps> = ({
  siteTitle,
  pages,
  internalLink,
  currentPage,
}) => (
  <nav className={styles.sidebar} data-spy='affix'>
    <ul className={styles.nav}>
      <Link to='/'>{siteTitle}</Link>
      {pages.map(page => (
        <li key={page}>
          <Link to={page} className={styles.sidebarNavItem}>
            {humanize(page)}
          </Link>
        </li>
      ))}
      <hr />
      <SubNav currentPage={currentPage} links={internalLink} />
    </ul>
  </nav>
);

Navigation.defaultProps = {
  internalLink: [],
  pages: [],
  siteTitle: '',
};
