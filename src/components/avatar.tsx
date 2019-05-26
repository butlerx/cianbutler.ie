import Img, { FluidObject } from 'gatsby-image';
import React, { Component } from 'react';

interface AvatarProps {
  avatar: FluidObject;
}

export class Avatar extends Component<AvatarProps, {}> {
  public render() {
    const { avatar, children } = this.props;
    return (
      <div
        style={{
          'align-items': 'center',
          display: 'flex',
          'flex-direction': 'row',
        }}
      >
        <Img
          style={{
            height: '100px',
            'margin-right': '0.5em',
            width: '100px',
          }}
          fluid={avatar}
          alt='Mug shot'
        />
        {children}
      </div>
    );
  }
}
