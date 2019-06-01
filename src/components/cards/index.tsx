import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';

import { humanize } from '../../utils';
import * as styles from './cards.module.scss';

interface CardProps {
  title: string;
  url: string;
  icon: string;
}

export const Card: SFC<CardProps> = ({ title, url, icon, children }) => (
  <div className={styles.cardOuter}>
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span className={styles.cardTitleText}>{title}</span>
        <span className={styles.cardTitleSpace} />
        <span className={styles.cardTitlelinks}>
          <a href={url} target='_blank' className={styles.link} title={humanize(icon)}>
            <FontAwesomeIcon icon={['fab', icon]} />
          </a>
        </span>
      </div>
      <div className={styles.cardDesc}>{children}</div>
    </div>
  </div>
);

export const Cards: SFC<{}> = ({ children }) => <div className={styles.cardList}>{children}</div>;
