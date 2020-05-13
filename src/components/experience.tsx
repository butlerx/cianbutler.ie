import React, { SFC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Languages } from './experience/languages';
import { formatDate } from '../utils/dates';
import * as styles from './experience/experience.module.scss';
export * from './experience/languages';

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

export const Experience: SFC<ExperienceProps> = ({ data }) => (
  <div className={styles.experience}>
    {data
      .sort(
        (a: ExperienceData, b: ExperienceData) =>
          new Date(b.start).getTime() - new Date(a.start).getTime(),
      )
      .map(({ title, where, start, finish, languages, description }) => (
        <div key={`${title}@${where}`} className={styles.experienceBlock}>
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
      ))}
  </div>
);

Experience.defaultProps = {
  data: [],
};
