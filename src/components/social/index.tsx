import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SFC } from 'react';
import * as styles from './social.module.scss';

interface SocialAccount {
  user: string;
  icon: string;
}

interface CustomSocialAccount extends SocialAccount {
  host: string;
}

interface Email extends SocialAccount {
  address: string;
}

interface Phone extends SocialAccount {
  num: string;
}

export interface SocialProps {
  twitter: SocialAccount;
  mastodon?: CustomSocialAccount;
  github?: SocialAccount;
  git?: CustomSocialAccount;
  email?: Email;
  linkedIn?: SocialAccount;
  phone?: Phone;
}

interface SocialLinkProps {
  url: string;
  label: string;
  social: SocialAccount;
}

const icon = (i: string) => (i === 'envelope' ? i : ['fab', i]);

const SocialLink: SFC<SocialLinkProps> = ({ url, label, social }) => (
  <li>
    <a href={url}>
      <FontAwesomeIcon icon={icon(social.icon)} />
      <span className={styles.label}>{label}</span>
    </a>
  </li>
);

export const Social: SFC<SocialProps> = ({
  twitter,
  mastodon,
  github,
  git,
  email,
  linkedIn,
  phone,
}) => (
  <ul className={styles.icons}>
    <SocialLink
      link={`https://twitter.com/${twitter.user}`}
      label='Twitter'
      social={twitter}
    />
    {mastodon === undefined ? (
      <></>
    ) : (
      <SocialLink
        link={`https://${mastodon.host}/@${mastodon.user}`}
        label='Mastodon'
        social={mastodon}
      />
    )}
    {github === undefined ? (
      <></>
    ) : (
      <SocialLink
        link={`https://github.com/${github.user}`}
        label='Github'
        social={github}
      />
    )}
    {git === undefined ? (
      <></>
    ) : (
      <SocialLink
        link={`https://${git.host}/@${git.user}`}
        label='Git'
        social={git}
      />
    )}
    {email === undefined ? (
      <></>
    ) : (
      <SocialLink
        link={`mailto://${email.address}`}
        label='email'
        social={email}
      />
    )}
    {linkedIn === undefined ? (
      <></>
    ) : (
      <SocialLink
        link={`https://linkedin.com/in/${linkedIn.user}`}
        label='LinkedIn'
        social={linkedIn}
      />
    )}
    {phone === undefined ? (
      <></>
    ) : (
      <SocialLink link={`tel:${phone.num}`} label='Phone' social={phone} />
    )}
  </ul>
);
