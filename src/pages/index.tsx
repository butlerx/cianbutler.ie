import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import * as React from 'react';

import { Avatar, Layout, SEO } from '../components';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
        menu: string[];
        job: string;
        blurb: string;
        social: {
          email: { address: string };
          twitter: { user: string };
        };
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
        blurb
        description
        job
        menu
        title
        social {
          email {
            address
          }
          twitter {
            user
          }
        }
        blurb
      }
    }
    placeholderImage: file(relativePath: { eq: "me.png" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export default class IndexPage extends React.Component<IndexPageProps, {}> {
  public render() {
    const {
      description,
      title,
      author,
      menu,
      job,
      social,
      blurb,
    } = this.props.data.site.siteMetadata;
    const { fluid } = this.props.data.placeholderImage.childImageSharp;
    return (
      <Layout title={title} currentPage={title} pages={menu} internalLinks={[]}>
        <SEO
          pageTitle='Home'
          author={social.twitter.user}
          title={title}
          description={description}
        />
        <Avatar avatar={fluid} />
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
        content
        <h3>
          Contact me at{' '}
          <a href={`http://twitter.com/${social.twitter.user}`}>@{social.twitter.user}</a> or by{' '}
          <a href={`mailto:${social.email.address}`}>email</a>.
        </h3>
      </Layout>
    );
  }
}
