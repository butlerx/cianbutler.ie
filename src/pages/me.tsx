import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { SFC } from 'react';
import { Avatar } from '../components/avatar';
import {
  Experience,
  ExperienceData,
  Languages,
} from '../components/experience';
import { Layout } from '../components/layout';
import { Repositories, RepositoryData } from '../components/repositories';
import { Section } from '../components/section';
import { Social, SocialProps } from '../components/social';

interface YAML {
  title: string;
  source: ExperienceData[];
}

interface MePageProps {
  data: {
    site: {
      siteMetadata: {
        author: string;
        description: string;
        title: string;
        social: SocialProps;
        languages: string[];
        menu: string[];
      };
    };
    placeholderImage: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    allYaml: {
      nodes: YAML[];
    };
    markdownRemark: {
      html: string;
    };
    githubData: {
      data: {
        repositoryOwner: {
          pinnedItems: {
            nodes: RepositoryData[];
          };
        };
      };
    };
  };
}

const getYaml = (yaml: YAML[], id: string): ExperienceData[] =>
  yaml.filter(({ title }) => title === id)[0].source;

const me: SFC<MePageProps> = ({
  data: {
    site: {
      siteMetadata: { description, title, author, social, languages, menu },
    },
    allYaml: { nodes },
    markdownRemark,
    placeholderImage: {
      childImageSharp: { fluid },
    },
    githubData: {
      data: {
        repositoryOwner: { pinnedItems },
      },
    },
  },
}) => (
  <Layout
    title={title}
    currentPage='me'
    pages={menu}
    internalLinks={['experience', 'education', 'open source projects']}
    twitter={social.twitter.user}
    description={description}
  >
    <h1 id='me'>
      <Avatar avatar={fluid}>{author}</Avatar>
    </h1>
    <Social
      twitter={social.twitter}
      github={social.github}
      git={social.git}
      mastodon={social.mastodon}
      email={social.email}
      linkedIn={social.linkedIn}
      phone={social.phone}
    />
    <blockquote>
      <Languages languages={languages} />
      <span dangerouslySetInnerHTML={{ __html: markdownRemark }} />
    </blockquote>
    <Section label='experience' />
    <Experience data={getYaml(nodes, 'Experience')} />
    <Section label='education' />
    <Experience data={getYaml(nodes, 'Education')} />
    <Section label='open source projects' />
    <Repositories data={pinnedItems.nodes} />
  </Layout>
);

export default me;
export const IndexPageQuery = graphql`
  query ExperienceQuery {
    site {
      siteMetadata {
        author
        description
        title
        languages
        menu
        social {
          twitter {
            icon
            user
          }
          linkedIn {
            icon
            user
          }
          email {
            icon
            address
          }
          github {
            icon
            user
          }
        }
      }
    }
    placeholderImage: file(relativePath: { eq: "me.png" }) {
      childImageSharp {
        fluid(maxWidth: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    allYaml {
      nodes {
        title
        source {
          title
          where
          start(formatString: "YYYY-MM-DD")
          finish(formatString: "YYYY-MM-DD")
          languages
          description
        }
      }
    }
    markdownRemark(frontmatter: { path: { eq: "me" } }) {
      html
    }
    githubData {
      data {
        repositoryOwner {
          pinnedItems {
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
