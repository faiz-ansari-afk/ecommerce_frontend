import slugify from 'slugify';
import Link from 'next/link';
import Image from 'next/image';
import { getCoverImageUrl } from '@/utils/controller/productController';
import styles from './ProductGallery.module.css';
const ProductsGallery = ({ products }) => {
  return (
    <div className={` relative   w-full`}>
      <div className={`   relative px-4 lg:px-12 pb-8 `}>
        <div className={` ${styles.bgRipple} absolute inset-0 z-2`}></div>
        <Link href={`/collections`}>
          <p className="text-xl uppercase pt-8 text-center tracking-widest ">
            Our Newest collections
          </p>
        </Link>
        <div className="flex h-64 lg:h-72  gap-6 py-6 overflow-x-auto px-2 md:px-4 lg:px-12  scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
          {products
            ? products.map((product, index) => (
                <div
                  className="aspect-[2/2]  flex-shrink-0  hover:scale-105 transition duration-300  relative   rounded-lg bg-slate-400 "
                  key={index}
                >
                  <Link href={`/product/${slugify(product.attributes.name)}`}>
                    <div className=" bg-gray-400 rounded-lg ">
                      <div className=" relative aspect-[2/2]">
                        <Image
                          src={getCoverImageUrl(product)}
                          fill
                          sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
                          className="rounded-lg object-cover"
                          alt={product.attributes.name}
                        />
                      </div>
                      <div className="absolute w-full rounded-b-lg overflow-hidden  bottom-0 px-4  bg-slate-900  text-gray-200  ">
                        <p className="text-center line-clamp-1">
                          {product.attributes.name}{' '}
                        </p>
                        <p className="text-center pb-2 ">
                          ₹{product.attributes.base_price}{' '}
                          {product.attributes.shop_price && (
                            <del className="ml-4">
                              ₹{product.attributes.shop_price}
                            </del>
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            : [1, 1, 1, 1, 1].map((product, index) => (
                <div
                  key={index}
                  className="aspect-[2/2] h-54 overflow-scroll-none animate-pulse p-4 transition-colors bg-gradient-to-br from-gray-300 to-gray-100  "
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGallery;
