import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getCoverImageUrl,
  getSlugText,
  getThemeColor,
} from '@/utils/controller/productController';
import ColorSwatch from './ColorSwatch';

const ProductCard = ({ product, collection = true }) => {
  const colors = product.attributes?.color_and_size_variants?.map(
    (csv) => csv.color_code
  );
  return (
    <Link href={`/product/${getSlugText([product])}`}>
      <div
        className={`w-full flex-shrink-0  md:border-0 rounded-lg p-1 md:p-4 transition-colors hover:bg-orange-100 hover:shadow-lg ${collection ? 'border' : ''}
                      ${getThemeColor(product.attributes.theme, 1)} `}
      >
        {/* <div className=" relative h-64 w-full md:h-64 lg:h-64"> */}
        <div className={` relative   w-full md:h-64 lg:h-64 ${collection ? 'h-24' : 'h-64'}`}>
          <Image
            src={getCoverImageUrl(product)}
            alt={product.attributes.name}
            fill
            sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center my-2">
          <ColorSwatch colors={colors} collection={collection} />
        </div>
        <h3 className={`block truncate text-center font-light text-gray-600 lg:text-lg ${collection ? '' : 'text-lg'}`}>
          {product.attributes.name}
        </h3>
        <p className={`font-mono text-center font-bold text-gray-600 lg:text-lg ${collection ? '' : 'text-lg'}`}>
          ₹{product.attributes.base_price}{' '}
          {product.attributes.shop_price && (
            <del>₹{product.attributes.shop_price}</del>
          )}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
