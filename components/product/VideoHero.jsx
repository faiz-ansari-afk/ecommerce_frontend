import React, { useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import parse from 'html-react-parser';
import Link from 'next/link';
import slugify from 'slugify';

const VideoHero = ({ product_hero, category }) => {
  /*
    check if video if portarait or landscape
    */
  const ref = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePLaying = () => {
    if (!ref || !ref.current) {
      return;
    }

    if (ref.current.paused) {
      ref.current.play();
      setIsPaused(false);
      return;
    }
    ref.current.pause();
    setIsPaused(true);
  };

  const handleSound = () => {
    if (!ref || !ref.current) {
      return;
    }

    if (ref.current.muted) {
      ref.current.muted = false;
      setIsMuted(false);
      return;
    }
    ref.current.muted = true;
    setIsMuted(true);
  };
  const src = `${product_hero.video.data.attributes.url}`;
  // ////console.log(category);
  if (product_hero.isPotrait) {
    return (
      <div className=" my-28 mx-2 md:my-32  md:mx-10 relative rounded-3xl shadow-lg">
        <div className=" absolute inset-0 bg-gradient-to-br md:bg-gradient-to-tr rounded-3xl from-gray-200 to-transparent mix-blend-multiply mask-image-radial-gradient"></div>

        <div className="flex items-center gap-12 md:gap-24 flex-col md:flex-row justify-center md:mx-12">
          {/* Content */}
          <div className="relative md:text-right mt-12 text-center ">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900">
              {parse(product_hero.title_text)}
            </h1>
            <p className="md:mt-4 mt-2  max-w-2xl md:max-w-3xl text-base md:text-lg lg:text-xl text-gray-500">
              {parse(product_hero.description)}
            </p>
            <div className=" mt-6 md:mt-8">
              <Link
                href={`/search?searchQuery=${encodeURI(
                  product_hero.color_list
                )}&category=${category}`}
              >
                <button className="inline-block  py-3 px-8 bg-white rounded-full shadow-lg font-medium text-black ">
                  Get More Design
                </button>
              </Link>
            </div>
          </div>
          <div className="relative  ">
            <video
              ref={ref}
              loop=""
              playsInline=""
              className=" z-10 rounded-lg  object-cover"
              muted={true}
              autoPlay={true}
              preload="auto"
            >
              <source src={src} type="video/mp4" />
            </video>
            <span className="absolute  z-20 bg-black/60"></span>
            <span className="absolute bottom-10 left-8 z-40 flex items-center space-x-1 lg:bottom-14 lg:left-14 lg:space-x-2">
              {isPaused ? (
                <PlayIcon
                  onClick={handlePLaying}
                  className="h-10 w-10 cursor-pointer rounded-full stroke-2 p-2 text-gray-200 transition-colors hover:bg-gray-200/10 active:bg-gray-200/20"
                />
              ) : (
                <PauseIcon
                  onClick={handlePLaying}
                  className="h-10 w-10 cursor-pointer rounded-full stroke-2 p-2 text-gray-200 transition-colors hover:bg-gray-200/10 active:bg-gray-200/20"
                />
              )}
              {isMuted ? (
                <SpeakerXMarkIcon
                  onClick={handleSound}
                  className="h-10 w-10 cursor-pointer rounded-full stroke-2 p-2 text-gray-200 transition-colors hover:bg-gray-200/10 active:bg-gray-200/20"
                />
              ) : (
                <SpeakerWaveIcon
                  onClick={handleSound}
                  className="h-10 w-10 cursor-pointer rounded-full stroke-2 p-2 text-gray-200 transition-colors hover:bg-gray-200/10 active:bg-gray-200/20"
                />
              )}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative bg-gray-800 text-center mb-24">
        <div className="relative">
          <div className="absolute inset-0">
            <video
              className="w-full h-full object-cover"
              src={src}
              autoPlay
              loop
              muted
            />
            <div
              className="absolute inset-0 bg-gray-900 opacity-50"
              aria-hidden="true"
            />
          </div>
          <div className="relative py-24">
            <h1 className="text-4xl font-extrabold tracking-tight  sm:text-5xl lg:text-6xl">
              <span className="block">{parse(product_hero.title_text)}</span>
            </h1>
            <p className="mt-6  text-xl ">{parse(product_hero.description)}</p>
            <div className="mt-10">
              <Link
                href={`/search?searchQuery=${encodeURI(
                  product_hero.color_list
                )}&category=${category}`}
              >
                <button className="inline-block  py-3 px-8 bg-white rounded-full shadow-lg font-medium text-black ">
                  Get More Design
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default VideoHero;
