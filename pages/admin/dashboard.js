//server side imports
import { getAllUsers, getUser } from '@/utils/controller/auth';
import { getAllOrdersOfAllUsers } from '@/utils/controller/orderController';
import { getRequest } from '@/utils/controller/requestController';
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '@/components/Admin/Layout';
import OrdersSummary from '@/components/Admin/OrdersSummary';
import RequestSummary from '@/components/Admin/RequestSummary';
import Link from 'next/link';

const dashboard = ({ requests, orders, users }) => {
  return (
    <Layout>
      <OrdersSummary orders={orders} />
      <RequestSummary requests={requests} />
      <Link href="/admin/users">
        <p className="text-3xl mb-4 mt-12 cursor-pointer">Users summary</p>
      </Link>
      <div className="max-w-sm flex-shrink-0 ">
        <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-100 opacity-50 -z-[999] rounded-lg`}
          ></div>
          <h1 className="text-2xl text-black mb-1 md:mb-4 text-center">
            Total Customers
          </h1>
          <p className="text-black mb-6 text-6xl text-center">{users.length}</p>
        </div>
      </div>
      <p className="pb-32"></p>
    </Layout>
  );
};

export default dashboard;

export async function getServerSideProps(ctx) {
  let userIsAuthenticated = false;
  const jwt = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwt);
  ////////console.log("user data jwt",jwt, userInfo)
  if (userInfo) {
    const user = await getUser(null, ctx);
    if (user) {
      userIsAuthenticated = user.local_role !== 'customer';
    } else {
      destroyCookie(ctx, 'jwt', {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
      userIsAuthenticated = false;
    }
  }

  if (!userIsAuthenticated) {
    // destroyCookie(ctx, 'jwt', {
    //   path: '/', // THE KEY IS TO SET THE SAME PATH
    // });
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  // const orders = await getAllOrdersOfAllUsers();
  // const requests = await getRequest({ filterBy: { all: true } });
  // const users = await getAllUsers(ctx);
  const [orders, requests, users] = await Promise.all([
    getAllOrdersOfAllUsers({pageSize : 300, pageNumber : 1}),
    getRequest({ filterBy: { all: true } }),
    getAllUsers(ctx),
  ]);
  return {
    props: {
      orders:orders.data,
      users,
      requests,
    },
  };
}
