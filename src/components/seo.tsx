import * as React from 'react';
import Helmet from 'react-helmet';

interface SEOProps {
  pageTitle: string;
  description: string;
  lang: string;
  meta: Array<{ content: string; name: string }>;
  author: string;
  title: string;
}

export class SEO extends React.Component<SEOProps, {}> {
  public static defaultProps = {
    description: '',
    lang: 'en',
    meta: [],
  };

  public render() {
    const { title, description, lang, meta, pageTitle, author } = this.props;
    const metaUpdated = [
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
    ].concat(meta);
    return (
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={pageTitle}
        titleTemplate={`%s | ${title}`}
        meta={metaUpdated}
      />
    );
  }
}
