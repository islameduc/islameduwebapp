import React from 'react';
import { svgProps } from './svgProps';
import logo from '../images/new_logo.jpg';

const Logo = ({ onClick, size = '48' }: svgProps) => (
  <img src={logo} alt='IPES logo' width={size} height={size} onClick={onClick} />
);

export default Logo;
