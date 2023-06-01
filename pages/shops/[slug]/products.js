import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAllShops } from '@/utils/controller/shopController';
import { Player } from '@lottiefiles/react-lottie-player';
import {
  getCoverImageUrl,
  getThemeColor,
} from '@/utils/controller/productController';
import slugify from 'slugify';
import SearchBar from '@/components/Shops/SearchBar';
import ProductCard from '@/components/product/ProductCard';

const products = ({ shop }) => {
  const router = useRouter();
  const [results, setResults] = useState(shop.attributes.products.data);

  return (
    <div>
      {shop ? (
        <>
          <Head>
            <title>{shop.attributes.name}: Collections</title>
          </Head>
          <section className="py-20 px-2 lg:py-32 lg:px-10">
            <div>
              <h1
                className={`mb-4 text-center font-heading text-5xl font-medium italic tracking-wide text-gray-900 lg:mb-8 lg:text-7xl `}
              >
                {shop.attributes.name}
              </h1>
              <p className="mx-auto mb-4 max-w-3xl text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl"></p>
            </div>
            <div className="my-5 max-w-3xl mx-auto ">
              <SearchBar
                dataSets={shop.attributes.products.data}
                results={results}
                setResults={setResults}
                ofWhich="PRODUCTS"
                placeholder={`Search collections of ${shop.attributes.name}`}
              />
            </div>
            <div className="text-sm w-full rounded-lg bg-gray-100 text-right px-2 py-1">
              Total products: {results.length}
            </div>
            <p className=""></p>
            <main className="my-16 ">
              <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {results.length > 0 ? (
                  results.map((product, index) => {
                    const theme = product.attributes.theme;
                    return <ProductCard product={product} />;
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
                        No collection found in the Shop 0f{' '}
                        {shop.attributes.name}. Try changing different keywords
                      </p>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                )}
              </div>
            </main>
          </section>
        </>
      ) : (
        <div>Shop Does not exist</div>
      )}
    </div>
  );
};

export default products;
export async function getServerSideProps({ params }) {
  const { slug } = params;
  const allShops = await getAllShops();

  let myShop = null;
  if (allShops) {
    myShop = allShops.filter((shop) => slugify(shop.attributes.name) === slug);
    myShop = myShop[0];
  }
  if (typeof myShop === 'undefined') {
    myShop = null;
  }

  return {
    props: {
      shop: myShop,
    },
  };
}
