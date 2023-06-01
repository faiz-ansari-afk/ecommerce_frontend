import React from 'react';

function Arrow({ className }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 28 28" >
        <path
          fill="#ffffff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.700195 14L3.02769 16.3275L12.3377 7.01755L12.3377 27.3L15.6627 27.3L15.6627 7.01755L24.9727 16.3275L27.3002 14L14.0002 0.70005L0.700195 14Z"
        ></path>
      </svg>
    </div>
  );
}

export default Arrow;
