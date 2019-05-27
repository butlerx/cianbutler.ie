const path = require('path');

exports.createPages = ({ actions, graphql }) =>
  graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            frontmatter {
              path
              type
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { createPage } = actions;
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      if (node.frontmatter.type === 'blog') {
        createPage({
          path: node.frontmatter.path,
          component: path.resolve(`src/templates/blog.js`),
          context: {},
        });
      }
    });
  });
