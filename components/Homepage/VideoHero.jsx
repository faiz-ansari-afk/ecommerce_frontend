import React from 'react';
import slugify from 'slugify';
import Video from '@/components/Video';
import Link from 'next/link';

const VideoHero = ({ hero }) => {
  const { first_title, second_title, description, button, hero_for } = hero;

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
  // const firstTitleStyles = first_title.reactCSSstyle;
  // ////console.log('Video Hero', firstTitleStyles);
  return (
    <div>
      <Video
        src={`${hero.video.data.attributes.url}`}
      >
        <div className="my-6">
          <p className="text-sm">
            <span
              className="inline-block "
              style={{
                ...first_title.reactCSSstyle,
                display: 'inline-block !important',
              }}
            >
              {first_title.title}
            </span>
          </p>
        </div>
        {second_title && (
          <div className="mb-4 text-5xl md:text-6xl text-black ">
            <h1 className={` `}>
              <span style={second_title.reactCSSstyle}>
                {second_title.title}
              </span>
            </h1>
          </div>
        )}
        <div className="mb-4  text-black ">
          <p>
            <span style={description.reactCSSstyle}> {description.title}</span>
          </p>
        </div>
        <div className="my-2  ">
          <Link href={linkUrl} className="">
            <button className="hover:shadow-lg ">
              <span style={{ ...button.reactCSSstyle }}>{button.title}</span>
            </button>
          </Link>
        </div>
      </Video>
    </div>
  );
};

export default VideoHero;
