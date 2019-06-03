const path = require('path');

const blogPostTemplate = path.resolve('src/templates/blog.tsx');

exports.createPages = ({ actions, graphql }) =>
  graphql(`
    query blogMarkdown {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { frontmatter: { path: { nin: ["index", "me"] } } }
      ) {
        nodes {
          id
          frontmatter {
            path
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { createPage } = actions;
    result.data.allMarkdownRemark.nodes.forEach(({ id, frontmatter }) => {
      createPage({
        path: frontmatter.path,
        component: blogPostTemplate,
        context: { id },
      });
    });
  });
