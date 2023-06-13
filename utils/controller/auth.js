import axios from 'axios';
import { getAuthJWT, decodeJWT } from '@/utils/controller/sessionController';
import { destroyCookie, parseCookies } from 'nookies';
const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;

export async function signIn({ email, password }) {
  const url = `${strapiUrl}/api/auth/local`;
  const data = JSON.stringify({
    identifier: `${email}`,
    password: `${password}`,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    const response = await axios(config);
    ////////console.log('success Login seperate ❤️', response.data);
    return response.data;
  } catch (error) {
    ////////console.log('Login Failed separate', error.response.data);
    return error.response.data;
  }
}

export async function signUp({ email, password, username }) {
  const url = `${strapiUrl}/api/users`;
  const jwt = getAuthJWT();

  const data = JSON.stringify({
    username,
    email,
    password,
    role: 2, // for normal user
  });
  const loginData = {
    email,
    password,
  };

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
    //registering user
    const response = await axios(config);
    ////////console.log(response.data);
    ////////console.log("From signUpController")

    //after registering logging in user
    const loggingUser = await signIn(loginData);

    return loggingUser;
  } catch (error) {
    //console.log('Registeration error', error.response.data);
    return error.response.data;
  }
}
export async function searchUserInDatabase({ field = 'email', value }) {
  const url = `${strapiUrl}/api/users?poplate=*&filters[$and][0][${field}][$eq]=${value}`;
  try {
    const jwt = getAuthJWT();
    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    // console.log('respo', response);
    if (field === 'local_role') {
      return response.data.length > 0 ? response.data : null;
    }
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    return null;
  }
}

export async function getUser(id, ctx) {
  const jwt = getAuthJWT(ctx);

  const jwtUser = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwtUser);
  if (!userInfo) {
    destroyCookie({}, 'jwt', {
      path: '/',
    });
    return null;
  }

  let url = `${strapiUrl}/api/users/${userInfo.id}?populate=*`;
  if (id) {
    url = `${strapiUrl}/api/users/${id}?populate=*`;
  }
  try {
    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (response.data.length === 0) return null;
    return response.data;
  } catch (error) {
    //console.log('Getting current user error', error.response);
    return null;
  }
}
export async function getAllUsers(ctx) {
  const jwt = getAuthJWT(ctx);

  const url = `${strapiUrl}/api/users?populate=*`;
  try {
    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Getting all user error', error.response);
    return null;
  }
}
export async function updateUserData({ id, ctx, data }) {
  const jwt = getAuthJWT(ctx);
  const url = `${strapiUrl}/api/users/${id}?populate=*`;
  try {
    const response = await axios({
      method: 'put',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data,
    });
    return response.data;
  } catch (error) {
    //console.log(error);
    return error.response.data.error;
  }
}
