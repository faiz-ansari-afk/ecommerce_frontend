import FormData from 'form-data';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import jwt_decode from 'jwt-decode';
import cookieController from '@/utils/controller/cookieController';
import axios from 'axios';

const NEXT_PUBLIC_WEBSITE = process.env.NEXT_PUBLIC_WEBSITE;
const NEXT_PUBLIC_AUTH_EMAIL = process.env.NEXT_PUBLIC_AUTH_EMAIL;
const NEXT_PUBLIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

const URL = `${NEXT_PUBLIC_WEBSITE}/api/auth/local`;
const JWT_MAX_AGE = 3600;
const JWT_COOKIE_NAME = 'kill';

export function decodeJWT(token) {
  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
}

export const getAuthJWT = async (ctx = null) => {
  const kill = parseCookies(ctx)[JWT_COOKIE_NAME];
  const originalJWT = await cookieController.decryptJwt(kill)
  const validJWT = decodeJWT(originalJWT);
  if (kill) {
    if (validJWT && validJWT.id) {
      ////console.log('local auth',originalJWT);
      return originalJWT;
    } else {
      destroyCookie({}, JWT_COOKIE_NAME, {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
      return await getAuthJWT();
    }
  } else {
    try {
      let data = JSON.stringify({
        identifier: NEXT_PUBLIC_AUTH_EMAIL,
        password: NEXT_PUBLIC_AUTH_PASSWORD,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      };

      const loginResponse = await axios.request(config);
      const encryptedJWT = cookieController.encryptJwt(loginResponse.data.jwt);
      const maxAge = { maxAge: JWT_MAX_AGE, path: '/' };

      // setCookie(null, JWT_COOKIE_NAME, encryptedJWT, maxAge);
      // if (ctx)
      setCookie(ctx, JWT_COOKIE_NAME, encryptedJWT, {
        ...maxAge,
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return loginResponse.data.jwt;
    } catch (error) {
      destroyCookie({}, JWT_COOKIE_NAME, { path: '/' });
      return null;
    }
  }
};
