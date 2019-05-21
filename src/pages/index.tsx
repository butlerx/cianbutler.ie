import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import * as React from 'react';

import { Layout, SEO } from '../components';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
      };
    };
    placeholderImage: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
}

export const IndexPageQuery = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        author
        description
        title
      }
    }
    placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export default class IndexPage extends React.Component<IndexPageProps, {}> {
  public render() {
    const { description, title, author } = this.props.data.site.siteMetadata;
    const { fluid } = this.props.data.placeholderImage.childImageSharp;
    return (
      <Layout title={title}>
        <SEO pageTitle='Home' author={author} title={title} description={description} />
        <h1>Hi people</h1>
        <p>{description}</p>
        <p>Now go build something great.</p>
        <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
          <Img fluid={fluid} />
        </div>
        <Link to='/me'>Go to page 2</Link>
      </Layout>
    );
  }
}
