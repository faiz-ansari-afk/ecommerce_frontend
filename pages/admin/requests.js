//server side imports
import { getUser } from '@/utils/controller/auth';
import { decodeJWT } from '@/utils/controller/sessionController';
import { getRequest } from '@/utils/controller/requestController';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '@/components/Admin/Layout';
import { useState } from 'react';
import RequestsTable from '@/components/Admin/Request/RequestTable';

const requests = ({requests,pagination,user}) => {
  console.log("requests",requests)
  return <Layout user={user}>
    <RequestsTable  requests={requests}
        pagination={pagination} user={user} />
  </Layout>;
};

export default requests;

export async function getServerSideProps(ctx) {
  let userIsAuthenticated = false;
  const jwt = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwt);
  ////////console.log("user data jwt",jwt, userInfo)
  let user=null;
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
  const requests = await getRequest({ filterBy: { all: true, pagination:true,pageNumber:1,pageSize:15 } });

  return {
    props: {
      requests: requests.data,
      pagination: requests.meta,
      user
    },
  };
}
