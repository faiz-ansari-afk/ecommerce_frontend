import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';
import { getCoverImageUrl, getThemeColor } from '@/utils/controller/productController';

const ShopView = ({ shop }) => {
  const theme = shop.attributes.product_for;
  return (
    <aside className=''>
        <h3 className='text-xl mt-4  font-light text-gray-600' title={`shop: ${shop.attributes.name}`}>{shop.attributes.name}</h3>
      <Link href={`/shops/${slugify(shop.attributes.name)}`}>
        <div
          className={`w-full flex-shrink-0  rounded-lg p-4 transition-colors 
          ${getThemeColor(theme,1)}`}
        >
          <div className="relative h-64 rounded-lg w-full md:h-64 lg:h-64">
            <Image
              // src={shop.images[0].src}
              src={getCoverImageUrl(shop)}
              alt={shop.attributes.name}
              fill
              sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
              className="h-full w-full rounded-lg object-cover"
            />
            <button className='absolute inset-0 '><span className='bg-white px-3 py-1 rounded-full shadow-lg hover:shadow-white hover:bg-black hover:text-white'>Visit Shop</span></button>
          </div>
        </div>
      </Link>
    </aside>
  );
};

export default ShopView;
