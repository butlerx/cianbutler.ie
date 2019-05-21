import * as React from 'react';
import * as styles from './social.scss';

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
  mail?: Email;
  linkedin?: SocialAccount;
  phone?: Phone;
}

export class Social extends React.Component<SocialProps, {}> {
  public static defaultProps = {};

  public render() {
    const { twitter, mastodon, github, git, mail, linkedin, phone } = this.props;
    return (
      <ul className={styles.icon}>
        {this.socialLink(this.twitter, 'Twitter', twitter)}
        {this.socialLink(this.mastodon, 'Mastodon', mastodon)}
        {this.socialLink(this.github, 'Github', github)}
        {this.socialLink(this.git, 'Git', git)}
        {this.socialLink(this.email, 'email', mail)}
        {this.socialLink(this.linkedIn, 'LinkedIn', linkedin)}
        {this.socialLink(this.phone, 'Phone', phone)}
      </ul>
    );
  }

  private socialLink(func: (arg: any) => string, label: string, social?: SocialAccount) {
    if (social === undefined) {
      return;
    }
    return (
      <li>
        <a href={`${func(social)}`} className={this.iconClass(social.icon)}>
          <span className='label'>{label}</span>
        </a>
      </li>
    );
  }

  private iconClass = (icon: string): string => `${styles.icon} fa fa-${icon}`;
  private twitter = (twitter: SocialAccount): string => `https://twitter.com/${twitter.user}`;
  private github = (github: SocialAccount): string => `https://github.com/${github.user}`;
  private mastodon = (mastodon: CustomSocialAccount): string =>
    `https://${mastodon.host}/@${mastodon.user}`;
  private git = (git: CustomSocialAccount): string => `https://${git.host}/@${git.user}`;
  private email = (mail: Email): string => `mailto://${mail.address}`;
  private linkedIn = (linkedIn: SocialAccount): string =>
    `https://linkedin.com/in/${linkedIn.user}`;
  private phone = (phone: Phone): string => `tel:${phone.num}`;
}
