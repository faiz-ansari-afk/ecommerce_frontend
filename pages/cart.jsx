import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '@/store/globalstate';
import Select from 'react-select';
import slugify from 'slugify';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { decodeJWT } from '@/utils/controller/sessionController';
import {
  getCount,
  getPrice,
  getTotalPrice,
  updateCart,
  deleteCartItem,
  getMyCart,
} from '@/utils/controller/cartController';

import BrowseCollection from '@/components/BrowseCollection';
import CartSkeleton from '@/components/CartSkeleton';
import ToastMessage from '@/components/Toast';

export async function getServerSideProps(ctx) {
  const cartData = await getMyCart(ctx);

  return { props: { cart: cartData } };
}

const Cart = ({ cart }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { dispatch, state } = useContext(DataContext);
  const [cartDetails, setCartDetails] = useState(null);
  const [myCart, setMyCart] = useState(cart);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    getMyCart(null)
    .then((cartData) => {
      setMyCart(cartData);
      setTotalAmount(getTotalPrice(cartData));
      setCartDetails(cartData?.attributes?.cart_data?.products);
      setCount(cartData ? cartData.attributes.cart_data.products.length : 0)
      
      setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      });
  }, [state.cartReload]);
  const [updating, setUpdating] = useState(false);
  // const count = state.cartItemCount;
  const [count, setCount] = useState(state.cartItemCount);
  
  const [totalAmount, setTotalAmount] = useState(getTotalPrice(myCart));

  const router = useRouter();

  const quantityList = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
  ];

  async function updateCartHandler({ product, quantity }) {
    try {
      setUpdating(true);
      const updatedCart = await updateCart({
        variantOfProduct: product,
        quantity,
      });
      ////console.log('updated cart', updatedCart);
      setCartDetails(updatedCart?.attributes?.cart_data?.products);

      setTotalAmount(getTotalPrice(updatedCart));
      const _count = getCount(updatedCart);
      dispatch({ type: 'SET_CART_ITEMS_COUNT', payload: _count });

      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      //console.log('cart update error', error);
    }
  }
  async function handleCartItemDelete(variantOfProduct) {
    try {
      const updatedCart = await deleteCartItem(variantOfProduct);

      setCartDetails(updatedCart?.attributes?.cart_data?.products);
      const _count = getCount(updatedCart);
      dispatch({ type: 'SET_CART_ITEMS_COUNT', payload: _count });
      setTotalAmount(getTotalPrice(updatedCart));
      ToastMessage({ type: 'success', message: 'Product Removed' });
    } catch (error) {
      //console.log('cart item delete error', error);
    }
  }
  async function handleCheckout() {
    if (!userLoggedIn) {
      dispatch({ type: 'TRUE_OPEN_LOGIN' });
    } else {
      dispatch({ type: 'FALSE_OPEN_LOGIN' });
      router.push('/checkout');
    }
  }

  //user useEfect
  useEffect(() => {
    const cookies = parseCookies();
    const user = decodeJWT(cookies.jwt);
    if (user) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  });
  

  // if (count === 0) {
  if (!cartDetails && !loading) {
    return (
      <>
        <Head>
          <title>Cart</title>
        </Head>
        <section className="py-20 px-5 lg:py-32 lg:px-10 animate__animated animate__fadeIn animate__fast">
          <div className="flex flex-col items-center  pt-32">
            <div>
              <h3 className="pb-32 text-center text-3xl font-extralight text-gray-600 md:text-5xl">
                Your shopping bag is empty!
              </h3>
            </div>
          </div>
          <div className="mt-16">
            <BrowseCollection />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <section className="py-20 px-5 lg:py-32 lg:px-10 animate__animated animate__fadeIn animate__fast">
        {/* {count === 0 ? (
          <div className="flex flex-col items-center  pt-32">
            <div>
              <h3 className="pb-32 text-3xl font-extralight text-gray-600 md:text-5xl">
                Your shopping bag is empty!
              </h3>
            </div>
          </div>
        ) :  */}
        {loading ? (
          <CartSkeleton />
        ) : (
          cartDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10">
              <div className="col-span-2 ">
                <div className="py-4 md:py-9">
                  <h2 className="border-b pb-4 text-2xl font-light md:pb-8 md:text-3xl">
                    Shopping bag
                  </h2>
                </div>
                <div className="">
                  <ul>
                    {cartDetails?.map((product, index) => {
                      return (
                        <li key={index}>
                          <div className="border-b py-5 md:py-8">
                            <div className="relative grid grid-cols-5 gap-3 md:gap-1">
                              <div className="relative col-span-1 h-20 w-full md:h-28 lg:h-28">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="h-full w-full object-contain"
                                />
                              </div>

                              <div className="col-span-4">
                                <Link
                                  href={`/product/${slugify(product.name)}`}
                                >
                                  <h2
                                    title={product.name}
                                    className="text-sm tracking-widest hover:cursor-pointer hover:underline md:text-xl line-clamp-1"
                                  >
                                    {product.name}
                                  </h2>
                                </Link>
                                <div className="flex gap-10">
                                  {product.color && (
                                    <div className="">
                                      Color: {product.color}
                                    </div>
                                  )}
                                  {product.size_and_price && (
                                    <div className="">
                                      Size:{' '}
                                      {product.size_and_price.sizes.replace(
                                        'i',
                                        ''
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <div className="w-18 relative mt-2 max-w-[5rem] md:w-20">
                                    <Select
                                      instanceId={toString(index)}
                                      onChange={(option) =>
                                        updateCartHandler({
                                          product,
                                          quantity: parseInt(option.value),
                                        })
                                      }
                                      options={quantityList}
                                      defaultValue={
                                        quantityList[
                                          parseInt(product.quantity) - 1
                                        ]
                                      }
                                    />
                                  </div>

                                  <div className="items-center gap-4 md:flex">
                                    <div
                                      className="ml-4 font-light tracking-wide shadow-sm hover:cursor-pointer hover:underline hover:shadow-lg"
                                      onClick={() =>
                                        handleCartItemDelete(product)
                                      }
                                    >
                                      Delete
                                    </div>
                                  </div>
                                </div>
                                <div className="pr-4 text-right text-sm font-bold">
                                  <span></span>
                                </div>
                                <div className="pr-4 text-right text-sm font-bold">
                                  <span>₹</span>
                                  {getPrice(product).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* _______________ CHECKOUT SECTION _____________________ */}
              <div className="col-span-1 ">
                <div className="p-4 md:p-9">
                  <h2 className="hidden border-b pb-8 font-light md:block md:text-3xl">
                    Order summary
                  </h2>
                </div>
                <div className=" md:px-9 ">
                  <div className="flex justify-between pb-3">
                    <h6 className="font-light uppercase tracking-widest">
                      SUBTOTAL
                    </h6>
                    <h6>
                      <span>₹</span> {totalAmount.toFixed(2)}
                    </h6>
                  </div>

                  <div className="flex justify-between pb-3">
                    <h6 className="font-light uppercase tracking-widest">
                      shipping
                    </h6>
                    <h6 className="text-sm font-light text-gray-600">
                      ₹ 00.00
                    </h6>
                  </div>

                  <div className="flex justify-between border-b pb-5">
                    <h6 className="font-light uppercase tracking-widest">
                      Tax{' '}
                      <span className="text-sm lowercase text-gray-600">
                        (included)
                      </span>
                    </h6>
                    <h6 className="text-sm font-light text-gray-600">
                      <span></span>00.00{' '}
                    </h6>
                  </div>

                  <div className="flex justify-between  py-4">
                    <h6 className="font-bold uppercase tracking-widest">
                      Total
                    </h6>
                    <h6 className="font-bold ">
                      <span>₹</span> {totalAmount.toFixed(2)}
                    </h6>
                  </div>

                  <div className="py-4">
                    <button
                      className="w-full rounded-full bg-black py-2 text-white hover:shadow-lg"
                      onClick={handleCheckout}
                    >
                      Book Order
                    </button>
                  </div>

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
                </div>
              </div>
            </div>
          )
        )}

        <div className="mt-32">
          <BrowseCollection />
        </div>
      </section>
    </>
  );
};

export default Cart;
