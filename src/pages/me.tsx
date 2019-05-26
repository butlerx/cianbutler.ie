import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Avatar, Section } from '../components';

import {
  Experience,
  ExperienceData,
  Languages,
  Layout,
  SEO,
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
      edges: Array<{
        node: YAML;
      }>;
    };
  };
}

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
      edges {
        node {
          title
          source {
            title
            where
            start
            finish
            languages
            description
          }
        }
      }
    }
  }
`;

export default class MePage extends Component<MePageProps, {}> {
  public render() {
    const {
      description,
      title,
      author,
      social,
      languages,
      menu,
    } = this.props.data.site.siteMetadata;
    const { fluid } = this.props.data.placeholderImage.childImageSharp;
    return (
      <Layout
        title={title}
        currentPage='me'
        pages={menu}
        internalLinks={['experience', 'education']}
      >
        <SEO pageTitle='me' author={social.twitter.user} title={title} description={description} />
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
          {description}
        </blockquote>
        <ScrollableAnchor id='experience'>
          <Section label='experience' />
        </ScrollableAnchor>
        <Experience data={this.experience} />
        <ScrollableAnchor id='education'>
          <Section label='education' />
        </ScrollableAnchor>
        <Experience data={this.education} />
      </Layout>
    );
  }
  private getYaml = (id: string): Array<{ node: YAML }> =>
    this.props.data.allYaml.edges.filter(({ node }: { node: YAML }) => node.title === id);

  private get experience(): ExperienceData[] {
    const [{ node }] = this.getYaml('Experience');
    return node.source;
  }

  private get education(): ExperienceData[] {
    const [{ node }] = this.getYaml('Education');
    return node.source;
  }
}
