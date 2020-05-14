import React, { SFC } from 'react';
import * as styles from './post.module.scss';

interface PostProps {
  date: Date;
  author: string;
  tags: string[];
  title: string;
}

export const Post: SFC<PostProps> = ({
  children,
  date,
  author,
  tags,
  title,
}) => (
  <article className={styles.post}>
    <div className={styles.meta}>
      <span className={styles.key}>published on</span>
      <span className={styles.value}>{date}</span>
      <br />
      <span className={styles.key}>author:</span>
      <span className={styles.value}>{author}</span>
      <br />
      <span className={styles.key}>tags:</span>
      <span className={styles.value}>{tags.join(', ')}</span>
      <br />
    </div>
    <h1 className={styles.headline}>{title}</h1>
    <section className={styles.article}>{children}</section>
  </article>
);
