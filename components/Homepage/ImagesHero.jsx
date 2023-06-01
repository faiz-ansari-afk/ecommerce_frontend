import React from 'react';
import slugify from 'slugify';
import Link from 'next/link';
import ImageSlider from '../product/ImageSlider';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { mapToSliderImages } from '@/utils/controller/productController';
import { AutoPlaySlider } from '../Slider';

// import  from '@/components/product/ImageSlider';
// import {} from '@/utils/controller/productController';

const ImagesHero = ({ hero }) => {
  const {
    first_title,
    second_title,
    description,
    button,
    hero_for,
    glassmorphism_div,
  } = hero;
  ////console.log('glassmorphism_div', glassmorphism_div.reactCSSstyle);
  //generate link
  let linkUrl = '/shops';
  if (hero_for === 'shop') {
    if (hero.shop?.data) {
      linkUrl = `/shops/${slugify(hero.shop.data.attributes.name)}`;
    }
  } else if (hero_for === 'manyproducts') {
    linkUrl = '/search';
    if (hero.product?.data) {
      linkUrl = `/search?searchQuery=${hero.product.data.attributes.search_text}`;
    }
    if (hero.shop?.data) {
      linkUrl = `/shops?searchQuery=${hero.shop.data.attributes.search_text}`;
    }
  } else {
    linkUrl = '/collections';
    if (hero.product?.data) {
      linkUrl = `/product/${slugify(hero.product.data.attributes.name)}`;
    }
  }

  const mappedImages = mapToSliderImages(hero.image_gallery.data);

  return (
    <div className="relative flex justify-center items-center mb-32  overflow-hidden w-screen h-screen  ">
      {glassmorphism_div?.id && (
        <div style={glassmorphism_div.reactCSSstyle}></div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mx-2 md:mx-12 justify-center items-center ">
        <div className=" text-center md:text-left my-16  ">
          <div className="mb-2 md:mb-4 ">
            <span style={first_title.reactCSSstyle}>{first_title.title}</span>
          </div>

          <div className="">
            {second_title && (
              <h2 className="text-3xl md:text-4xl">
                <span style={second_title.reactCSSstyle}>
                  {second_title.title}
                </span>
              </h2>
            )}
          </div>
          <div className="mb-4">
            <p className="md:text-lg">
              <span style={description.reactCSSstyle}>{description.title}</span>
            </p>
          </div>
          <div className="">
            <Link href={linkUrl}>
              <button className="hover:shadow-lg ">
                <span style={button.reactCSSstyle}>{button.title}</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="">
          <div className="bg-transparent  rounded-lg  ">
            <AutoPlaySlider
              dataArray={mappedImages}
              heightWidth="aspect-[4/3.5] rounded-lg"
              imageCover="object-cover  rounded-b-lg"
              arrow={true}
              timer={5000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesHero;
