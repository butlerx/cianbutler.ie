import { graphql } from 'gatsby';
import { Projects } from '../components/projects';

export default Projects;
export const pageQuery = graphql`
  query ProjectQuery {
    site {
      siteMetadata {
        author
        title
        menu
      }
    }
    githubData {
      data {
        search {
          nodes {
            title
            merged
            url
            state
            bodyHTML
            repository {
              name
              repoUrl
              stargazers {
                totalCount
              }
            }
          }
        }
        user {
          repositories {
            nodes {
              name
              owner {
                login
              }
            }
          }
        }
      }
    }
  }
`;
