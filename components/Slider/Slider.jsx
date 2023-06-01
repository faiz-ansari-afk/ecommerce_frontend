import { Children, isValidElement, useState } from 'react';
// Keen Slider
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import s from './Slider.module.css';
// import { Arrow } from '@components/Icon';

const Slider = ({ children, perView, space, navigation = false }) => {
  // const [sliderRef] = useKeenSlider({
  //   slides: {
  //     perView,
  //     spacing: space,
  //   },
  // });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView,
      spacing: space,
    },
  });

  return (
    <>
      {navigation ? (
        <div className={`${s['navigation-wrapper']}`}>
          <div ref={sliderRef} className="keen-slider">
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                return {
                  ...child,
                  props: {
                    ...child.props,
                    className: `
              ${
                child.props.className ? `${child.props.className}` : ''
              }  keen-slider__slide`,
                  },
                };
              }
              return child;
            })}
          </div>
          {loaded && instanceRef.current && (
            <>
              <Arrow
                left
                onClick={(e) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                disabled={currentSlide === 0}
              />

              <Arrow
                onClick={(e) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              />
            </>
          )}
        </div>
      ) : (
        <div className={s.root}>
          <div ref={sliderRef} className="keen-slider">
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                return {
                  ...child,
                  props: {
                    ...child.props,
                    className: `
                  ${
                    child.props.className ? `${child.props.className}` : ''
                  }  keen-slider__slide`,
                  },
                };
              }
              return child;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Slider;

function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : ""
  return (
      <svg
      onClick={props.onClick}
      className={`arrow ${
          props.left ? `${s["arrow--left"]}` : `${s["arrow--right"]}`
      } ${s[`${disabeld}`]}`}

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
  )
}