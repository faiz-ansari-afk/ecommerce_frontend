import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { DataContext } from '@/store/globalstate';

import {
  AccountInfo,
  MyOrders,
  DetailsPopUp,
  MyRequests,
  Overview,
} from '@/components/Account';
import { destroyCookie } from 'nookies';

import { Profile, TopComponent } from '@/components/Account/TopComponent';
import Head from 'next/head';
import ProtectedPageRoute from '@/utils/protect-route';
import { useEffect, useState } from 'react';
import { getAllOrder } from '@/utils/controller/orderController';
import { getRequest } from '@/utils/controller/requestController';
import { useMemo } from 'react';

const index = ({ user: _user, data }) => {
  const { dispatch, state } = useContext(DataContext);
  const [user, setUser] = useState(_user);
  
  const _requestedItems = useMemo(() => data.requestedItems);
  const [myRequestedItems, setMyRequestedItems] = useState(_requestedItems);

  const _orders = useMemo(() => data.orders);
  const [myOrders, setMyOrders] = useState(_orders);

  const router = useRouter();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [detailsOfPopup, setDetailsOfPopup] = useState(null);

  const buttonsName = [
    {
      name: 'Overview',
      slug: 'overview',

      component: (
        <Overview
          user={user}
          order_data={myOrders}
          setDetailsOfPopup={setDetailsOfPopup}
          setOpenPopUp={setOpenPopUp}
        />
      ),
      topComponent: <Profile user={user} order_data={myOrders} />,
    },
    {
      name: 'Account Info',
      slug: 'account-info',

      component: (
        <AccountInfo user={user} setUser={setUser} order_data={myOrders} />
      ),
      topComponent: 'Account Info',
    },
    {
      name: 'My orders',
      slug: 'my-orders',

      component: (
        <MyOrders
          user={user}
          order_data={myOrders}
          setDetailsOfPopup={setDetailsOfPopup}
          setOpenPopUp={setOpenPopUp}
        />
      ),
      topComponent: 'My Orders ',
    },
    {
      name: 'My requests',
      slug: 'my-requests',

      component: <MyRequests user={user} myRequestedItems={myRequestedItems} />,
      topComponent: 'My Requests',
    },
    { name: 'Logout', slug: 'logout', component: null, topComponent: 'Logout' },
  ];

  function handleLogout(slug) {
    if (slug === 'logout') {
      destroyCookie({}, 'jwt', {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
      destroyCookie({}, 'cart_uid', {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
      dispatch({ type: 'FALSE_GLOBAL_USER_lOGIN' });
      dispatch({ type: 'RELOAD_CART' });
      router.push('/');
    }
  }
  useEffect(() => {
    if (openPopUp) {
      document.body.style = 'overflow-y: hidden';
      return;
    }
    document.body.style = 'overflow-y: auto';
    // return( ()=> setOpenPopUp(false))
  }, [openPopUp]);
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      {openPopUp && (
        <DetailsPopUp data={detailsOfPopup} setOpenPopUp={setOpenPopUp} />
      )}

      <section className={`relative`}>
        {/* ${openPopUp ? 'bg-opacity-50 bg-rose-300':''} */}
        {openPopUp && (
          <div className="fixed inset-0 bg-gray-300 bg-opacity-50 h-screen w-screen"></div>
        )}

        <div className={`grid min-h-screen lg:h-screen w-full grid-cols-1 lg:grid-cols-6 `}>
          {/* profileContainer div */}
          {/* Top portion only visible in MObile and tablet device */}
          <div className="h-min  grid-cols-1 items-center justify-center border bg-[#e3d9c6] px-4  lg:h-full">
            <div className="font-[TiemposFine] lg:hidden">
              {buttonsName.map((btnName, index) => {
                if (router.asPath === `/account/${btnName.slug}`) {
                  if (btnName.slug === 'overview')
                    return (
                      <div key={`btnName.key`}>{btnName.topComponent}</div>
                    );
                  return (
                    <TopComponent key={index} text={btnName.topComponent} />
                  );
                }
              })}
            </div>

            <div className="flex  space-x-8  overflow-x-auto   p-2 pb-6 lg:h-screen   lg:flex-col lg:items-start lg:justify-center lg:space-x-0 lg:space-y-8 lg:absolute  ">
              {buttonsName.map((buttonName) => (
                <div
                  key={buttonName.slug}
                  className="hover:none flex flex-shrink-0 items-center justify-center"
                >
                  <Link href={`/account/${buttonName.slug}`}>
                    <span
                      className={`lg:text-md px-6 py-3 text-sm uppercase lg:capitalize ${
                        router.asPath === `/account/${buttonName.slug}`
                          ? 'active-button'
                          : null
                      } `}
                      onClick={() => handleLogout(buttonName.slug)}
                    >
                      {buttonName.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Data showing div */}
          <div className="h-full w-full  px-0 lg:col-start-2  lg:col-end-7 lg:grid-cols-5  overflow-y-auto relative ">
            <div className="hidden font-[TiemposFine] lg:block ">
              {buttonsName.map((btnName, index) => {
                if (router.asPath === `/account/${btnName.slug}`) {
                  if (btnName.slug === 'overview') return btnName.topComponent;
                  return (
                    <TopComponent key={index} text={btnName.topComponent} />
                  );
                }
              })}
            </div>

            {buttonsName.map((btnName, index) => {
              if (router.asPath === `/account/${btnName.slug}`) {
                return (
                  <div key={index} className="mx-3 md:mx-9">
                    {btnName.component}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default index;

export const getServerSideProps = async (context) =>
  ProtectedPageRoute(context, null, async (user_detail) => {
    const orders = await getAllOrder(context);
    const requestedItems = await getRequest({
      filterBy: {
        status: null,
        requested_by: user_detail.email,
      },
    });

    return { orders, requestedItems };
  });
