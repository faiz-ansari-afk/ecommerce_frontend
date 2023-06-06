import slugify from 'slugify';
import Link from 'next/link';
import Image from 'next/image';
import { getCoverImageUrl } from '@/utils/controller/productController';
import styles from './ProductGallery.module.css'
const ProductsGallery = ({ products }) => {
  // const products = null
/*

*/
  return (
    <div className={` h-full relative px-4 lg:px-12 py-32`}>
      <div className={` ${styles.bgRipple} absolute inset-0 z-2`}></div>
      <Link href={`/collections`}>
        <p className="text-center uppercase my-4 tracking-widest ">
          Our Newest collections
        </p>
      </Link>
      <div className="flex h-64 lg:h-72 gap-6 py-6 overflow-x-scroll  ">
        {products
          ? products.map((product, index) => (
              <div
                className="aspect-[2/2]  border relative   rounded-lg bg-slate-400 "
                key={index}
              >
                <Link href={`/product/${slugify(product.attributes.name)}`}>
                  <div className=" bg-rose-400 rounded-lg ">
                    <Image
                      src={getCoverImageUrl(product)}
                      fill
                      className="rounded-lg "
                      alt={product.attributes.name}
                    />
                    <div className="absolute rounded-b-lg overflow-hidden  bottom-0 px-4  bg-gray-700 text-white ">
                      <p className="line-clamp-1">{product.attributes.name} </p>
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
  );
};

export default ProductsGallery;
