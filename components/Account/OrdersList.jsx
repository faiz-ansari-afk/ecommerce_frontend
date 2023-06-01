import React from 'react';
import Image from 'next/image';
import { Bullet } from '@/components/Icon';

const OrdersList = ({ orders, setDetailsOfPopup, setOpenPopUp }) => {
  const _orders = orders
    .sort(
      (a, b) =>
        new Date(b.attributes.publishedAt) - new Date(a.attributes.publishedAt)
    )
    //console.log(_orders)
  return (
    <div className="my-12 ">
      <h3 className="border-b pb-9 text-4xl font-[order_data] text-gray-800">
        Latest orders
      </h3>
      <ul className="">
        {_orders.map((order) => {
          const cart = order.attributes.cart.data.attributes;
          const cart_products =
            order.attributes.cart.data.attributes.cart_data.products;
          const orderCreatedAt = new Date(order.attributes.publishedAt);

          return (
            <li key={order.id} className="border-b  py-7">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex flex-grow gap-2 md:gap-12">
                  <div className="h-26 w-26 relative col-span-2 h-20 w-20 flex-none justify-start  border bg-gray-100 text-left md:w-24 lg:h-24 ">
                    <Image
                      src={cart_products[0].image}
                      alt={cart_products[0].name}
                      fill
                      className="h-full w-full border"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl text-gray-900">
                      Order No. {order.id}{' '}
                      <span className="pl-3 text-sm font-light italic text-gray-400">
                        {order.attributes.status}
                      </span>
                    </p>
                    <p className="">
                      {orderCreatedAt.toLocaleDateString('en-IN', {
                        dateStyle: 'full',
                      })}
                    </p>
                    <div className="flex gap-3">
                      <p className="">₹ {order.attributes.final_price}</p>
                      {order.attributes.payment === 'paid' ? (
                        <span className="text-green-600 italic uppercase">
                          paid
                        </span>
                      ) : (
                        <span className="text-rose-600 italic uppercase">
                          unpaid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                <div
                  className="button-transition mt-2 flex h-fit w-fit justify-start  text-xl md:mt-0 md:items-center "
                  onClick={() => {
                    setDetailsOfPopup(order);
                    setOpenPopUp(true);
                  }}
                >
                  <span className="h-4 w-4">
                    <Bullet />
                  </span>
                  See details
                </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrdersList;
