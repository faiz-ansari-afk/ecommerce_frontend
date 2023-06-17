//server side imports
import { getUser } from '@/utils/controller/auth';
import { getAllOrdersOfAllUsers } from '@/utils/controller/orderController';
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '@/components/Admin/Layout';
import OrdersTable from '@/components/Admin/Orders/OrdersTable';
import DeliveryBoyOrderTable from '@/components/Admin/Orders/DeliveryBoyOrderTable';
import { useEffect, useState } from 'react';

const orders = ({ orders, pagination, user }) => {
  console.log("orders",orders)
  return (
    <Layout user={user}>
      {user.local_role === 'admin' && <OrdersTable orders={orders} pagination={pagination} />}
      {user.local_role === 'delivery' && <DeliveryBoyOrderTable orders={orders} pagination={pagination} user={user} />}
    </Layout>
  );
};

export default orders;

export async function getServerSideProps(ctx) {
  let userIsAuthenticated = false;
  const jwt = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwt);
  ////////console.log("user data jwt",jwt, userInfo)
  let user = null;
  if (userInfo) {
    user = await getUser(null, ctx);
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
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  let orders = [];
  if(user.local_role === 'admin')
  orders = await getAllOrdersOfAllUsers({ pageSize: 15, pageNumber: 1});
  else 
  orders = await getAllOrdersOfAllUsers({email:user.email, pageSize: 15, pageNumber: 1 });
  return {
    props: {
      orders: orders.data,
      pagination: orders.meta,
      user
    },
  };
}
