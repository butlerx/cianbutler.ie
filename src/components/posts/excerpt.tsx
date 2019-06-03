import { Link } from 'gatsby';
import React, { SFC } from 'react';
import * as styles from './excerpt.module.scss';

interface ExcerptProps {
  excerpt: string;
  date: string;
  author: string;
  title: string;
  path: string;
}

export const Excerpt: SFC<ExcerptProps> = ({
  excerpt,
  date,
  author,
  title,
  path,
}) => (
  <article className={styles.post}>
    <h2 className={styles.headline}>
      <Link to={path}>{title}</Link>
    </h2>
    <div className={styles.meta}>
      <span className={styles.key}>published on</span>
      <span className={styles.value}>{date}</span>
      <br />
      <span className={styles.key}>author:</span>
      <span className={styles.value}>{author}</span>
      <br />
    </div>
    <section className={styles.article}>
      {excerpt}
      <br />
      <Link to={path}>Read more...</Link>
    </section>
    <hr />
  </article>
);
