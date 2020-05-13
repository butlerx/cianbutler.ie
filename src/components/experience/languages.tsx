import React, { SFC } from 'react';

interface LanguagesProps {
  languages: string[];
}

export const Languages: SFC<LanguagesProps> = ({ languages }) => (
  <p>
    {languages.map((language: string, position: number) => (
      <span key={position}>
        {position !== 0 ? ', ' : ''}
        <code>{language}</code>
      </span>
    ))}
  </p>
);
