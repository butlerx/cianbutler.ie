import React, { SFC } from 'react';
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

const formatDate = (date?: Date): string =>
  date === undefined || date === null
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

const experience = ({ title, where, start, finish, languages, description }: ExperienceData) => (
  <div key={`${title}@${where}`}>
    <h3 id={encodeURI(title)}>
      {title}@{where}&emsp;
      <small>
        <em>
          {formatDate(start)} - {formatDate(finish)}
        </em>
      </small>
    </h3>
    <Languages languages={languages} />
    <blockquote>
      <ReactMarkdown source={description} />
    </blockquote>
    <hr />
  </div>
);

export const Experience: SFC<ExperienceProps> = ({ data }) =>
  data
    .sort(
      (a: ExperienceData, b: ExperienceData) =>
        new Date(b.start).getTime() - new Date(a.start).getTime(),
    )
    .map(experience);

Experience.defaultProps = {
  data: [],
};
