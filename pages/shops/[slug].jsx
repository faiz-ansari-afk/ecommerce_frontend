import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useContext, useRef } from 'react';
import { DataContext } from '@/store/globalstate';
import parse from 'html-react-parser';
import slugify from 'slugify';
import { Phone, Email, Location } from '@/components/Icon';
import { parseCookies } from 'nookies';
import { decodeJWT } from '@/utils/controller/sessionController';
import Confetti from 'react-confetti';
import {
  getSlugText,
  getCoverImageUrl,
  mapToSliderImages,
  getThemeColor,
} from '@/utils/controller/productController';
import {
  getAllShops,
  updateFollowListOfShop,
} from '@/utils/controller/shopController';

import ImageSlider from '@/components/product/ImageSlider';
import { getUser } from '@/utils/controller/auth';

export const getStaticPaths = async () => {
  // const shops = await getAllShops();

  // const slugLink = getSlugText(shops);

  // if (!shops) return {
  //   paths:[],
  //   fallback: 'blocking',
  // };
  // const paths = shops.map((p) => ({ params: { slug: p.attributes.name.toString() } }));
  return {
    paths:[],
    fallback: 'blocking'
  };
};

export const getStaticProps = async ({ params }) => {
  const shops = await getAllShops();

  const shop =
    shops && shops.find((shop) => getSlugText([shop]) === params.slug);

  return {
    props: {
      shop,
      key: params.slug,
      revalidate:0
    },
  };
};

const Shop = ({ shop }) => {
  const [showMore, setShowMore] = useState(false);
  const [products, setProducts] = useState(
    shop.attributes?.products.data.slice(0, 6)
  );
  const mappedImages = mapToSliderImages(shop.attributes.images.data);
  const theme = shop.attributes.product_for;

  // Subscribers state and logic
  // const confettiContainerRef = useRef(null);
  // const [showConfetti, setShowConfetti] = useState(false);
  // const [containerSize, setContainerSize] = useState({
  //   width: 0,
  //   height: 0
  // });
  // useEffect(() => {
  //   if (confettiContainerRef.current) {
  //     const { width, height } = confettiContainerRef.current.getBoundingClientRect();
  //     setContainerSize({ width, height });
  //   }
  // }, []);
  // useEffect(() => {
  //   let timeout;
  //   if (showConfetti) {
  //     timeout = setTimeout(() => setShowConfetti(false), 2000);
  //   }
  //   return () => clearTimeout(timeout);
  // }, [showConfetti]);

  const [user, setUser] = useState(null);
  const cookies = parseCookies();
  const userJWT = decodeJWT(cookies.jwt);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { dispatch, state } = useContext(DataContext);
  const [followCount, setFollowCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (shop.attributes.followers?.users) {
      setFollowCount(shop.attributes.followers.users.length);
    }
  }, []);
  useEffect(() => {
    if (userJWT) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  });
  //check if user is already following a shop or not
  useEffect(() => {
    async function checkFollow() {
      if (userLoggedIn) {
        const loggedUser = await getUser();
        setUser((prev) => ({ ...prev, user: loggedUser }));
        const existUserInFollowing = shop.attributes.followers.users.includes(
          loggedUser.email
        );
        setIsFollowing(existUserInFollowing);
      }
    }
    checkFollow();
  }, [userLoggedIn]);

  const handleFollowings = (() => {
    let debounceTimer;

    return async (e) => {
      const action = e.target.innerText.toLowerCase();
      if (!userLoggedIn) {
        dispatch({ type: 'TRUE_OPEN_LOGIN' });
      } else {
        dispatch({ type: 'FALSE_OPEN_LOGIN' });
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            const shopUpdates = await updateFollowListOfShop({
              action,
              id: shop.id,
              email: user.user.email,
            });
            setFollowCount(shopUpdates.attributes.followers.users.length);
            setIsFollowing((ov) => !ov);
          } catch (error) {
            alert('Cannot follow error');
            //console.error(error);
          }
        }, 500);
      }
    };
  })();
  // ////console.log("containerSize",containerSize)
  return (
    <>
      <Head>
        <title>{shop.attributes.name}</title>
      </Head>

      <section>
        <div className="relative  aspect-auto">
          {/* h-[70vh] md:h-[85vh] lg:h-[90vh] */}
          <ImageSlider
            images={mappedImages}
            selectedImage="0"
            heightWidth="aspect-[16/14] md:aspect-[16/9] lg:aspect-[16/7]  w-screen"
          />
        </div>
        {/* _____________________Wrapper Div __________________________ */}
        <div>
          <div className="relative">
            {/* _____________________________Details Container_________________________________ */}
            <div className="container  mx-auto px-2 md:px-10 md:col-span-2 md:pb-20  lg:pb-32 relative">
              <div>
                <div className="items-center  mx-1 relative">
                  <h1
                    className={` text-center mt-4 font-heading text-3xl font-medium tracking-wide text-gray-900 lg:mt-8 md:text-5xl`}
                  >
                    {shop.attributes.name}
                  </h1>
                </div>
                <div
                  className={`text-center mt-4 flex justify-center relative`}
                >
                  <span
                    className={`${getThemeColor(
                      theme
                    )} flex gap-5 items-center px-5 md:px-12 py-2 rounded-lg`}
                  >
                    <span className="relative font-serif">
                      {followCount} followers
                    </span>
                    <button
                      className="bg-black text-white rounded-full px-4 py-1 hover:shadow-lg"
                      onClick={(e) => handleFollowings(e)}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    {/* {isFollowing && (
                      <div className="hidden md:block" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                        <Confetti
                          width={containerSize.width}
                          height={containerSize.height}
                          gravity={0.01}
                          numberOfPieces={100}
                        />
                      </div>
                    )} */}
                  </span>
                </div>

                <div className="contact details flex flex-col md:flex-row gap-5 justify-center rounded-lg px-2 bg-gray-100 my-6 py-6">
                  {shop.attributes?.email && (
                    <div className="flex gap-2 items-center">
                      <span className="w-6 h-6">
                        <Email />
                      </span>
                      <a href={`mailto:${shop.attributes.email}`}>
                        {shop.attributes.email}
                      </a>
                    </div>
                  )}
                  {shop.attributes?.contact_mobile && (
                    <div className="flex gap-2 items-center">
                      <span className="w-5 h-5">
                        <Phone />
                      </span>
                      <a href={`tel:+91${shop.attributes.contact_mobile}`}>
                        {shop.attributes.contact_mobile}
                      </a>
                    </div>
                  )}
                  {shop.attributes?.address && (
                    <div className="flex overflow-x-auto md:overflow-hidden gap-2 items-center  ">
                      <span className=" ">
                        <Location />
                      </span>
                      {/* <a href={`tel:+91${shop.attributes.address}`}> */}
                      {shop.attributes.address}
                      {/* </a> */}
                    </div>
                  )}
                </div>

                <div className="mt-12">
                  <Link
                    href={`/shops/${slugify(shop.attributes.name)}/products`}
                  >
                    <p className="text-2xl hover:underline">Our collections</p>
                  </Link>
                  <div className="flex ">
                    <div className="flex gap-5 overflow-x-auto items-center  ">
                      {products &&
                        products.map((product, index) => {
                          const theme = product.attributes.theme;
                          return (
                            <Link
                              href={`/product/${getSlugText([product])}`}
                              key={index}
                            >
                              <div
                                className={`w-48 flex-shrink-0  rounded-lg p-2 transition-colors 
                                ${getThemeColor(theme, 1)} 
                              `}
                              >
                                <div className="relative mx-auto h-36 rounded-lg">
                                  <Image
                                    // src={product.images[0].src}
                                    src={getCoverImageUrl(product)}
                                    alt={product.attributes.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
                                    className="h-full w-full object-contain rounded-lg"
                                  />
                                </div>
                                <span className="lg:text-md truncate block text-center font-light uppercase text-gray-600">
                                  {product.attributes.name}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      <Link
                        href={`/shops/${slugify(
                          shop.attributes.name
                        )}/products`}
                      >
                        <p
                          className={`text-xl   ${getThemeColor(
                            theme,
                            1
                          )} px-2 rounded-lg`}
                        >
                          see more
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
                {/**_____________ #TODO: Video Banner Here _________ */}
                <div className="my-24">
                  <div className="mt-4 md:mt-8">
                    <h3 className="font-bold text-2xl mb-4">About:</h3>
                    <p
                      className={` mb-1  text-xl font-light text-gray-900 lg:mb-2 lg:text-xl ${
                        showMore ? '' : 'line-clamp-5'
                      }`}
                    >
                      {parse(shop.attributes.description)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMore((showMore) => !showMore)}
                    className="text-gray-600 underline"
                  >
                    {showMore ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
