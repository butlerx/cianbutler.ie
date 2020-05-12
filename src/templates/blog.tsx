import { graphql } from 'gatsby';
import React, { SFC } from 'react';
import { Layout, Post } from '../components';

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
    markdownRemark: {
      html: string;
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

const Blog: SFC<BlogProps> = ({
  data: {
    markdownRemark: { frontmatter, html },
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
      html={html}
      date={frontmatter.date}
      author={frontmatter.author}
      tags={frontmatter.tags}
      title={frontmatter.title}
    />
  </Layout>
);

export default Blog;
export const BlogQuery = graphql`
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
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        path
        title
        tags
        author
      }
    }
  }
`;
