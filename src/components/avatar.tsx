import Img, { FluidObject } from 'gatsby-image';
import React, { FC } from 'react';

interface AvatarProps {
  avatar: FluidObject;
}

export const Avatar: FC<AvatarProps> = props => (
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
      fluid={props.avatar}
      alt='Mug shot'
    />
    {props.children}
  </div>
);
