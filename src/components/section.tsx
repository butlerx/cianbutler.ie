import React, { Component } from 'react';

interface SectionProps {
  label: string;
}

export class Section extends Component<SectionProps, {}> {
  public static defaultProps = {};

  public render() {
    const { label, children } = this.props;
    return <h2 id={label}>{this.humanize(label)}</h2>;
  }

  private humanize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
