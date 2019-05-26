import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { Languages } from './languages';

export interface ExperienceData {
  title: string;
  where: string;
  start: Date;
  finish: Date;
  languages: string[];
  description: string;
}

interface ExperienceProps {
  data: ExperienceData[];
}

export class Experience extends Component<ExperienceProps, {}> {
  public static defaultProps = {
    data: [],
  };

  public render() {
    const { data } = this.props;
    return data
      .sort(
        (a: ExperienceData, b: ExperienceData) =>
          new Date(b.start).getTime() - new Date(a.start).getTime(),
      )
      .map(this.experience);
  }

  public experience = ({ title, where, start, finish, languages, description }: ExperienceData) => (
    <div>
      <h3 id={encodeURI(title)}>
        {title}@{where}&emsp;
        <small>
          <em>
            {this.formatDate(start)} - {this.formatDate(finish)}
          </em>
        </small>
      </h3>
      <Languages languages={languages} />
      <blockquote>
        <p>
          <ReactMarkdown source={description} />
        </p>
      </blockquote>
      <hr />
    </div>
  );

  private formatDate = (date?: Date): string =>
    date === undefined
      ? 'present'
      : `${
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][new Date(date).getMonth()]
        } ${new Date(date).getDay()}, ${new Date(date).getFullYear()}`;
}
