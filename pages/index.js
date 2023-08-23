import { useState, useEffect } from 'react';
import Head from 'next/head';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import BrowseCategories from '@/components/BrowseCategories';
import ProductsGallery from '@/components/Homepage/ProductsGallery';
import Feature from '@/components/Homepage/Feature';
import { getHomepageData } from '@/utils/controller/homepageController';
import { ClassifyHero } from '@/components/Homepage';
import { getFilteredProducts } from '@/utils/controller/productController';


import RequestHero from '@/components/RequestHero';
import { useRouter } from 'next/router';
import ProductGalleryNoScroll from '@/components/Homepage/ProductGalleryNoScroll';

export default function Home({ homepage, categories, products, watchProducts, burqaProducts }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Homepage - Are Baba</title>
        <meta
          name="description"
          content="Shop local in Bhiwandi with our ecommerce website. Browse and buy from a variety of products with ease. Visit us today!"
        />
      </Head>
      {homepage ? (
        <div className="container mx-auto animate__animated animate__fadeIn animate__fast ">
          <div className="pt-16 bg-slate-700" />
          {homepage.attributes.FIRST_HERO && (
            <ClassifyHero hero={homepage.attributes.FIRST_HERO} />
          )}

          <ProductsGallery products={products} />
          
          {burqaProducts && <ProductGalleryNoScroll products={burqaProducts} sectionName="Burqa" />}
          <section className="pt-8   flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-300   to-white">
            <Feature />
          </section>
          {homepage.attributes.SECOND_HERO && (
            <ClassifyHero hero={homepage.attributes.SECOND_HERO} />
          )}
          {categories && (
            <section className="  ">
              <BrowseCategories categories={categories} />
            </section>
          )}
          {watchProducts && <ProductGalleryNoScroll products={watchProducts} sectionName="Watches" />}
          {homepage.attributes.THIRD_HERO && (
            <ClassifyHero hero={homepage.attributes.THIRD_HERO} />
          )}
          <section className="mx-1 relative my-44 ">
              <RequestHero />
          </section>
        </div>
      ) : (
        <div className="container h-screen my-auto animate__animated animate__fadeIn animate__fast">
          <div className="flex justify-center items-center h-screen flex-col">
            <span>Loading backend...</span>
            <button
              className="py-1 px-3 bg-orange-200 shadow-md hover:shadow-lg text-gray-900 rounded-full"
              onClick={() => router.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const homepagePromise = getHomepageData();
  const categoriesDetailsPromise = mapToModelViewCategory();
  const productsPromise = getFilteredProducts({
    collectionName: 'category',
    attributeNames: ['name'],
    attributeValues: [''],
    operator: '$contains',
    pagination: false,
    pageNumber: 1,
    pageSize: 15,
  });
  const watchProductsPromise =  getFilteredProducts({
    collectionName: 'category',
    attributeNames: ['name'],
    attributeValues: ['Watches'],
    operator: '$contains',
    pagination: false,
    pageNumber: 1,
    pageSize:8,
  });
  const burqaProductsPromise =  getFilteredProducts({
    collectionName: 'category',
    attributeNames: ['name'],
    attributeValues: ['Burqa'],
    operator: '$contains',
    pagination: false,
    pageNumber: 1,
    pageSize:8,
  });
  let [homepage, categoriesDetails, products, watchProducts, burqaProducts] = [null, null, null, null, null];
  try {
    [homepage, categoriesDetails, products, watchProducts, burqaProducts] = await Promise.all([
      homepagePromise,
      categoriesDetailsPromise,
      productsPromise,
      watchProductsPromise,
      burqaProductsPromise
    ]);

    // Handle the results
    // Use homepage, categoriesDetails, and products variables here
  } catch (error) {
    // Handle errors
    console.log("Something went wrong while loading",error)
  }

  return {
    props: {
      homepage: homepage || null,
      categories: categoriesDetails || null,
      products: products || null,
      watchProducts: watchProducts || null,
      burqaProducts: burqaProducts || null,
    },
  };
}
