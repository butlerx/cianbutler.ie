import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { SFC } from 'react';
import {
  Avatar,
  Experience,
  ExperienceData,
  Languages,
  Layout,
  PinnedRepositoryData,
  Projects,
  Section,
  Social,
  SocialProps,
} from '../components';

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
          pinnedRepositories: {
            nodes: PinnedRepositoryData[];
          };
        };
      };
    };
  };
}

const getYaml = (yaml: YAML[], id: string): ExperienceData[] =>
  yaml.filter(({ title }) => title === id)[0].source;

const me: SFC<MePageProps> = ({ data }) => {
  const {
    description,
    title,
    author,
    social,
    languages,
    menu,
  } = data.site.siteMetadata;
  const { fluid } = data.placeholderImage.childImageSharp;
  const { html } = data.markdownRemark;
  const { nodes } = data.githubData.data.repositoryOwner.pinnedRepositories;
  const experience = getYaml(data.allYaml.nodes, 'Experience');
  const education = getYaml(data.allYaml.nodes, 'Education');

  return (
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
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </blockquote>
      <Section label='experience' />
      <Experience data={experience} />
      <Section label='education' />
      <Experience data={education} />
      <Section label='open source projects' />
      <Projects data={nodes} />
    </Layout>
  );
};

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
          pinnedRepositories {
            nodes {
              name
              url
              description
            }
          }
        }
      }
    }
  }
`;
