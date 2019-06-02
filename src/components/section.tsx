import React, { SFC } from 'react';

import { titlize } from '../utils';

interface SectionProps {
  label: string;
}

export const Section: SFC<SectionProps> = ({ label }) => <h2 id={label}>{titlize(label)}</h2>;
