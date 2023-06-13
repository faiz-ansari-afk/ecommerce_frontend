import Link from 'next/link';
import React from 'react';

const OrdersSummary = ({ orders }) => {
  let activeOrderCount = 0;
  let completedOrderCount = 0;
  let cancelledOrderCount = 0;
  orders.forEach((order) => {
    if (order.attributes.status === 'completed') {
      completedOrderCount++;
    }
    if (order.attributes.status === 'ordered') activeOrderCount++;
    if (order.attributes.status === 'cancelled') cancelledOrderCount++;
  });
  
  return (
    <div>
            <Link href="/admin/orders">
      <p className="text-3xl cursor-pointer my-4">Orders summary</p>
            </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="max-w-sm flex-shrink-0 ">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-3xl text-black mb-1 md:mb-4 text-center">Active Orders</h1>
            <p className="text-black mb-6 text-6xl text-center">{activeOrderCount}</p>
          </div>
        </div>

        <div className="max-w-sm flex-shrink-0">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-lime-500 to-lime-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-3xl text-black mb-1 md:mb-4 text-center">
              Completed Orders
            </h1>
            <p className="text-black mb-6 text-6xl text-center">{completedOrderCount}</p>
          </div>
        </div>

        <div className="max-w-sm flex-shrink-0">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-3xl text-black mb-1 md:mb-4 text-center">
              Cancelled Orders
            </h1>
            <p className="text-black mb-6 text-6xl text-center">{cancelledOrderCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function GlassDiv({ title, count, link, linkname = 'Click Me', color }) {
  const fromColor = `from-${color}-500`;
  const toColor = `to-${color}-100`;
  return (
    <div className="max-w-sm">
      <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${fromColor} ${toColor} opacity-50 -z-[999] rounded-lg`}
        ></div>
        <h1 className="text-3xl text-black mb-1 md:mb-4">{title}</h1>
        <p className="text-black mb-6 text-6xl text-center">{count}</p>
        <Link href={link}>
          <button className="rounded-full bg-black hover:shadow-lg text-white  py-2 px-4 ">
            {linkname}
          </button>
        </Link>
      </div>
    </div>
  );
}
export default OrdersSummary;
