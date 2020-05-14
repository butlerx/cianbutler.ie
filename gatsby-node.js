const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const blogPostTemplate = path.resolve('src/components/blog.tsx');

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });
    actions.createNodeField({
      name: 'slug',
      node,
      value: `/blog${value}`,
    });
  }
};

exports.createPages = ({ actions, graphql }) =>
  graphql(`
    query blogMarkdown {
      allMdx {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { createPage } = actions;
    result.data.allMdx.nodes.forEach(({ id, fields }) => {
      createPage({
        path: fields.slug,
        component: blogPostTemplate,
        context: { id },
      });
    });
  });
