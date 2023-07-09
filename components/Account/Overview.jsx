import { Bullet } from '@/components/Icon';
import Link from 'next/link';
import OrdersList from './OrdersList';

const Overview = ({ user, order_data, setDetailsOfPopup, setOpenPopUp, openDemo,setOpenDemo }) => {
  // //console.log('order_data', order_data);
  // const order_data = _order_data.slice(0,3);
  return (
    <div>
      {/* {order_data && <OrdersList orders={order_data} setDetailsOfPopup={setDetailsOfPopup} setOpenPopUp={setOpenPopUp} />} */}
      <div
        className={`mb-32 grid grid-cols-1 font-[SangbleuSans] 
        
         `}
      >
        {order_data && order_data.length > 0 ? (
          <OrdersList
            orders={order_data.slice(0,3)}
            setDetailsOfPopup={setDetailsOfPopup}
            setOpenPopUp={setOpenPopUp}
            openDemo={openDemo} 
          setOpenDemo={setOpenDemo}
          />
        ) : (
          <div className=" mt-12">
            <h3 className="mb-4  text-4xl font-light tracking-wide text-gray-800 lg:text-6xl">
              Latest orders
            </h3>
            <h4 className="text-xl tracking-wide text-gray-600">
              You have no orders yet. <br />
              Take a look at our collection page!
            </h4>
            <Link href="/collections">
              <div className="mt-12">
                <div className="button-transition flex w-56 items-center justify-start text-xl ">
                  <span className="h-4 w-4">
                    <Bullet />
                  </span>
                  Go to collection
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* <div className=" mt-12">
          <h3 className="mb-4  text-4xl font-light tracking-wide text-gray-800 lg:text-6xl">
            Mood boards
          </h3>
          <h4 className="text-xl tracking-wide text-gray-600">
            You did not save any items yet.
          </h4>
          <div className="mt-12">
            <div className="button-transition flex w-72 items-center justify-start text-xl ">
              <span className="h-4 w-4">
                <Bullet />
              </span>
              Create a new mood board
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Overview;
