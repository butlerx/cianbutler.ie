import React, { SFC } from 'react';
import Helmet from 'react-helmet';

interface SEOProps {
  pageTitle: string;
  description?: string;
  lang?: string;
  meta?: Array<{ content: string; name: string }>;
  author: string;
  title: string;
}

export const SEO: SFC<SEOProps> = ({
  title,
  description,
  lang,
  meta,
  pageTitle,
  author,
}) => (
  <Helmet
    htmlAttributes={{
      lang,
    }}
    title={pageTitle}
    titleTemplate={`%s | ${title}`}
    meta={[
      {
        content: description,
        name: 'description',
      },
      {
        content: title,
        property: 'og:title',
      },
      {
        content: description,
        property: 'og:description',
      },
      {
        content: 'website',
        property: 'og:type',
      },
      {
        content: 'summary',
        name: 'twitter:card',
      },
      {
        content: author,
        name: 'twitter:creator',
      },
      {
        content: title,
        name: 'twitter:title',
      },
      {
        content: description,
        name: 'twitter:description',
      },
    ].concat(meta || [])}
  />
);

SEO.defaultProps = {
  description: '',
  lang: 'en',
  meta: [],
};
