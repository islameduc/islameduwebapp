import React from 'react';
import { svgProps } from './svgProps';

const ArrowRightIcon = ({ color = '#FDFDFD', style, ...props }: svgProps) => (
  <svg
    width='16'
    height='13'
    viewBox='0 0 16 13'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
    style={style}
  >
    <path
      d='M10 12.5L8.6 11.05L12.15 7.5H0V5.5H12.15L8.6 1.95L10 0.5L16 6.5L10 12.5Z'
      fill={color}
    />
  </svg>
);

export default ArrowRightIcon;
