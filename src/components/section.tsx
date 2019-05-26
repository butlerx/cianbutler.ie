import React, { SFC } from 'react';

import { humanize } from '../utils';

interface SectionProps {
  label: string;
}

export const Section: SFC<SectionProps> = ({ label }) => <h2 id={label}>{humanize(label)}</h2>;
