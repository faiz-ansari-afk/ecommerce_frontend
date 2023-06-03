import React from 'react';
import Image from 'next/image';
import slugify from 'slugify';
import Link from 'next/link';
import { getCoverImageUrl } from '@/utils/controller/productController';

const CoverImageHero = ({ hero }) => {
  const {
    first_title,
    second_title,
    description,
    button,
    hero_for,
    glassmorphism_div,
  } = hero;
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

  return (
    <div className="relative flex justify-center items-center  overflow-hidden w-screen h-screen">
      {glassmorphism_div?.id && (
        <div style={glassmorphism_div.reactCSSstyle}></div>
      )}
      <div className="grid h-screen grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mx-2 md:mx-12 justify-center items-center ">
        <div className="">
          <div className="relative bg-transparent aspect-[4/3.5]  rounded-lg   ">
            <Image
              src={`${hero.cover_image.data.attributes.url}`}
              alt="product image"
              fill
              sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
              className={`object-cover`}
            />
          </div>
        </div>
        <div className=" text-center md:text-left ">
          <div className="text-xl my-3 md:my-5 ">
            <span style={first_title.reactCSSstyle}>{first_title.title}</span>
          </div>
          {second_title && (
            <div className="my-3 md:my-5">
              <h3 className="text-4xl md:text-6xl">
                <span style={second_title.reactCSSstyle}>
                  {second_title.title}
                </span>
              </h3>
            </div>
          )}
          <div className=" mb-5">
            <p className="">
              <span style={description.reactCSSstyle}>{description.title}</span>
            </p>
          </div>
          <div className="">
            <Link href={linkUrl}>
              <button className={` hover:shadow-lg `}>
                <span style={button.reactCSSstyle}>{button.title}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverImageHero;
