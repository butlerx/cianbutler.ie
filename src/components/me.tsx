import { FluidObject } from 'gatsby-image';
import React, { SFC } from 'react';
import { Avatar } from './shared/avatar';
import { Experience, ExperienceData } from './shared/experience';
import { Languages } from './shared/languages';
import { Layout } from './shared/layout';
import { Repositories, RepositoryData } from './shared/repositories';
import { Section } from './shared/section';
import { Social, SocialProps } from './me/social';

interface YAML {
  title: string;
  source: ExperienceData[];
}

interface MeProps {
  author: string;
  description: string;
  title: string;
  social: SocialProps;
  languages: string[];
  menu: string[];
  hero: FluidObject;
  yaml: YAML[];
  pinnedItems: RepositoryData[];
}

const getYaml = (yaml: YAML[], id: string): ExperienceData[] =>
  yaml.filter(({ title }) => title === id)[0].source;

export const Me: SFC<MeProps> = ({
  children,
  author,
  description,
  hero,
  languages,
  menu,
  pinnedItems,
  social,
  title,
  yaml,
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
      <Avatar avatar={hero}>{author}</Avatar>
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
      {children}
    </blockquote>
    <Section label='experience' />
    <Experience data={getYaml(yaml, 'Experience')} />
    <Section label='education' />
    <Experience data={getYaml(yaml, 'Education')} />
    <Section label='open source projects' />
    <Repositories data={pinnedItems} />
  </Layout>
);
