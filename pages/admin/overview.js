// server side imports
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies, destroyCookie } from 'nookies';

// client side imports
import AdminProfileCard from '@/components/Admin/AdminProfileCard';
import Layout from '@/components/Admin/Layout';

import { getUser } from '@/utils/controller/auth';
import { getAllOrdersOfAllUsers } from '@/utils/controller/orderController';
import { getRequest } from '@/utils/controller/requestController';
import { useState } from 'react';

const overview = ({ user }) => {
  return (
    <Layout user={user}>
      <AdminProfileCard user={user} />
      
      <p className="pb-32"></p>
    </Layout>
  );
};

export default overview;

export async function getServerSideProps(ctx) {
  let userIsAuthenticated = false;
  const jwt = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwt);
  ////////console.log("user data jwt",jwt, userInfo)
  if (userInfo) {
    const user = await getUser(null, ctx);
    if (user) {
      console.log("user",user)
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
  const user = await getUser(null, ctx);
  return {
    props: {
      user
    },
  };
}
