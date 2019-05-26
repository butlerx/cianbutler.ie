import { Location } from '@reach/router';
import { Link } from 'gatsby';
import React, { SFC } from 'react';
import * as styles from './nav.module.scss';
//import * as printStyles from './print.module.scss';

import { humanize } from '../../utils';

interface NavigationProps {
  currentPage: string;
  siteTitle: string;
  pages: string[];
  internalLink: string[];
}

interface SubNavProps {
  currentPage: string;
  links: string[];
}

export const SubNav: SFC<SubNavProps> = ({ currentPage, links }) =>
  links.length === 0 ? (
    <></>
  ) : (
    <li className={styles.SubNav}>
      <ul className={styles.nav}>
        {links.map(label => (
          <li key={label}>
            <a href={`#${encodeURI(label)}`} className={styles.sidebarNavItem}>
              {humanize(label)}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );

export const Navigation: SFC<NavigationProps> = ({
  siteTitle,
  pages,
  internalLink,
  currentPage,
}) => (
  <nav className={styles.sidebar} data-spy='affix'>
    <ul className={styles.nav}>
      <Location>
        {({ location }: { location: { pathname: string } }) => (
          <Link to={location.pathname === '/' ? '#' : '/'}>{siteTitle}</Link>
        )}
      </Location>
      {pages.map((page: string) => (
        <li key={page}>
          <Link to={page} className={styles.sidebarNavItem}>
            {humanize(page)}
          </Link>
        </li>
      ))}
      <hr />
      <SubNav currentPage={currentPage} links={internalLink} />}
    </ul>
  </nav>
);

Navigation.defaultProps = {
  internalLink: [],
  pages: [],
  siteTitle: '',
};
