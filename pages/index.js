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

export default function Home({ homepage, categories, products }) {
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
          <section className="py-12 md:py-24 lg:py-64 flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-300   to-white">
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
          {homepage.attributes.THIRD_HERO && (
            <ClassifyHero hero={homepage.attributes.THIRD_HERO} />
          )}
          <section className="mx-1 relative my-44 ">
          {/* <div className="bg-black absolute  md:hidden -top-[50px] -left-[50px] animate-pulse left-0 -z-[999] rounded-full overflow-hidden w-36 h-36" /> */}
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
  let [homepage, categoriesDetails, products] = [null, null, null];
  try {
    [homepage, categoriesDetails, products] = await Promise.all([
      homepagePromise,
      categoriesDetailsPromise,
      productsPromise,
    ]);

    // Handle the results
    // Use homepage, categoriesDetails, and products variables here
  } catch (error) {
    // Handle errors
  }

  return {
    props: {
      homepage: homepage || null,
      categories: categoriesDetails || null,
      products: products || null,
    },
  };
}
