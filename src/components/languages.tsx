import * as React from 'react';

interface LanguagesProps {
  languages: string[];
}

export class Languages extends React.Component<LanguagesProps, {}> {
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
