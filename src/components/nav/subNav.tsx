import { Location } from '@reach/router';
import { Link } from 'gatsby';
import React, { SFC } from 'react';
import * as styles from './nav.module.scss';

import { titlize } from '../../utils';

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
              {titlize(label)}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
