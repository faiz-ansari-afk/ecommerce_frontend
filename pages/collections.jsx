import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  getSlugText,
  getCoverImageUrl,
  getThemeColor,
  getFilteredProducts,
} from '@/utils/controller/productController';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import slugify from 'slugify';
import Pagination from '@/components/Pagination';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import NoProductFound from '@/components/product/NoProductFound';
import ProductCard from '@/components/product/ProductCard';

const Collection = ({ _products, _paginationData, categories }) => {
  const router = useRouter();
  const isMounted = useRef(false);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(_products);

  let _categories = [{ name: 'All' }];
  if (categories) _categories = [{ name: 'All' }, ...categories];
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(false);

  //handle opening of sub category
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategorySlug(router.query.category);
      setOpenSubCategory(true);
    } else {
      setSelectedCategorySlug('All');
      setOpenSubCategory(false);
    }
  }, [router.query.category]);

  //_______________________ client side data fetching function _________________
  async function fetchResultFromBackend(categoryName, cp = 1) {
    let categoryToPass = '';
    if (categoryName !== 'All') {
      categoryToPass = categoryName;
    }
    const results = await getFilteredProducts({
      collectionName: 'category',
      attributeNames: ['name'],
      subCategory: selectedSubCategorySlug ? selectedSubCategorySlug : false,
      attributeValues: [categoryToPass],
      operator: '$containsi',
      pagination: true,
      pageNumber: cp,
      pageSize,
    });
    if (results) {
      setProducts(results.data);
      setTotalPage(results.meta.pagination.pageCount);
    }
    setLoading(false);
  }

  //** ___________ pagination _______________
  const [pageSize, setPageSize] = useState(18); //by default make it 15
  const [currentPage, setCurrentPage] = useState(_paginationData?.page || 1);
  const [totalPage, setTotalPage] = useState(
    _paginationData?.pageCount || null
  );

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    if (isMounted.current) {
      // fetch data from server for category and  sub category
      let categoryNameToPass = null;
      let timeoutId = null;
      setLoading(true);

      if (selectedCategorySlug) {
        if (selectedCategorySlug === 'All') {
          categoryNameToPass = '';
        } else {
          categoryNameToPass = selectedCategorySlug.replace('-', ' ');
          if (selectedCategorySlug === 'T-Shirts') {
            categoryNameToPass = selectedCategorySlug;
          }
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchResultFromBackend(categoryNameToPass, currentPage);
        }, 500);
        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
  }, [selectedCategorySlug, currentPage, selectedSubCategorySlug]);
  useEffect(() => {
    // i dont want to run the useEffect when page is loaded initially with server Side #FIXME: not working this logic
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <>
      <Head>
        <title>Collection - Ijazat</title>
      </Head>
      <section className="py-20 px-5 lg:py-32 lg:px-10">
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-medium italic tracking-wide text-gray-900 lg:mb-8 lg:text-7xl `}
          >
            Our Collection
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl">
            Discover a diverse collection of emerging and established design
            talent, showcasing cultural richness and creativity from{' '}
            <span className="text-black font-bold ">Bhiwandi</span> designers.
          </p>
        </div>

        <div className="flex justify-center ">
          <div
            className={`overflow-x-auto  flex md:flex-wrap  space-x-2  lg:space-x-4 ${
              !openSubCategory && 'mb-4 lg:mb-8'
            }`}
          >
            {_categories.map((category, index) => {
              if (category.slug === '1') return null;
              return (
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    router.push(
                      `/collections?category=${slugify(category.name)}`,
                      undefined,
                      { shallow: true }
                    );
                    setSelectedSubCategorySlug(null);
                    setSelectedCategorySlug(slugify(category.name));
                    // setFilteredList(products)
                    if (category.name === 'All') {
                      setOpenSubCategory(false);
                      return;
                    }
                    setOpenSubCategory(true);
                  }}
                  id={slugify(category.name)}
                  key={index}
                  className={`my-2 flex-shrink-0  rounded-full px-2 py-1 text-sm transition-colors lg:px-4 lg:py-2 lg:text-base ${
                    selectedCategorySlug === slugify(category.name)
                      ? 'border border-gray-900 bg-gray-900 text-white shadow-md'
                      : 'border border-gray-600 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
        {openSubCategory && (
          <div className="mb-4  flex flex-wrap items-center justify-center space-x-2 lg:mb-8 lg:space-x-4">
            {_categories.map((category, index) => {
              const subCatData =
                category.subCategories &&
                category.subCategories.map((subCat, index) => {
                  if (selectedCategorySlug === slugify(category.name))
                    return (
                      <button
                        onClick={() => {
                          setSelectedSubCategorySlug(subCat.name);
                        }}
                        key={index}
                        className={`my-2 flex-shrink-0 rounded-full px-2 py-1 text-xs transition-colors lg:px-3 lg:py-1 lg:text-base ${
                          selectedSubCategorySlug === subCat.name
                            ? 'border border-gray-900 bg-gray-900 text-white'
                            : 'border border-gray-600 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                        }`}
                      >
                        {subCat.name}
                      </button>
                    );
                });

              return subCatData;
            })}
          </div>
        )}

        <div className="container mx-auto grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-32">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((skeleton) => (
              <ProductCardSkeleton key={skeleton} />
            ))
          ) : products && products.length > 0 ? (
            [...products,...products].map((product, index) => {
              const theme = product.attributes.theme;
              return <ProductCard key={index} product={product} />;
            })
          ) : (
            <>
              <div className="hidden md:block"></div>
              <div className="w-full container text-center">
                <NoProductFound />
                <p>
                  {products.length === 0
                    ? 'No Product available. Please comeback soon!'
                    : `No ${selectedCategorySlug} available. Please comeback soon!`}
                </p>
              </div>
              <div className="hidden md:block"></div>
            </>
          )}
        </div>
        {totalPage && totalPage > 1 && (
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
  const { query } = context;
  let products = null;
  const categories = await mapToModelViewCategory();
  const pageSize = 18;
  // //console.log('query❤️❤️', query.category);
  if (query?.category && query.category !== 'All') {
    let unslugifiedCategory = query.category.replace('-', ' ');
    if (query.category === 'T-Shirts') {
      unslugifiedCategory = query.category;
    }

    //if category is available in url i.e coming from home page then
    products = await getFilteredProducts({
      collectionName: 'category',
      attributeNames: ['name'],
      attributeValues: [unslugifiedCategory],
      operator: '$contains',
      pagination: true,
      pageNumber: 1,
      pageSize,
    });
    // }
    // //console.log('products length 💥💥💥', products.data.length);
  } else {
    //fetch all categories products
    // //console.log('running else  also 💛💛');
    products = await getFilteredProducts({
      collectionName: 'category',
      attributeNames: ['name'],
      attributeValues: [''],
      operator: '$contains',
      pagination: true,
      pageNumber: 1,
      pageSize,
    });
  }
  //console.log(products)
  if (products && categories)
    return {
      props: {
        _products: products.data || null,
        categories,
        _paginationData: products.meta.pagination || null,
      },
    };
  else
    return {
      props: {
        _products: null,
        categories: null,
        _paginationData: null,
      },
    };
}
