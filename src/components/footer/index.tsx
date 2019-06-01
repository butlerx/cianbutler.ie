import React, { SFC } from 'react';

import { getMonth } from '../../utils';
import styles from './footer.module.scss';

const month = getMonth(new Date().getMonth());
const year = new Date().getFullYear();

export const Footer: SFC<{}> = () => (
  <footer className={styles.footer}>
    <div className='hiddenPrint'>
      Built on {month}, {year}
    </div>
  </footer>
);
