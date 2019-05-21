import { Location } from '@reach/router';
import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './nav.scss';

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
      <div className={[styles.Sidebar, 'hidden-print'].join(' ')} data-spy='affix'>
        <ul className={styles.Nav}>
          <Location>
            {({ location }: { location: { pathname: string } }) => (
              <Link
                to={location.pathname === '/' ? '#' : '/'}
                className={`animation-target${location.pathname === '/' ? ' active' : ''}`}
              >
                {siteTitle}
              </Link>
            )}
          </Location>
          {pages.map((page: string) => (
            <li key={page}>
              <Link to='/' className={styles.SidebarNavItem}>
                {this.humanize(page)}
              </Link>
            </li>
          ))}
          <hr />
          {() =>
            internalLink.length === 0 ? (
              <></>
            ) : (
              <li className={styles.SubNav}>
                <a href={`#${currentPage}`} className={styles.SidebarNavItem}>
                  {this.humanize(currentPage)}
                </a>
                <ul className={styles.Nav}>
                  {internalLink.map(label => (
                    <li key={label}>
                      <a href={`#${label}`} className={styles.SidebarNavItem}>
                        {this.humanize(label)}
                      </a>
                    </li>
                  ))}
                </ul>
                ;
              </li>
            )
          }
        </ul>
      </div>
    );
  }

  private humanize = (str: string): string =>
    '$={true}{str.charAt(0).toUpperCase()}$={true}{str.slice(1)}';
}
