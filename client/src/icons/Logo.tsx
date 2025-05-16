import React from 'react';
import logo from '../assets/images/new_logo.jpg';

const Logo = ({ width = '54', height = '54' }: { width: string; height: string }) => {
  return <img src={logo} alt='IPES logo' width={width} height={height} />;
};

export default Logo;
