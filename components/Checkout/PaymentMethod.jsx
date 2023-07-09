import React from 'react';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { DataContext } from '@/store/globalstate';
import { getTotalPrice } from '@/utils/controller/cartController';
import { createOrder } from '@/utils/controller/orderController';
import { updateCartStatus } from '@/utils/controller/cartController';
import { updateUserData } from '@/utils/controller/auth';
import { destroyCookie } from 'nookies';
import axios from 'axios';
// import { makePayment } from '@/utils/controller/razorpayController';

const PaymentMethod = ({ cart, user, userAddressData }) => {
  const [method, setMethod] = useState('cod');
  const handleRadioChange = (event) => {
    setMethod(event.target.value);
  };
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);

  const [loading, setLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [promoChecked, setPromoChecked] = useState(false);
  const [termsError, setTermsError] = useState(null);

  async function handleCompleteOrder() {
    setLoading(true);
    if (!termsChecked) {
      setTermsError(
        'You must agree to the Terms & Conditions to place an order.'
      );
      setLoading(false);
      return;
    }
    const orderDataCOD = {
      data: {
        users_permissions_user: user.id,
        order_id: uuidv4(),
        status: 'ordered',
        cart: cart.id,
        final_price: getTotalPrice(cart),
        payment_mode: 'COD',
        payment: 'unpaid',
        address: userAddressData,
      },
    };
    if (method === 'cod') {
      setTermsError(null);
      dispatch({ type: 'FALSE_IS_PAYMENT_METHOD_SELECTED' });

      const orderResponse = await createOrder({ data: orderDataCOD });
      // ////console.log("orderResponse",orderResponse)
      if (orderResponse.id) {
        // const message = `We have recieved your order request, 
        //                   shortly we will process your orders. 
        //                   Thank you for purchasing.
        //                   order No: ${orderResponse.id}`;
        // const sendSMS = await axios.post('/api/send-sms', {
        //   phoneNumber:"988",
        //   message,
        // }); 
        ////console.log('Order processed');
        //change the cart status to  ordered
        const cartResponse = await updateCartStatus({
          cart_status: 'ordered',
          cartID: cart.id,
        });
        // ////console.log('updateCartStatus', cartResponse);

        //destroying it for safety side
        destroyCookie({}, 'cart_uid', {
          path: '/', // THE KEY IS TO SET THE SAME PATH
        });
        //remove cart relation from user, because cart is now purchased
        const removeCartFromUserData = {
          current_cart: null,
        };
        const updatedUserDetails = await updateUserData({
          id: user.id,
          ctx: null,
          data: removeCartFromUserData,
        });
        dispatch({ type: 'RELOAD_CART' });
        setTimeout(() => {
          setLoading(false);
          router.replace(
            `/ordered?phoneNumber=${userAddressData.details.phoneNumber}&orderID=${orderResponse.id}`
          );
        }, 700);
      } else {
        alert('something went wrong');
      }

      return;
    }
    alert('No pre payment is required, pay after delivery');
    // dispatch({ type: 'TRUE_IS_PAYMENT_METHOD_SELECTED' });
    setTermsError(null);
    // const paymentVerificationData = await makePayment({user,router,cart,dispatch});
    // ////console.log(paymentVerificationData)
    setLoading(false);
  }
  return (
    <div className="mt-12">
      <h3 className="font-[SangbleuSans] text-3xl mb-2 font-light">
        Payment method
      </h3>
      {/* <h4 className="my-2 text-sm">
        All transactions are secure and encrypted.
      </h4> */}
      <ul className="mb-12 space-y-3">
        {/* <li
          className={`max-w-[500px]  rounded-lg ${
            method === 'razorpay' ? 'bg-orange-100' : ''
          }`}
        >
          <div className="flex items-center rounded  pl-4 ">
            <input
              id="bordered-radio-2"
              type="radio"
              value="razorpay"
              name="bordered-radio"
              className="h-4 w-4 "
              checked={method === 'razorpay'}
              onChange={handleRadioChange}
            />
            <label
              htmlFor="bordered-radio-2"
              className="ml-2  w-full p-4 text-gray-900"
            >
              Razor Pay (UPI)
            </label>
          </div>
        </li> */}
        <li
          className={`max-w-[500px]  rounded-lg ${
            method === 'cod' ? 'bg-orange-100' : ''
          }`}
        >
          <div className="flex items-center rounded  pl-4 ">
            <input
              id="bordered-radio-2"
              type="radio"
              value="cod"
              name="bordered-radio"
              checked={method === 'cod'}
              className="h-4 w-4 "
              onChange={handleRadioChange}
            />
            <label
              htmlFor="bordered-radio-2"
              className="ml-2  w-full p-4 text-gray-900"
            >
              Cash on delivery
            </label>
          </div>
        </li>
      </ul>

      <div>
        <div className="mb-4 flex items-center">
          <input
            id="default-checkbox"
            type="checkbox"
            value="terms"
            className="h-4 w-4 rounded "
            onChange={() => setTermsChecked((ov) => !ov)}
          />
          <label
            htmlFor="default-checkbox"
            className="text-md ml-2 font-[GillSans] font-medium text-black"
          >
            I agree to the{' '}
            <Link href="#" className="underline underline-offset-4">
              Terms & Conditions.
            </Link>
            *
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="checked-checkbox"
            type="checkbox"
            value="promo"
            className="h-4 w-4 rounded"
            onChange={() => setPromoChecked((ov) => !ov)}
          />
          <label
            htmlFor="checked-checkbox"
            className="text-md ml-2 font-[GillSans] font-medium text-black"
          >
            Keep me up to date on news and exclusive offers
          </label>
        </div>
      </div>
      {termsError && (
        <div className="text-md mt-3 py-3 text-rose-500">{termsError}</div>
      )}
      <div className="text-center md:text-left">
        <button
          className="mt-12 w-fit rounded-full bg-black px-12  py-2 font-[GillSans] text-xl font-light text-white hover:shadow-lg md:px-24"
          onClick={handleCompleteOrder}
          disabled={loading}
        >
          {loading ? 'Processing order...' : 'Complete order'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
