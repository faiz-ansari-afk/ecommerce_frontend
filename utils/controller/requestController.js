import axios from 'axios';
import { getAuthJWT } from './sessionController';

export async function createRequest({ data, ctx, method = 'post' }) {
  //this function handles creation of request and fetching all requests

  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  let url = `${strapiUrl}/api/requests?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=completed&filters[$or][1][status][$eq]=approved&sort[0]=createdAt%3Adesc`;
  if (method === 'post') {
    url = `${strapiUrl}/api/requests`;
  }
  const jwt = getAuthJWT(ctx);

  let config = {
    method,
    maxBodyLength: Infinity,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    data,
  };
  if (method === 'get') {
    config = {
      method,
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    };
  }
  try {
    //creating order
    const response = await axios(config);
    return response.data.data;
  } catch (error) {
    //console.log(`request ${method} erorr`, error);
    return error;
  }
}

export async function getRequest({
  filterBy = {
    status: null,
    requested_by: null,
    all: false,
    pagination: false,
    pageNumber: 1,
    pageSize: 15,
  },
  ctx,
  method = 'get',
}) {
  //this function handles creation of request and fetching all requests
  /*
  filterBy:{
    status: '' || null
    requested_by:'email value only'
  }
  */
  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  let url = `${strapiUrl}/api/requests?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=completed&filters[$or][1][status][$eq]=approved&sort[0]=createdAt%3Adesc`;

  if (filterBy.all) {
    url = `${strapiUrl}/api/requests?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*`;
  }
  if (filterBy.status && !filterBy.requested_by) {
    url = `${strapiUrl}/api/requests?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=${filterBy.status}&sort[0]=createdAt%3Adesc`;
  }
  if (filterBy.requested_by) {
    url = `${strapiUrl}/api/requests?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][requested_by][email][$containsi]=${filterBy.requested_by}&sort[0]=createdAt%3Adesc`;
  }
  if (filterBy.pagination) {
    url = `${url}&pagination[page]=${filterBy.pageNumber}&pagination[pageSize]=${filterBy.pageSize}`;
  }
  const jwt = getAuthJWT(ctx);

  let config = {
    method,
    maxBodyLength: Infinity,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    //creating order
    const response = await axios(config);
    // console.log("❤️--lol--",response.data)
    if (filterBy.pagination) {
      return response.data;
    }
    return response.data.data;
  } catch (error) {
    console.log(`request getting erorr`, error);
    return error;
  }
}

export async function updateRequest({ data, ctx, id }) {
  //this function handles creation of request and fetching all requests

  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  let url = `${strapiUrl}/api/requests/${id}?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=completed&filters[$or][1][status][$eq]=approved&sort[0]=createdAt%3Adesc`;

  const jwt = getAuthJWT(ctx);

  let config = {
    method: 'put',
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
    //console.log(`request ${method} erorr`, error);
    return error;
  }
}
export async function deleteRequest({ id }) {
  //this function handles creation of request and fetching all requests

  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  let url = `${strapiUrl}/api/requests/${id}?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=completed&filters[$or][1][status][$eq]=approved&sort[0]=createdAt%3Adesc`;

  const jwt = getAuthJWT(ctx);

  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    // data,
  };

  try {
    //creating order
    const response = await axios(config);
    return response.data.data;
  } catch (error) {
    //console.log(`request ${method} erorr`, error);
    return error;
  }
}

export async function getSingleRequest({ id, ctx = null }) {
  //this function handles creation of request and fetching all requests

  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  let url = `${strapiUrl}/api/requests/${id}?populate[requested_by][populate]=*&populate[images][populate]=*&populate[comments][populate]=*&filters[$or][0][status][$eq]=completed&filters[$or][1][status][$eq]=approved&sort[0]=createdAt%3Adesc`;

  const jwt = getAuthJWT(ctx);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    //creating order
    const response = await axios(config);
    return response.data.data;
  } catch (error) {
    //console.log(`request single erorr`, error);
    return error;
  }
}
