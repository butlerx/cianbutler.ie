import Img, { FluidObject } from 'gatsby-image';
import React, { FC } from 'react';

interface AvatarProps {
  avatar: FluidObject;
}

export const Avatar: FC<AvatarProps> = ({ avatar, children }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <Img
      style={{
        height: '100px',
        marginRight: '0.5em',
        width: '100px',
      }}
      fluid={avatar}
      alt='Mug shot'
    />
    {children}
  </div>
);
