import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies, destroyCookie } from 'nookies';
import { getUser } from '@/utils/controller/auth';

export default async function ProtectedPageRoute(
  ctx,
  redirectTo, // string route where user will be redirected if they are not authenticated
  getProps // function to fetch initial props
) {
  let userIsAuthenticated = false;
  const jwt = parseCookies(ctx).jwt;
  const userInfo = decodeJWT(jwt);
  ////////console.log("user data jwt",jwt, userInfo)
  if (userInfo) {
    const user = await getUser(null, ctx);
    if (user) {
      userIsAuthenticated = true;
    } else {
      destroyCookie(ctx, 'jwt', {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
      userIsAuthenticated = false;
    }
  }

  if (!userIsAuthenticated) {
    destroyCookie(ctx, 'jwt', {
      path: '/', // THE KEY IS TO SET THE SAME PATH
    });
    return {
      redirect: {
        destination: redirectTo ?? '/',
        permanent: false,
      },
    };
  }

  if (getProps) {
    const user_detail = await getUser(userInfo.id, ctx);
    
    const data = await getProps(user_detail);
    return {
      props: { data, user: user_detail },
    };
  }
  return {
    props: {
      data: 'dummy',
    },
  };
}
