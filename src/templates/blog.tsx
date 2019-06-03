import { graphql } from 'gatsby';
import React, { SFC } from 'react';
import { Layout } from '../components';
import * as styles from './blog.module.scss';

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

const Blog: SFC<BlogProps> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;
  const { menu, social, title } = data.site.siteMetadata;
  return (
    <Layout
      title={title}
      currentPage={frontmatter.title}
      pages={menu}
      internalLinks={[]}
      twitter={social.twitter.user}
      description={frontmatter.description}
    >
      <article className={styles.post}>
        <div className={styles.meta}>
          <span className={styles.key}>published on</span>
          <span className={styles.value}>{frontmatter.date}</span>
          <br />
          <span className={styles.key}>author:</span>
          <span className={styles.value}>{frontmatter.author}</span>
          <br />
          <span className={styles.key}>tags:</span>
          <span className={styles.value}>{frontmatter.tags.join(', ')}</span>
          <br />
        </div>
        <h1 className={styles.headline}>{frontmatter.title}</h1>
        <section
          className={styles.article}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </Layout>
  );
};

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
