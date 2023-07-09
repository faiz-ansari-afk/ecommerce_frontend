import Link from 'next/link';
import { Bullet } from '@/components/Icon';
import { useEffect, useState } from 'react';
import OrdersList from './OrdersList';

const MyOrders = ({ user, order_data, setDetailsOfPopup, setOpenPopUp, openDemo,setOpenDemo }) => {
  const [myOrders, setMyOrders] = useState(order_data);

  return (
    <div>
      <div className="overflow-x-auto mb-32">
        {order_data && order_data.length > 0 ? (
          <OrdersList
            orders={order_data}
            setDetailsOfPopup={setDetailsOfPopup}
            setOpenPopUp={setOpenPopUp}
            openDemo={openDemo} 
          setOpenDemo={setOpenDemo}
          />
        ) : (
          <div className=" mt-12 mb-32 md:mx-8 lg:mx-20">
            <h3 className="mb-4  text-4xl font-light tracking-wide text-gray-800 lg:text-6xl "></h3>
            <h4 className="text-xl tracking-wide text-gray-600">
              You have no orders yet. <br />
              Take a look at our collection page!
            </h4>
            <Link href="/collections">
              <div className="mt-12">
                <div className="button-transition flex w-max items-center justify-start text-xl ">
                  <span className="h-4 w-4">
                    <Bullet />
                  </span>
                  Go to collection
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
