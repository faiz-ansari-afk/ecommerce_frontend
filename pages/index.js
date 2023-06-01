'use-client';
import Video from '@/components/Video';
import Image from 'next/image';
import { getAuthJWT } from '@/utils/controller/sessionController';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AutoPlaySlider } from '@/components/Slider';
import BrowseCategories from '@/components/BrowseCategories';
import { parseCookies } from 'nookies';
import { getHomepageData } from '@/utils/controller/homepageController';
import { ClassifyHero } from '@/components/Homepage';

export default function Home({ homepage }) {
  // const [homepage, setHomepage] = useState(null);
  // // ////console.log("homepage",homepage)
  // const [authJWT, setAuthJWT] = useState(null);

  // // making homepage client side
  useEffect(() => {
    let kill = parseCookies(null).kill;
    const fetchData = async () => {
      // const homepageResult = await getHomepageData();
      if (!kill) {
        kill = await getAuthJWT();
      }
      // setHomepage(homepageResult);
    };
    fetchData();
  }, []);
  ////console.log(homepage)
  return (
    <>
      <Head>
        <title>Homepage - Sadak Chaap</title>
        <meta
          name="description"
          content="Shop local in Bhiwandi with our ecommerce website. Browse and buy from a variety of products with ease. Visit us today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="microphone" content="true" />
      </Head>
      <main className="">
        {homepage.attributes.FIRST_HERO && <ClassifyHero hero={homepage.attributes.FIRST_HERO} />}

        {homepage.attributes.SECOND_HERO && <ClassifyHero hero={homepage.attributes.SECOND_HERO} />}
        <section className=" py-20 lg:py-24 ">
          <BrowseCategories />
        </section>

        {homepage.attributes.THIRD_HERO && <ClassifyHero hero={homepage.attributes.THIRD_HERO} />}
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const homepage = await getHomepageData();


  return { props: { homepage } };
}
