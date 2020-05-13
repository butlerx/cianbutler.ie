import React, { SFC } from 'react';
import { graphql } from 'gatsby';
import { Excerpt } from '../components/posts/excerpt';
import { Layout } from '../components/layout';

interface BlogPageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
        menu: string[];
        social: {
          twitter: { user: string };
        };
      };
    };
    allMarkdownRemark: {
      nodes: {
        id: string;
        excerpt: string;
        frontmatter: {
          date: string;
          path: string;
          title: string;
          author: string;
        };
      }[];
    };
  };
}

const blog: SFC<BlogPageProps> = ({
  data: {
    site: {
      siteMetadata: { description, title, author, menu, social },
    },
    allMarkdownRemark: { nodes },
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
    {nodes.map(({ id, excerpt, frontmatter }) => (
      <Excerpt
        key={id}
        excerpt={excerpt}
        title={frontmatter.title}
        author={frontmatter.author}
        path={frontmatter.path}
        date={frontmatter.date}
      />
    ))}
  </Layout>
);

export default blog;
export const BlogPageQuery = graphql`
  query BlogPageQuery {
    site {
      siteMetadata {
        author
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
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { path: { nin: ["index", "me"] } } }
    ) {
      nodes {
        id
        excerpt(pruneLength: 250)
        frontmatter {
          date(formatString: "MMM DD, YYYY")
          path
          title
          author
        }
      }
    }
  }
`;
