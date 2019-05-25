import { Location } from '@reach/router';
import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './nav.module.scss';
import * as printStyles from './print.module.scss';

interface NavigationProps {
  currentPage: string;
  siteTitle: string;
  pages: string[];
  internalLink: string[];
}

export class Navigation extends React.Component<NavigationProps, {}> {
  public static defaultProps = {
    internalLink: [],
    pages: [],
    siteTitle: '',
  };
  public render() {
    const { siteTitle, pages, internalLink, currentPage } = this.props;
    return (
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
                {this.humanize(page)}
              </Link>
            </li>
          ))}
          <hr />
          {internalLink.length === 0 ? '' : this.subNav(currentPage, internalLink)}
        </ul>
      </nav>
    );
  }

  private subNav(currentPage: string, links: string[]) {
    return (
      <li className={styles.SubNav}>
        <a href={`#${currentPage}`} className={styles.sidebarNavItem}>
          {this.humanize(currentPage)}
        </a>
        <ul className={styles.nav}>
          {links.map(label => (
            <li key={label}>
              <a href={`#${label}`} className={styles.sidebarNavItem}>
                {this.humanize(label)}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  private humanize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
