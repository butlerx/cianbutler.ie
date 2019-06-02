export const humanize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const trimReadme = (readme: string, length: number): string =>
  `${readme.substring(0, length)}...`;

export const titlize = (str: string): string =>
  str
    .split(' ')
    .map(humanize)
    .join(' ');
