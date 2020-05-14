import { graphql } from 'gatsby';
import React, { SFC } from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Layout } from './shared/layout';
import { Post } from './posts';

interface BlogProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        menu: string[];
        social: {
          twitter: { user: string };
        };
      };
    };
    mdx: {
      body: string;
      frontmatter: {
        date: Date;
        author: string;
        description: string;
        tags: string[];
        title: string;
      };
    };
  };
}

export const Blog: SFC<BlogProps> = ({
  data: {
    mdx: { frontmatter, body },
    site: {
      siteMetadata: { menu, social, title },
    },
  },
}) => (
  <Layout
    title={title}
    currentPage={frontmatter.title}
    pages={menu}
    internalLinks={[]}
    twitter={social.twitter.user}
    description={frontmatter.description}
  >
    <Post
      date={frontmatter.date}
      author={frontmatter.author}
      tags={frontmatter.tags}
      title={frontmatter.title}
    >
      <MDXRenderer>{body}</MDXRenderer>
    </Post>
  </Layout>
);

export const pageQuery = graphql`
  query BlogQuery($id: String!) {
    site {
      siteMetadata {
        menu
        title
        social {
          twitter {
            user
          }
        }
      }
    }
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        title
        tags
        author
      }
    }
  }
`;
