import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NoProductFound from '@/components/product/NoProductFound';
import {
  getFilteredProducts,
  getSlugText,
  getCoverImageUrl,
  getThemeColor,
} from '@/utils/controller/productController';
import { getCategories } from '@/utils/controller/categoryController';
import SearchBar from '@/components/Search/SearchBar';
import Pagination from '@/components/Pagination';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import ProductCard from '@/components/product/ProductCard';

const Collection = ({ _products, _paginationData, categories }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(_products);

  const [sortBy, setSortBy] = useState(null);
  const [category, setCategory] = useState('All Categories'); // this state is for passing the category to query and other place not for SELECT comp
  const [searchQuery, setSearchQuery] = useState('');

  //?______________________Set input field for searching______________________
  useEffect(() => {
    if (typeof router.query.searchQuery === 'undefined') {
      setSearchQuery('');
    } else if (decodeURI(router.query.searchQuery) !== searchQuery) {
      setSearchQuery(decodeURI(router.query.searchQuery));
    }
  }, [router.query.query]);

  //useEffect for sorting poducts by price
  useEffect(() => {
    if (sortBy && products) {
      if (sortBy === 'High Price') {
        const sortedResult = products.sort(
          (a, b) => a.attributes.base_price - b.attributes.base_price
        );
        setProducts(sortedResult);
      } else {
        const sortedResult = products.sort(
          (a, b) => b.attributes.base_price - a.attributes.base_price
        );
        setProducts(sortedResult);
      }
    }
  }, [sortBy]);

  // ?____________________ pagination_________________________
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(
    _paginationData?.pageCount || null
  );
  function handlePageChange(value) {
    setCurrentPage(value);
    updateQuery(searchQuery, category, currentPage);
  }
  // _______________________ handle setting of query paramss_________________________
  const updateQuery = (searchQuery, category = 'All-Categories', page = 1) => {
    router.push(
      {
        pathname: '/search',
        query: {
          category,
          searchQuery,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  // ______________________________________________________________

  async function fetchResultFromBackend(searchValueArrays, cp = 1) {
    const results = await getFilteredProducts({
      categoryIncluded: category,
      collectionName: 'products',
      attributeNames: ['name', 'description', 'search_text'],
      attributeValues: searchValueArrays,
      operator: '$containsi',
      pagination: true,
      pageNumber: cp,
    });
    // //console.log('search data Arrays', results);
    if (results) {
      setProducts(results.data);
      // setPaginationData(results.meta.pagination);
      setTotalPage(results.meta.pagination.pageCount);
    }
  }
  // Create a debounced version of the fetchProducts function
  const debouncedFetchProducts = (searchValueArrays, currentPage) => {
    setLoading(true);
    let timerId;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fetchResultFromBackend(searchValueArrays, currentPage);
      setLoading(false);
    }, 1000); // Debounce time: 1/2 second
  };
  //?_________ fetching initial data on client side, now fecthing initial data from server side____________

  useEffect(() => {
    if (router.query.searchQuery) {
      // //console.log('product fetch effect');
      const searchValueArrays = decodeURI(router.query.searchQuery).split(' ');
      debouncedFetchProducts(searchValueArrays, currentPage);
    } else {
      setTotalPage(null);
    }
  }, [currentPage]);

  // //console.log('products', typeof searchQuery);
  return (
    <>
      <Head>
        <title>Search </title>
      </Head>
      <section className="py-20 px-2 lg:py-32 lg:px-10 animate__animated animate__fadeIn animate__fast">
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-medium italic tracking-wide text-gray-900 lg:mb-8 lg:text-7xl `}
          >
            Search
          </h1>
          <p className="mx-auto  mb-2 max-w-xl text-center text-lg font-light text-gray-600 lg:mb-4 lg:text-xl">
            Our collection contains work from emerging talent of{' '}
            <span className="text-black">Bhiwandi</span> shops. Together, we
            create A Life Extraordinary.
          </p>
        </div>
        <div className="flex justify-center">
          <SearchBar
            updateQuery={updateQuery}
            products={products}
            category={category}
            categories={categories}
            setCategory={setCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSortBy={setSortBy}
            fetchResultFromBackend={debouncedFetchProducts}
          />
        </div>
        {products && products.length > 0 && (
          <div className="flex justify-center gap-3 items-center mb-3">
            <p className="">Sort By:</p>
            <button
              className={`border  rounded-full px-3 ${
                sortBy === 'Low Price' ? 'bg-black text-white' : 'text-black'
              } `}
              onClick={() => {
                setSortBy('Low Price');
              }}
            >
              Low Price
            </button>
            <button
              className={`border  rounded-full px-3 ${
                sortBy === 'High Price' ? 'bg-black text-white' : 'text-black'
              } `}
              onClick={() => {
                setSortBy('High Price');
              }}
            >
              High Price
            </button>
          </div>
        )}
        <div className="h-3 w-full rounded-lg bg-gray-100" />

        <div className="">
          <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-32 mt-12">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((skeleton) => (
                <ProductCardSkeleton key={skeleton} collection={false} />
              ))
            ) : products ? (
              products.length > 0 ? (
                products.map((product, index) => {
                  const theme = product.attributes.theme;
                  return <ProductCard product={product} key={index} collection={false} />;
                })
              ) : (
                <>
                  <div className="col-span-2 md:col-span-2 lg:col-span-3 ">
                    <NoProductFound />
                    <p className="text-center">
                      No product found in {category} category. Try changing
                      Categories
                    </p>
                  </div>
                </>
              )
            ) : (
              <>
                <p className="text-center mt-5 col-span-2 md:col-span-2 lg:col-span-3 ">
                  Please enter something to search
                </p>
              </>
            )}
          </div>
        </div>
        {totalPage > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </>
  );
};

export default Collection;

export async function getServerSideProps(context) {
  if (context.query.searchQuery) {
    const searchValues = decodeURI(context.query.searchQuery).split(' ');
    const [categories, filteredProducts] = await Promise.all([
      getCategories(true),
      getFilteredProducts({
        collectionName: 'products',
        attributeNames: ['name', 'description', 'search_text'],
        attributeValues: searchValues,
        operator: '$containsi',
        pagination: true,
        pageNumber: 1,
      }),
    ]);

    return {
      props: {
        _products: filteredProducts.data || null,
        categories,
        _paginationData: filteredProducts.meta.pagination || null,
      },
    };
  } else {
    const categories = await getCategories(true);
    return {
      props: {
        _products: null,
        categories,
      },
    };
  }
}
