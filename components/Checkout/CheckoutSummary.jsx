import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import slugify from 'slugify';
import { getTotalPrice, getPrice } from '@/utils/controller/cartController';

const CheckoutSummary = ({ cart, adminFlag = false }) => {
  const [totalAmount, setTotalAmount] = React.useState(getTotalPrice(cart));
  const [products, setProducts] = React.useState(
    cart?.attributes?.cart_data?.products
  );

  return (
    <div>
      {!adminFlag && (
        <div className="flex justify-between border-b pb-12">
          <h3 className="text-light font-[SangbleuSans] text-3xl ">
            Order summary
          </h3>
          <Link href="/cart">
            <button className="underline underline-offset-4">Edit bag</button>
          </Link>
        </div>
      )}

      <ul className="product list mt-2">
        {products &&
          products.map((product, index) => (
            <li key={index} className="">
              <div className="mt-3 flex gap-2 border-b pb-3">
                <div className="md:w-26  lg:h-26  relative col-span-2 h-20 w-20  flex-none justify-start border bg-rose-100 text-left ">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="h-full w-full border"
                  />
                </div>

                <div className="grow">
                  <Link href={`/product/${slugify(product.name)}`}>
                    <p className="text-xl text-gray-900 line-clamp-1">
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Quantity: {product.quantity}
                  </p>
                  <div className="flex">
                    <p className="text-sm ">
                      <span className="text-sm text-gray-500">Color:</span>
                      <span className="text-black ml-1">{product.color}</span>
                    </p>
                  </div>
                  {product.size_and_price && (
                    <p>
                      <span className="text-sm text-gray-500">Size:</span>
                      <span className="text-black ml-1">
                        {product.size_and_price.sizes.replace('i', '')}
                      </span>
                    </p>
                  )}
                  <p className="text-right">₹ {getPrice(product).toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
      </ul>

      <div className="mt-4 ">
        {!adminFlag && (
          <>
            <div className="flex justify-between pb-3">
              <h6 className="text-sm font-light uppercase tracking-widest">
                SUBTOTAL
              </h6>
              <h6>
                <span>₹</span> {totalAmount.toFixed(2)}
              </h6>
            </div>

            <div className="flex justify-between pb-3">
              <h6 className="text-sm font-light uppercase tracking-widest">
                shipping
              </h6>
              <h6 className="text-sm font-light text-gray-600">
                <span>₹</span> 00.00
              </h6>
            </div>

            <div className="flex justify-between border-b pb-5">
              <h6 className="text-sm font-light uppercase tracking-widest">
                Tax
                <span className="text-xm lowercase text-gray-600">
                  (included)
                </span>
              </h6>
              <h6 className="text-sm font-light text-gray-600">
                <span>₹</span> 00.00
              </h6>
            </div>
          </>
        )}

        <div className="flex justify-between  py-4">
          <h6 className="font-bold uppercase tracking-widest">Total</h6>
          <h6 className="font-bold ">
            <span>₹</span> {totalAmount.toFixed(2)}
          </h6>
        </div>

        {!adminFlag && (
          <div className="py-4">
            <details className="w-full rounded-lg bg-gray-100">
              <summary className="px-4 py-3">Add a coupon code</summary>
              <div className="flex  gap-2 px-4">
                <div className="relative z-0 my-4 w-full  pb-2">
                  <input
                    id="codeHere"
                    type="text"
                    placeholder="Enter code"
                    className="mt-0 block w-full appearance-none  rounded-md border border-black px-3 pt-3 pb-2  focus:outline-none focus:ring-0"
                  />
                </div>
                <button className="hover:underline">Apply</button>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
