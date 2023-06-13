import { getAuthJWT } from '@/utils/controller/sessionController';
import axios from 'axios';
import { getUser } from '@/utils/controller/auth';

export async function createOrder({ data, ctx }) {
  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  const url = `${strapiUrl}/api/orders`;
  const jwt = getAuthJWT(ctx);

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    //creating order
    const response = await axios(config);
    return response.data.data;
  } catch (error) {
    return error;
  }
}

export async function getAllOrder(ctx) {
  const user = await getUser(null, ctx);

  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;

  //fetching only that orders that belong to logged in user
  const url = `${strapiUrl}/api/orders?populate=*&sort[0]=createdAt%3Adesc&filters[$and][1][users_permissions_user][email][$in]=${user.email}`;
  const jwt = getAuthJWT(ctx);

  const config = {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(config);
    return response.data.data;
  } catch (error) {
    ////////console.log('Get All Order  error', error);
    return error;
  }
}
export async function getAllOrdersOfAllUsers({
  pageSize = 15,
  pageNumber = 1,
  status = '',
}) {
  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;

  //fetching only that orders that belong to logged in user
  // const url = `${strapiUrl}/api/orders?populate=*&sort[0]=createdAt%3Adesc`;

  let url = `${strapiUrl}/api/orders?populate=*&sort[0]=createdAt%3Adesc&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`;
  if (status) {
    url = `${strapiUrl}/api/orders?populate=*&sort[0]=createdAt%3Adesc&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&filters[$and][0][status][$eq]=${status}`;
  }
  const jwt = getAuthJWT();

  const config = {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    ////////console.log('Get All Order  error', error);
    return error;
  }
}

export async function updateOrderStatus({ dataToUpdate, orderID }) {
  const jwt = getAuthJWT();

  const orderData = JSON.stringify({
    data: {
      ...dataToUpdate
    },
  });

  try {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_WEBSITE}/api/orders/${orderID}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: orderData,
    };

    const result = await axios(config);

    return result.data.data;
  } catch (error) {
    //////console.log('Get Cart Error', error);
  }
}
