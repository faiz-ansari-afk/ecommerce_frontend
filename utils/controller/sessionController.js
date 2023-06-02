import jwt_decode from 'jwt-decode';

export function decodeJWT(token) {
  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
}

export const getAuthJWT =  () => {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN;
};
