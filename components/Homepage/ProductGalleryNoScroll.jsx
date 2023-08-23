import React from 'react';
import Image from 'next/image';
import {
  getCoverImageUrl,
  getSlugText,
} from '@/utils/controller/productController';
import ColorSwatch from '../product/ColorSwatch';
import Link from 'next/link';
import {useRouter} from 'next/router';
import slugify from 'slugify'

const ProductGalleryNoScroll = ({ products, sectionName }) => {
    const router = useRouter();
  return (
    <div className="py-8 md:py-16 px-1 lg:px-10 mb-6 bg-gradient-to-b from-slate-900  via-slate-200   to-white rounded-t-xl">
      <div className="">
        <h3 className="uppercase text-3xl tracking-wider pb-6 text-gray-200 text-center">
          Explore {sectionName}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2  md:gap-4 lg:grid-cols-4">
          {products.map((product, ind) => {
            const colors = product.attributes?.color_and_size_variants?.map(
              (csv) => csv.color_code
            );
            return (
              <div className=" rounded-lg shadow-lg" key={ind}>
                <Link href={`/product/${getSlugText([product])}`}>
                  <div className=" relative aspect-[2/2]">
                    <Image
                      src={getCoverImageUrl(product)}
                      fill
                      sizes="(max-width: 768px) 100vw,
                                        (max-width: 1200px) 50vw,
                                        33vw"
                      className="rounded-lg object-cover border"
                      alt={product.attributes.name}
                    />
                  </div>
                  <div className="px-2 ">
                    <p className="truncate text-center md:text-2xl">
                      {product.attributes.name}
                    </p>
                    <div className="flex justify-center">
                      <ColorSwatch colors={colors} collection={false} />
                    </div>
                    <p className="my-1  flex justify-end">
                      <span className="border md:text-2xl rounded-lg px-2 bg-slate-800 text-gray-100 py-0.5">
                        ₹ {product.attributes.base_price}
                      </span>
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 flex justify-end">
          <button onClick={()=> router.push(`/collections?category=${slugify(sectionName)}`)} className="button bg-black text-gray-200">More {sectionName}</button>
        </p>
      </div>
    </div>
  );
};

export default ProductGalleryNoScroll;
