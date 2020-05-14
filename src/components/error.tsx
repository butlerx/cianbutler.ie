import { graphql } from 'gatsby';
import React, { SFC } from 'react';
import { Layout } from './shared/layout';

interface ErrorProps {
  description: string;
  title: string;
  error: string;
  menu: string[];
  twitter: string;
}

export const Error: SFC<ErrorProps> = ({
  children,
  menu,
  error,
  twitter,
  title,
  description,
}) => (
  <Layout
    title={title}
    currentPage={error}
    pages={menu}
    internalLinks={[]}
    twitter={twitter}
    description={description}
  >
    {children}
  </Layout>
);
