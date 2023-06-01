import Image from 'next/image';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState, useEffect } from 'react';

/*
Recieve array of [
  {
    url:String,
    altText:String
  }
]
and String:heightWidth
time:Integer
*/
const AutoPlaySlider = ({
  dataArray,
  heightWidth,
  timer = 3000,
  imageCover = 'object-cover',
  arrow = false,
  selectedImage,
  setSelectedImage = null,
  scoreBoard = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,

      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
        if (setSelectedImage) {
          setSelectedImage(slider.track.details.rel);
        }
      },
      created() {
        setLoaded(true);
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider?.prev();
          }, timer);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );
  useEffect(() => {
    instanceRef.current?.moveToIdx(selectedImage);
  }, [selectedImage]);

  if (dataArray.length === 1) {
    return dataArray.map((image, index) => {
      return (
        <div className="" key={index}>
          <div className={`relative   rounded-lg ${heightWidth} `}>
            <Image
              src={image.url}
              alt="product image"
              fill
              sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
              className={`  rounded-t-lg ${imageCover}`}
            />
          </div>
        </div>
      );
    });
  }
  return (
    <div className="navigation-wrapper relative">
      <div ref={sliderRef} className="keen-slider">
        {dataArray &&
          dataArray.map((image, index) => {
            return (
              <div className="keen-slider__slide" key={index}>
                <div className={`relative   rounded-lg ${heightWidth} `}>
                  <Image
                    src={image.url}
                    alt="product image"
                    fill
                    sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
                    className={`  rounded-t-lg ${imageCover}`}
                  />
                </div>
              </div>
            );
          })}
        {scoreBoard && <div className="absolute px-3 md:px-5 bg-slate-900 md:bottom-[20px] md:right-[20px] bottom-[10px] right-[10px] flex items-center justify-center rounded-full ">
          <div className="text-white text-sm md:text-md">
            {currentSlide + 1}/{dataArray.length}
          </div>
        </div>}
      </div>

      {dataArray.length > 1 && arrow && loaded && instanceRef.current && (
        <>
          <div className=" h-4 w-4 absolute cursor-pointer hover:scale-[1.1]  md:h-12 md:w-12 left-[10px] md:left-[50px] top-1/2">
            <Arrow
              left
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />
          </div>
          <div className=" h-4 w-4 absolute cursor-pointer hover:scale-[1.1] right-[10px] md:right-[50px] top-1/2 md:h-12 md:w-12">
            <Arrow
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
export default AutoPlaySlider;

function Arrow(props) {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? 'arrow--left' : 'arrow--right'
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
