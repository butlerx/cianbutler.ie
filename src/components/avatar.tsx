import Img, { FluidObject } from 'gatsby-image';
import React, { Component } from 'react';

interface AvatarProps {
  avatar: FluidObject;
}

export class Avatar extends Component<AvatarProps, {}> {
  public render() {
    const { avatar } = this.props;
    return (
      <div
        style={{
          height: '100px',
          width: '100px',
        }}
      >
        <Img fluid={avatar} alt='Mug shot' />
      </div>
    );
  }
}
