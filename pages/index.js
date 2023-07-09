import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import BrowseCategories from '@/components/BrowseCategories';
import ProductsGallery from '@/components/Homepage/ProductsGallery';
import { getHomepageData } from '@/utils/controller/homepageController';
import { ClassifyHero } from '@/components/Homepage';
import { getFilteredProducts } from '@/utils/controller/productController';
import { Player } from '@lottiefiles/react-lottie-player';
// import { onForegroundMessage } from '@/firebase';


import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies } from 'nookies';
import { DataContext } from '@/store/globalstate';
import RequestHero from '@/components/RequestHero';
import { useRouter } from 'next/router';


// import styles from '@/components/Homepage/ProductGallery.module.css'
export default function Home({ homepage, categories, products }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { dispatch, state } = useContext(DataContext);

  const cookies = parseCookies();
  useEffect(() => {
    const user_data = decodeJWT(cookies.jwt);
    setUser(user_data);
  }, [cookies.jwt]);

  

  
  return (
    <>
      <Head>
        <title>Homepage - Are Baba</title>
        <meta
          name="description"
          content="Shop local in Bhiwandi with our ecommerce website. Browse and buy from a variety of products with ease. Visit us today!"
        />
      </Head>
      {homepage ? <main className="container mx-auto animate__animated animate__fadeIn animate__fast ">
        <div className="pt-16 bg-slate-700" />
        {homepage.attributes.FIRST_HERO && (
          <ClassifyHero hero={homepage.attributes.FIRST_HERO} />
        )}
        
        <ProductsGallery products={products} />
        {!user && (
          //
          <div className=" flex justify-center  m-2   ">
            <div className="flex flex-col md:flex-row  border-black border rounded-lg">
              <div className="">
                <Player
                  autoplay
                  loop
                  src="https://assets6.lottiefiles.com/private_files/lf30_iraugwwv.json"
                  style={{ height: '200px', width: '200px' }}
                ></Player>
              </div>
              <div className="  rounded-lg m-2 p-2 text-center max-w-lg md:flex justify-center md:flex-col ">
                <h3 className="text-xl text-center">Welcome to Our Store</h3>
                <p className="md:text-lg my-2 text-gray-700">
                  Please log in to access your account, cart, orders.
                </p>
                <div className="flex  justify-center">
                  <button
                    className="button-transition max-w-[200px] text-white bg-black inline-block px-9 uppercase"
                    onClick={() => {
                      dispatch({ type: 'TRUE_OPEN_LOGIN' });
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col  py-1 items-center md:flex-row justify-center my-12 mx-2 gap-8 md:gap-4 lg:gap-8">
          <div className=" flex justify-center items-center gap-4  md:max-w-sm lg:max-w-lg  border-gray-300  bg-white border-t rounded-lg  p-1 lg:p-2 shadow-lg hover:scale-[1.02] transition delay-200 ease-in-out">
            <div className="relative h-32 w-32 md:h-44 md:w-44 flex-shrink-0">
              <Image
                src="/openbox.jpg"
                alt="open box logo"
                fill
                sizes="(max-width: 768px) 100vw,
                                    (max-width: 1200px) 50vw,
                                    33vw"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className=" text-2xl leading-10 lg:text-2xl md:text-3xl text-gray-600">
              <span className="bg-orange-300 text-black p-2">OPEN</span> BOX
              DELIVERY
            </div>
          </div>

          <div className=" flex justify-center items-center gap-4  md:max-w-sm lg:max-w-lg  border-gray-300  bg-white border-t rounded-lg  p-1 lg:p-2 shadow-lg hover:scale-[1.02] transition delay-200 ease-in-out">
            <div className="relative h-32 w-32 md:h-44 md:w-44 flex-shrink-0">
              <Image
                src="/cod.gif"
                alt="open box logo"
                fill
                sizes="(max-width: 768px) 100vw,
                                    (max-width: 1200px) 50vw,
                                    33vw"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className=" text-2xl leading-10 lg:text-2xl md:text-3xl text-gray-600">
              <span className="bg-lime-300 text-black p-2">CASH</span> ON
              DELIVERY
            </div>
          </div>
        </div>
        {homepage.attributes.SECOND_HERO && (
          <ClassifyHero hero={homepage.attributes.SECOND_HERO} />
        )}
        {categories && (
          <section className=" py-20 lg:py-24 ">
            <BrowseCategories categories={categories} />
          </section>
        )}
        {homepage.attributes.THIRD_HERO && (
          <ClassifyHero hero={homepage.attributes.THIRD_HERO} />
        )}
        <section className="mx-1 my-44 md:">
          <RequestHero />
        </section>
      </main>:
      <main className='container h-screen my-auto animate__animated animate__fadeIn animate__fast'>
        <div className='flex justify-center items-center h-screen flex-col'>
          <span>Loading backend...</span>
          <button className='py-1 px-3 bg-orange-200 shadow-md hover:shadow-lg text-gray-900 rounded-full' onClick={()=>router.reload()}>Reload</button>
        </div></main>}
    </>
  );
}

export async function getServerSideProps(ctx) {
  // const [homepage,categoriesDetails,products] = await Promise.all([])
  // const homepage = await getHomepageData();
  // const categoriesDetails = await mapToModelViewCategory();
  // const products = await getFilteredProducts({
  //   collectionName: 'category',
  //   attributeNames: ['name'],
  //   attributeValues: [''],
  //   operator: '$contains',
  //   pagination: false,
  //   pageNumber: 1,
  //   pageSize: 15,
  // });
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
