import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import slugify from 'slugify';
import Image from 'next/image';
import {
  getSlugText,
  getCoverImageUrl,
  getThemeColor,
  getFilteredProducts,
} from '@/utils/controller/productController';

const BrowseCollection = ({ currentProduct }) => {
  const [products, setProducts] = useState(null);
  const [title, setTitle] = useState('Browse our collection');

  const fetchData = async () => {
    const productFetchData = await getFilteredProducts({
      collectionName: 'category',
      attributeNames: ['name'],
      attributeValues: [''],
      operator: '$contains',
      pageSize: 15,
    });
    return productFetchData;
  };
  useEffect(
    () => async () => {
      const data = await fetchData();

      const shuffledArray = data
        ? [...data].sort(() => Math.random() - 0.5)
        : null;

      if (currentProduct) {
        //get same category product
        const getProductByCategory = await getFilteredProducts({
          collectionName: 'category',
          attributeNames: ['name'],
          attributeValues: [
            currentProduct.attributes.category.data.attributes.name,
          ],
          operator: '$contains',
          pagination: false,
          pageNumber: 1,
          pageSize: 15,
        });

        //remove current product from sameCategoryData
        const finalData = getProductByCategory.filter(
          (product) =>
            product.attributes.name !== currentProduct.attributes.name
        );
        if (finalData.length === 0) {
          setProducts(
            shuffledArray
              .filter((product) => product.attributes.inStock)
              .splice(0, 6)
          );
          return;
        }
        setProducts(
          finalData.filter((product) => product.attributes.inStock).splice(0, 6)
        );
        setTitle(
          `Browse more in ${currentProduct.attributes.category.data.attributes.name} category`
        );
      } else {
        setProducts(
          shuffledArray
            .filter(
              (product) =>
                product.attributes.inStock ||
                product.attributes.name !== currentProduct.attributes.name
            )
            .splice(0, 6)
        );
      }
    },
    []
  );

  return (
    <>
      <Link
        href={`/collections?category=${
          currentProduct
            ? slugify(currentProduct.attributes.category.data.attributes.name)
            : 'All'
        }`}
      >
        <span className="mb-4 block text-center text-sm font-semibold uppercase tracking-wider text-gray-600 hover:underline lg:mb-4 lg:text-base">
          {title}
        </span>
      </Link>
      {products ? (
        <div className="flex justify-center">
          <div className="mx-2 flex space-x-8 overflow-x-auto md:mx-24 lg:mx-28 pb-4 ">
            {products &&
              products.map((product, index) => {
                const hoverTheme = getThemeColor(product.attributes.theme, 1);
                return (
                  <Link href={`/product/${getSlugText([product])}`} key={index}>
                    <div
                      className={`w-48 flex-shrink-0  rounded-lg p-2 transition-colors ${hoverTheme} hover:bg-orange-100 hover:shadow-lg hover:border-t border-t-rounded`}
                    >
                      <div className="relative mx-auto h-36 rounded-lg">
                        <Image
                          src={getCoverImageUrl(product)}
                          alt={product.attributes.name}
                          fill
                          sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
                          className="h-full w-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="lg:text-md line-clamp-1 truncate block text-center font-light uppercase text-gray-600">
                        {product.attributes.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      ) : (
        //**  Skeleton _________________
        <>
          <div className="flex justify-center">
            <div className="mx-2 flex  space-x-8 overflow-x-auto md:mx-24 lg:mx-28 pb-4 ">
              {[1, 2, 3, 4, 5].map((product, index) => (
                <div
                  key={index}
                  className={`w-48 flex-shrink-0  rounded-lg p-2 transition-colors `}
                >
                  <div className="w-48 flex-shrink-0 animate-pulse p-4 transition-colors bg-gradient-to-br from-gray-300 to-gray-100  h-44" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BrowseCollection;
