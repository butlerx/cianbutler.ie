import { graphql, Link } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { SFC } from 'react';

import { Avatar } from '../components/avatar';
import { Layout } from '../components/layout';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
        menu: string[];
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
    markdownRemark: {
      html: string;
      frontmatter: {
        job: string;
        blurb: string;
      };
    };
  };
}

const index: SFC<IndexPageProps> = ({
  data: {
    site: {
      siteMetadata: { description, title, author, menu, social },
    },
    placeholderImage: {
      childImageSharp: { fluid },
    },
    markdownRemark: {
      html,
      frontmatter: { job, blurb },
    },
  },
}) => (
  <Layout
    title={title}
    currentPage={title}
    pages={menu}
    internalLinks={[]}
    twitter={social.twitter.user}
    description={description}
  >
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
    <span dangerouslySetInnerHTML={{ __html: html }} />
    <h3>
      Contact me at{' '}
      <a href={`http://twitter.com/${social.twitter.user}`}>
        @{social.twitter.user}
      </a>{' '}
      or by <a href={`mailto:${social.email.address}`}>email</a>.
    </h3>
  </Layout>
);

export default index;
export const IndexPageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        author
        description
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
      }
    }
    placeholderImage: file(relativePath: { eq: "me.png" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    markdownRemark(frontmatter: { path: { eq: "index" } }) {
      html
      frontmatter {
        job
        blurb
      }
    }
  }
`;
