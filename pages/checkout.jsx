import React from 'react';
import { getMyCart } from '@/utils/controller/cartController';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '@/store/globalstate';

import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import ProtectedPageRoute from '@/utils/protect-route';

import AddressForm from '@/components/Checkout/AddressForm';
import CheckoutSummary from '@/components/Checkout/CheckoutSummary';
import ShippingDetails from '@/components/Checkout/ShippingDetails';
import PaymentMethod from '@/components/Checkout/PaymentMethod';

const checkout = ({ data: cart, user: _user }) => {
  const router = useRouter();
  const [user, setUser] = useState(_user);
  const { dispatch, state } = useContext(DataContext);
  //for shipping details component
  // const [toggleShippingDetails,setToggleShippingDetails] =useState(false)
  const [userAddressData, setUserAddressData] = useState(user?.user_data);
  // ////console.log("user.user_data",userAddressData)
  useEffect(() => {
    if (user.user_data) {
      setUserAddressData(user.user_data);
    }
  }, []);

  const cookie = parseCookies('cart_uid');
  const [cartUID, setCartUID] = useState();
  const cart_uid = cookie.cart_uid;

  function handleLogout(slug) {
    destroyCookie({}, 'jwt', {
      path: '/', // THE KEY IS TO SET THE SAME PATH
    });
    destroyCookie({}, 'cart_uid', {
      path: '/', // THE KEY IS TO SET THE SAME PATH
    });
    dispatch({ type: 'FALSE_GLOBAL_USER_lOGIN' });
    dispatch({ type: 'RELOAD_CART' });
    router.push('/cart');
  }
  const checkAddressAvailability = () => {
    if (user.user_data) {
      return true;
    }
    return false;
  };
  const [isAddressFilled, setIsAddressFilled] = useState(
    checkAddressAvailability()
  );
  const [continueToPayment, setContinueToPayment] = useState(false);

  useEffect(() => {
    if (!cart_uid && !user.current_cart) {
      router.push('/');
    }
  }, [cart_uid]);
  return (
    <section className="mb-20 py-20 px-5 lg:py-32 lg:px-10">
      <div className="grid gap-6 md:gap-16 md:mx-10 md:grid-cols-3">
        <div className="md:col-span-2 ">
          <details>
          <summary>Login details</summary>
          <div className="contact info mb-12 bg-gray-100 p-3 rounded-lg">
            <h3 className="font-[SangbleuSans] text-xl text-gray-800">
              Contact Info
            </h3>

            <h4 className="mt-4 font-[SangbleuSans] text-xl text-gray-500">
              Email
            </h4>
            <p className="my-3">{user.email}</p>
            <button
              className="text-xl underline underline-offset-2"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
          </details>
          {isAddressFilled ? (
            <div>
              <ShippingDetails
                // refresh={toggleShippingDetails}
                userAddressData={userAddressData}
                setIsAddressFilled={setIsAddressFilled}
                setContinueToPayment={setContinueToPayment}
              />
              <PaymentMethod
                cart={cart}
                user={user}
                userAddressData={userAddressData}
              />
            </div>
          ) : (
            <AddressForm
              // setToggleShippingDetails={setToggleShippingDetails}
              user={user}
              setUser={setUser}
              setUserAddressData={setUserAddressData}
              setIsAddressFilled={setIsAddressFilled}
              setContinueToPayment={setContinueToPayment}
              continueToPayment={continueToPayment}
            />
          )}
        </div>

        {/* This div will come first in mobile version */}

        <div className="order-first md:order-last">
          <div className=' md:hidden'>
            <details className="">
              <summary>Products to order</summary>
              <CheckoutSummary cart={cart} />
            </details>
          </div>
          <div className='hidden md:block'>
              <CheckoutSummary cart={cart} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default checkout;

export const getServerSideProps = async (context) =>
  ProtectedPageRoute(context, null, async () => {
    const myCart = await getMyCart(context);
    return myCart;
  });
