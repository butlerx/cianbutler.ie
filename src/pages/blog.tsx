import React, { SFC } from 'react';
import { graphql } from 'gatsby';
import { Excerpt } from '../components/blog/posts/excerpt';
import { Layout } from '../components/shared/layout';

interface BlogProps {
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
    allMdx: {
      nodes: {
        id: string;
        excerpt: string;
        frontmatter: {
          date: string;
          title: string;
          author: string;
        };
        fields: {
          slug: string;
        };
      }[];
    };
  };
}

const Blog: SFC<BlogProps> = ({
  data: {
    site: {
      siteMetadata: { description, title, author, menu, social },
    },
    allMdx: { nodes },
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
    {nodes.map(({ id, excerpt, frontmatter, fields }) => (
      <Excerpt
        key={id}
        excerpt={excerpt}
        title={frontmatter.title}
        author={frontmatter.author}
        path={fields.slug}
        date={frontmatter.date}
      />
    ))}
  </Layout>
);

export default Blog;
export const pageQuery = graphql`
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
    allMdx {
      nodes {
        id
        excerpt(pruneLength: 250)
        frontmatter {
          date(formatString: "MMM DD, YYYY")
          title
          author
        }
        fields {
          slug
        }
      }
    }
  }
`;
