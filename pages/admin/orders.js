//server side imports
import { getUser } from '@/utils/controller/auth';
import { getAllOrdersOfAllUsers } from '@/utils/controller/orderController';
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '@/components/Admin/Layout';
import OrdersTable from '@/components/Admin/Orders/OrdersTable';
import { useEffect, useState } from 'react';

const orders = ({ orders, pagination }) => {
  // const [open, setOpen] = useState(false);
  // useEffect(() => {
  //   if (open) {
  //     document.body.classList.add('overflow-hidden');
  //   } else {
  //     document.body.classList.remove('overflow-hidden');
  //   }
  // }, [open]);
  return (
    <Layout>
      <OrdersTable
        orders={orders}
        pagination={pagination}
        // open={open}
        // setOpen={setOpen}
      />
    </Layout>
  );
};

export default orders;

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
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const orders = await getAllOrdersOfAllUsers({ pageSize: 15, pageNumber: 1 });

  return {
    props: {
      orders: orders.data,
      pagination: orders.meta,
    },
  };
}
