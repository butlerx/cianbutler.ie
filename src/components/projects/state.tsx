import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import { humanize } from '../../utils/humanize';
import * as styles from './contributions.module.scss';

function colour(state: string): string {
  switch (state) {
    case 'MERGED':
      return styles.projectElementStateMerged;
    case 'CLOSED':
      return styles.projectElementStateClosed;
    default:
      return styles.projectElementStateOpen;
  }
}

export const State: SFC<{ status: string }> = ({ status }) => (
  <div className={colour(status)}>
    <FontAwesomeIcon icon={'code-branch'} />
    {humanize(status)}
  </div>
);
