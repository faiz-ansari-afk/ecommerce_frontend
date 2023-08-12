
import React from 'react'
import { AutoPlaySlider } from '@/components/Slider';

function ImageSlider({ images,selectedImage, heightWidth , imageCover='object-cover lg:object-contain'}) {
  // const mappedImages = mapToSliderImages(images)
  // ////////console.log('mapp imag',mappedImages)
  return (
    <div className=''>
      <div>
        <AutoPlaySlider 
        selectedImage={selectedImage}
        arrow={true} dataArray={images} heightWidth={heightWidth} timer={12000} imageCover={imageCover} />
      </div>
    </div>
  )
}

export default ImageSlider