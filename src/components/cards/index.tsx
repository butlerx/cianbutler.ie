import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';

import { humanize } from '../../utils';
import * as styles from './cards.module.scss';

interface CardProps {
  title: string;
  url: string;
  icon: string;
  count?: number;
}

const Star: SFC<{ count?: number }> = props => {
  if (props.count === undefined || props.count === null) return <></>;
  return (
    <span className={styles.cardTitleLinkCount}>
      <FontAwesomeIcon icon='star' />
      {props.count}
    </span>
  );
};

export const Card: SFC<CardProps> = ({ title, url, icon, count, children }) => (
  <div className={styles.cardOuter}>
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span className={styles.cardTitleText}>{title}</span>
        <span className={styles.cardTitleSpace} />
        <span className={styles.cardTitleLink}>
          <Star count={count} />
          <a
            href={url}
            target='_blank'
            className={styles.cardTitleLinkIcon}
            title={humanize(icon)}
          >
            <FontAwesomeIcon icon={['fab', icon]} />
          </a>
        </span>
      </div>
      <div className={styles.cardDesc}>{children}</div>
    </div>
  </div>
);

export const Cards: SFC<{}> = ({ children }) => (
  <div className={styles.cardList}>{children}</div>
);
