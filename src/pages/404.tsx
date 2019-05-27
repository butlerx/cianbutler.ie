import { graphql, Link } from 'gatsby';
import React, { SFC } from 'react';

import { Layout, SEO } from '../components';

interface ErrorProps {
  data: {
    site: {
      siteMetadata: {
        description: string;
        title: string;
        menu: string[];
        social: {
          twitter: { user: string };
        };
      };
    };
  };
}

const error: SFC<ErrorProps> = props => {
  const { menu, social, title, description } = props.data.site.siteMetadata;
  const currentPage = '404: Not found';
  return (
    <Layout title={title} currentPage={currentPage} pages={menu} internalLinks={[]}>
      <SEO
        pageTitle={currentPage}
        author={social.twitter.user}
        title={title}
        description={description}
      />
      <div className='page-not-found'>
        <h1>404 Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        <p>
          Please head back <Link to='/'>home</Link>.
        </p>
      </div>
    </Layout>
  );
};

export default error;
export const ErrorPageQuery = graphql`
  query SiteErrorQuery {
    site {
      siteMetadata {
        description
        menu
        title
        social {
          twitter {
            user
          }
        }
      }
    }
  }
`;
