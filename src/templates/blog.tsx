import { graphql } from 'gatsby';
import React, { SFC } from 'react';

interface BlogProps {
  markdownRemark: {
    html: string;
    frontmatter: {
      date: Date;
      path: string;
      title: string;
    };
  };
}

const Blog: SFC<BlogProps> = ({ markdownRemark }) => (
  <div className='blog-post-container'>
    <div className='blog-post'>
      <h1>{markdownRemark.frontmatter.title}</h1>
      <h2>{markdownRemark.frontmatter.date}</h2>
      <div
        className='blog-post-content'
        dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
      />
    </div>
  </div>
);

export default Blog;
export const pageQuery = graphql`
  query BlogQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        path
        title
      }
    }
  }
`;
