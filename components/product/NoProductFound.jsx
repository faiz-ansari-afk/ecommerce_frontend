import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const NoProductFound = () => {
  return (
    <div className="">
      <Player
        autoplay
        loop
        src="https://assets2.lottiefiles.com/private_files/lf30_3X1oGR.json"
        style={{ height: '300px', width: '300px' }}
      ></Player>
    </div>
  );
};

export default NoProductFound;
