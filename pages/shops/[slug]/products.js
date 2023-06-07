import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllShops } from '@/utils/controller/shopController';
import { Player } from '@lottiefiles/react-lottie-player';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { getFilteredProducts } from '@/utils/controller/productController';
import slugify from 'slugify';
import SearchBar from '@/components/Shops/SearchBar';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/Pagination';

const products = ({ shop, products, _pagination }) => {
  // console.log(products, _pagination, shop);
  const router = useRouter();
  const [results, setResults] = useState(products);
  const [loading, setLoading] = useState(false);

  async function fetchResultFromBackend(categoryName, cp = 1) {
    const results = await getFilteredProducts({
      collectionName: 'shop',
      attributeNames: ['name'],
      attributeValues: [shop.attributes.name],
      operator: '$containsi',
      pagination: true,
      pageNumber: cp,
      pageSize: 15,
    });
    if (results) {
      setResults(results.data);
      setTotalPage(results.meta.pagination.pageCount);
    }
    setLoading(false);
  }

  //** ___________ pagination _______________
  const [pageSize, setPageSize] = useState(15); //by default make it 15
  const [currentPage, setCurrentPage] = useState(_pagination?.page || 1);
  const [totalPage, setTotalPage] = useState(_pagination?.pageCount || null);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    // fetch data from server for category and  sub category
    let categoryNameToPass = null;
    let timeoutId = null;
    setLoading(true);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fetchResultFromBackend(categoryNameToPass, currentPage);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentPage]);
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
                shopName={shop.attributes.name}
                setResults={setResults}
                ofWhich="PRODUCTS"
                placeholder={`Search collections of ${shop.attributes.name}`}
                setLoading={setLoading}
              />
            </div>
            <div className="text-sm w-full rounded-lg bg-gray-100 text-right px-2 py-1">
              Total products: {_pagination.total}
            </div>
            <p className=""></p>
            <main className="my-16 ">
              <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map((skeleton) => (
                    <ProductCardSkeleton key={skeleton} collection={false} />
                  ))
                ) : results.length > 0 ? (
                  results.map((product, index) => {
                    const theme = product.attributes.theme;
                    return <ProductCard product={product} key={index} collection={false} />;
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
      {totalPage && totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default products;
export async function getServerSideProps({ params }) {
  const { slug } = params;
  const allShops = await getAllShops();

  const unslugifiedShop = slug.replace(/-/g, ' ');
  const products = await getFilteredProducts({
    collectionName: 'shop',
    attributeNames: ['name'],
    attributeValues: [unslugifiedShop],
    operator: '$contains',
    pagination: true,
    pageNumber: 1,
    pageSize: 15,
  });
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
      products: products.data,
      _pagination: products.meta.pagination,
    },
  };
}
