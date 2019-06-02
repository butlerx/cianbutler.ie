import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import { humanize } from '../../utils';
import * as styles from './contributions.module.scss';

const getClass = (cls: string): string => [styles.projectElementState, cls].join(' ');

function colour(state: string): string {
  switch (state) {
    case 'MERGED':
      return getClass(styles.projectElementStateMerged);
    case 'CLOSED':
      return getClass(styles.projectElementStateClosed);
    default:
      return getClass(styles.projectElementStateOpen);
  }
}

export const State: SFC<{ status: string }> = ({ status }) => (
  <div className={colour(status)}>
    <FontAwesomeIcon icon={'code-branch'} />
    {humanize(status)}
  </div>
);
