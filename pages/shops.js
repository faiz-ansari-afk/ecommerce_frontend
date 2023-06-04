import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getAllShops } from '@/utils/controller/shopController';
import { Player } from '@lottiefiles/react-lottie-player';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import {
  getCoverImageUrl,
  getThemeColor,
} from '@/utils/controller/productController';
import slugify from 'slugify';
import SearchBar from '@/components/Shops/SearchBar';

const Shops = ({ shops }) => {
  const [results, setResults] = useState(shops);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Partnered Shops</title>
      </Head>
      <section className="py-20 px-2 lg:py-32 lg:px-10">
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-medium italic tracking-wide text-gray-900 lg:mb-8 lg:text-7xl `}
          >
            Partnered Shops
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl">
            <span className="font-bold">Shop with ease!</span> We've partnered
            with{' '}
            <span className="font-bold text-2xl">
              {shops.length === 0 ? '0' : shops.length}
            </span>{' '}
            {shops.length === 1 ? 'shop' : 'shops'} for your convenience. <br />
            From fashion to electronics and more, enjoy hassle-free shopping at
            your fingertips.
          </p>
        </div>
        <div className="my-5 max-w-3xl mx-auto">
          <SearchBar setResults={setResults} setLoading={setLoading} />
        </div>
        <div className="h-3 w-full rounded-lg bg-gray-100" />
        <main className="my-16 ">
          <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {loading ? (
              [1, 2, 3].map((skeleton) => (
                <ProductCardSkeleton key={skeleton} />
              ))
            ) : results.length > 0 ? (
              results.map((shop, index) => {
                const theme = shop.attributes.product_for;
                return (
                  <Link
                    href={`/shops/${slugify(shop.attributes.name)}`}
                    key={index}
                  >
                    <div
                      className={`w-full flex-shrink-0  rounded-lg p-4 transition-colors 
                    ${getThemeColor(theme, 1)}`}
                    >
                      <div className="relative h-64 rounded-lg w-full md:h-64 lg:h-64">
                        <Image
                          src={getCoverImageUrl(shop)}
                          alt={shop.attributes.name}
                          fill
                          sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
                          className="h-full w-full rounded-lg object-contain"
                        />
                      </div>
                      <p className="block mt-3 line-clamp-2 text-center font-light text-gray-600 lg:text-lg">
                        {shop.attributes.name}
                      </p>
                      {shop.attributes.followers?.users?.length === 0 ? (
                        <p>New Shop</p>
                      ) : (
                        <p className="block  text-center  text-gray-400 ">
                          {shop.attributes.followers.users.length} followers
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <div className="hidden md:block"></div>
                <div className="w-full  text-center">
                  <div className="">
                    <Player
                      autoplay
                      loop
                      src="https://assets2.lottiefiles.com/private_files/lf30_3X1oGR.json"
                      style={{ height: '200px', width: '200px' }}
                    ></Player>
                  </div>
                  <p>
                    {shops.length === 0
                      ? 'No shops available.'
                      : 'No shop found. Try different keywords'}
                  </p>
                </div>
                <div className="hidden md:block"></div>
              </>
            )}
          </div>
        </main>
      </section>
    </>
  );
};

export default Shops;

export async function getServerSideProps(context) {
  const shops = await getAllShops();
  return {
    props: {
      shops,
    },
  };
}
