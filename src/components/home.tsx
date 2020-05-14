import { Link } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { SFC } from 'react';
import { Avatar } from './shared/avatar';
import { Layout } from './shared/layout';

interface HomeProps {
  author: string;
  blurb: string;
  description: string;
  email: string;
  hero: FluidObject;
  job: string;
  menu: string[];
  title: string;
  twitter: string;
}

export const Home: SFC<HomeProps> = ({
  author,
  blurb,
  children,
  description,
  email,
  hero,
  job,
  menu,
  title,
  twitter,
}) => (
  <Layout
    title={title}
    currentPage={title}
    pages={menu}
    internalLinks={[]}
    twitter={twitter}
    description={description}
  >
    <Avatar avatar={hero} />
    <h3>
      My Name is <strong>{author}</strong>, I'm a {job}.
    </h3>
    <h3>{blurb}</h3>
    <h3>
      Have a look at some of my working <Link to='projects'>projects</Link>.
    </h3>
    <h3>
      For more check out my academic & professional <Link to='me'>resume</Link>.
    </h3>
    {children}
    <h3>
      Contact me at{' '}
      <a href={`http://twitter.com/${twitter}`}>@{social.twitter.user}</a> or by{' '}
      <a href={`mailto:${email}`}>email</a>.
    </h3>
  </Layout>
);
