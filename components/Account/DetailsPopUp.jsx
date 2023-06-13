import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getPrice, getTotalPrice } from '@/utils/controller/cartController';
import slugify from 'slugify';
import { updateOrderStatus } from '@/utils/controller/orderController';
import {  Warning } from '@/components/Icon';

const DetailsPopUp = ({ data, setOpenPopUp }) => {
  ////console.log('popup data', data);
  const router = useRouter();
  const orderCreatedAt = new Date(data.attributes.publishedAt);
  const products = data.attributes.cart.data.attributes.cart_data.products;
  const cart = data.attributes.cart.data;

  const deliveryDate = data.attributes.expected_delivery_date
    ? new Date(data.attributes.expected_delivery_date)
    : null;
  const options = { day: 'numeric', month: 'short', year: '2-digit' };
  const deliveryGuy = data.attributes.delivery_guy_details.data;
  // console.log('deliveryGuy', deliveryGuy);
  return (
    <div
      className={`fixed left-0 right-0 top-[20px] z-[1111]  h-[95%]  mx-2 md:mx-32 lg:mx-64  overflow-y-scroll rounded-lg border bg-white  px-2 pb-12 shadow-lg  md:px-8
      `}
    >
      <div className="relative"></div>
      <div className="flex items-center py-8">
        <h2 className="flex-grow font-[SangBleuSans]  text-4xl tracking-wider text-gray-900 md:text-5xl">
          Order No. {data.id}
        </h2>
        <button
          className="border border-black px-2 rounded-lg hover:shadow-lg lg:text-xl hover:scale-[1.1] mr-2 md:text-4xl"
          onClick={() => setOpenPopUp(false)}
        >
          X
        </button>
      </div>
      <div className="">
        <h3 className="text-md mb-3 font-[GillSans] text-[#929292]">
          ORDER SUMMARY
        </h3>
        <ul className="">
          <li className="text-gray-600 ">
            Order date:&nbsp;{' '}
            <span className="text-lg text-black">
              {orderCreatedAt.toLocaleDateString('en-IN', {
                dateStyle: 'full',
              })}
            </span>
          </li>
          <li className="text-gray-600 ">
            Order status:&nbsp;{' '}
            <span className="text-lg text-black">{data.attributes.status}</span>
          </li>
          {deliveryDate && (
            <li className="text-lime-600 ">
              Delivery Date:&nbsp;{' '}
              <span className="text-lg text-black">
                {deliveryDate.toLocaleDateString('en-US', options)}
              </span>
            </li>
          )}
          {deliveryGuy && data.attributes.status === 'out for delivery' && (
            <li className="text-gray-600 ">
              Delivered By:&nbsp;{' '}
              <span className="text-lg text-black">
                {deliveryGuy.attributes.username} {' '}
                {deliveryGuy.attributes.contact &&
                  <a href={`tel:${deliveryGuy.attributes.contact}`}>({deliveryGuy.attributes.contact})</a>}
                
              </span>
            </li>
          )}
        </ul>
        {data.attributes.customMessage && <div className="text-sm items-center gap-3 bg-gray-100 flex px-4 py-1 rounded-lg  my-2"><p className=""><Warning /></p><p className="">{data.attributes.customMessage}</p></div>}
      </div>

      <div className="my-12">
        <h3 className="text-md mb-3 font-[GillSans] text-[#929292]">
          PAYMENT SUMMARY
        </h3>
        <ul className="">
          <li className="text-gray-600 ">
            Payment status:&nbsp;{' '}
            {data.attributes.payment === 'paid' ? (
              <span className="uppercase italic text-green-600">paid</span>
            ) : (
              <span className="uppercase italic text-rose-600">unpaid</span>
            )}
          </li>
          <li className="text-gray-600 ">
                Payment Mode:&nbsp;{' '}
                <span className="text-lg text-black">
                  {data.attributes.payment_mode}
                </span>
              </li>
          {data.attributes.status === 'completed' && (
            <>
              {<li className="text-gray-600 ">
                Payment Style:&nbsp;{' '}
                <span className="text-lg text-black">
                  {data.attributes.payment_details}
                </span>
              </li>}
              
            </>
          )}
        </ul>
      </div>

      <div className="my-12">
        <h3 className="text-md mb-1 uppercase font-[GillSans] text-[#929292]">
          Address Details
        </h3>
        <ul className="">
          <li className="text-gray-600 ">
            <span className="text-lg text-black">
              {data.attributes.address.details.name}
            </span>
          </li>
          <li className="text-gray-600 ">
            <span className="text-lg text-black font-sans">
              {data.attributes.address.details.phoneNumber}
            </span>
          </li>
          <li className="text-gray-800 ">
            {data.attributes.address.address.address}
          </li>
          <li className="text-gray-800 ">
            {data.attributes.address.address.pincode}&nbsp;&nbsp;
            {data.attributes.address.address.city}, IN
          </li>
        </ul>
      </div>

      <div className="products list text-md mb-3 font-[GillSans]  ">
        <div className="mb-3 flex border-b pb-3">
          <p className="flex-grow uppercase  text-[#929292]">PRODUCTS</p>
          <p className=" uppercase  text-[#929292]"></p>
        </div>
        <ul className="">
          {products.map((product, index) => (
            <li key={index} className="border-b pt-3 pb-3 last:mb-5 last:pb-5">
              <div className="flex gap-3 ">
                <Link href={`/product/${slugify(product.name)}`} className="">
                  <div className="relative flex-none  h-20 w-20  border bg-rose-100  md:h-24 md:w-24  ">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="h-full w-full border"
                    />
                  </div>
                </Link>
                <div className="flex  flex-col">
                  <div className="">
                    <Link
                      href={`/product/${slugify(product.name)}`}
                      className=""
                    >
                      <p className="md:text-xl line-clamp-1">
                        {product.quantity}x {product.name}
                      </p>
                    </Link>
                  </div>
                  <div className=" gap-1">
                    {product.color && (
                      <div className="">Color: {product.color}</div>
                    )}
                    {product.size_and_price && (
                      <div className="">
                        Size: {product.size_and_price.sizes.replace('i', '')}
                      </div>
                    )}
                  </div>
                  <div className="md:text-xl break-normal">
                    <span className="inline-block">
                      Rs: {getPrice(product).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mr-2 flex justify-end">
          <div className="">
            <table role="presentation">
              <tbody>
                <tr height="30px">
                  <td width="150px">Shipping</td>
                  <td>₹ {parseInt('00').toFixed(2)}</td>
                </tr>
                <tr height="50px" className="border-3 border-b border-black">
                  <td width="150px">TAXES (included)</td>
                  <td>₹ {parseInt('00').toFixed(2)}</td>
                </tr>
                <tr height="50px">
                  <td width="150px" className="font-bold">
                    TOTAL{' '}
                  </td>
                  <td className="font-bold">₹ {getTotalPrice(cart)}</td>
                </tr>
              </tbody>
            </table>
            <p></p>
          </div>
        </div>
        {data.attributes.status !== 'completed' &&
          data.attributes.status !== 'cancelled' && (
            <div className="">
              <button
                className="border border-rose-600 px-2 text-xl rounded-lg hover:shadow-lg hover:bg-rose-600 hover:text-white"
                onClick={async () => {
                  if (confirm('Do you want to cancel?')) {
                    // If the user clicks "OK", do something
                    const orderResponse = await updateOrderStatus({
                      dataToUpdate: {status: 'cancelled'},
                      orderID: data.id,
                    });
                    if (orderResponse.id) {
                      // const message = `Order cancelled successfully. Please fill the feedback form, order No: ${orderResponse.id}`;
                      // const sendSMS = await axios.post('/api/send-sms', {
                      //   phoneNumber: '988',
                      //   message,
                      // });
                      // //console.log("msg sent",sendSMS)
                    }
                    router.reload();
                  } else {
                    // If the user clicks "Cancel", do something else
                    //console.log('User clicked Cancel');
                  }
                }}
              >
                cancel order
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default DetailsPopUp;
