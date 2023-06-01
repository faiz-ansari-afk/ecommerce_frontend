import { useState, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';

const Video = ({ src, children }) => {
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

  return (
    <section className="relative h-screen overflow-hidden">
      <video
        ref={ref}
        loop=""
        playsInline=""
        className="absolute inset-0 z-10 h-full w-full object-cover"
        muted={true}
        autoPlay={true}
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
      <span className="absolute inset-0 z-20 bg-black/60"></span>
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
      <div className="absolute inset-0 z-30 grid place-content-center  px-5 text-center lg:px-10">
        {/* <div className="flex flex-col inline-block "> */}
          {children}
        {/* </div> */}
      </div>
    </section>
  );
};

export default Video;
