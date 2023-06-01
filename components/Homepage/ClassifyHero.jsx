import React from 'react';
import VideoHero from './VideoHero';
import ImagesHero from './ImagesHero';
import CoverImageHero from './CoverImageHero';

const ClassifyHero = ({ hero }) => {
//   ////console.log(hero);
  // video --- image_gallery -- cover_image

  if (hero.video.data) {
    return (
      <div>
        <VideoHero hero={hero} />
      </div>
    );
  }
  else if (hero.image_gallery.data) {
    return (
      <div>
        <ImagesHero hero={hero} />
      </div>
    );
  }

  else if (hero.cover_image.data) {
    return (
      <div>
        <CoverImageHero hero={hero} />
      </div>
    );
  }
};

export default ClassifyHero;
