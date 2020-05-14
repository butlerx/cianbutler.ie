import React, { SFC } from 'react';

import { titlize } from '../../utils/humanize';

interface SectionProps {
  label: string;
}

export const Section: SFC<SectionProps> = ({ label }) => (
  <h2 id={encodeURI(label)}>{titlize(label)}</h2>
);
