import React, { Component } from 'react';

interface LanguagesProps {
  languages: string[];
}

export class Languages extends Component<LanguagesProps, {}> {
  public static defaultProps = { languages: [] };

  public render() {
    const { languages } = this.props;
    return (
      <p>
        {languages.map((language: string, position: number) => (
          <>
            {position !== 0 ? ', ' : ''}
            <code key={position}>{language}</code>
          </>
        ))}
      </p>
    );
  }
}
