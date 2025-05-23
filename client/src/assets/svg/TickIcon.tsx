import React from 'react';
import { svgProps } from './svgProps';

const TickIcon = ({
  size = '12',
  color = '#fff',
  onClick,
  borderColor = '#DADADA',
  ...props
}: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 14 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
    style={{ cursor: 'pointer', borderRadius: '50%', border: `1px solid ${borderColor}` }}
    onClick={onClick}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12.0791 3.08736C12.307 3.31516 12.307 3.68451 12.0791 3.91232L5.66248 10.329C5.43467 10.5568 5.06533 10.5568 4.83752 10.329L1.92085 7.41232C1.69305 7.18451 1.69305 6.81516 1.92085 6.58736C2.14866 6.35955 2.51801 6.35955 2.74581 6.58736L5.25 9.09155L11.2542 3.08736C11.482 2.85955 11.8513 2.85955 12.0791 3.08736Z'
      fill={color}
    />
  </svg>
);

export default TickIcon;
