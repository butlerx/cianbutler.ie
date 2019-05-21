import * as React from 'react';

interface SectionProps {
  label: string;
}

export class Section extends React.Component<SectionProps, {}> {
  public static defaultProps = {};

  public render() {
    const { label } = this.props;
    return <h2 id={encodeURI(label)}>{this.humanize(label)}</h2>;
  }

  private humanize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
