// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const NEXT_PUBLIC_WEBSITE = process.env.NEXT_PUBLIC_WEBSITE;
//     const AUTH_EMAIL = process.env.AUTH_EMAIL;
//     const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

//     const JWT_MAX_AGE = 3600;
//     const JWT_COOKIE_NAME = 'kill';
//     const URL = `${NEXT_PUBLIC_WEBSITE}/api/auth/local`;
//     const password = req.body
//     ////console.log("____________ BODY _________________",password)
//     // if(req.body.password)
//     if(password === process.env.PASSWORD_FOR_SENDING_REQ_BACKEND){
//         try {
//           let data = JSON.stringify({
//             identifier: AUTH_EMAIL,
//             password: AUTH_PASSWORD,
//           });
    
//           let config = {
//             method: 'post',
//             maxBodyLength: Infinity,
//             url: URL,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             data,
//           };
    
//           const loginResponse = await axios.request(config);
//           ////console.log('loginResponse backend', loginResponse.data);
//           return res.status(200).json({ jwt: loginResponse.data.jwt });

//     }
//     else{
//         return
//     }
//       // const { data: loginResponseData } = await axios(config);
//       // ////console.log("jwt from login",loginResponseData)
//       // const encryptedJWT = cookieController.encryptJwt(loginResponseData.jwt);
//       // const maxAge = { maxAge: JWT_MAX_AGE, path: '/' };

//       // // setCookie(null, JWT_COOKIE_NAME, encryptedJWT, maxAge);
//       // // if (ctx)
//       // setCookie(ctx, JWT_COOKIE_NAME, encryptedJWT, {
//       //   ...maxAge,
//       //   // httpOnly: true,
//       //   secure: process.env.NODE_ENV === 'production',
//       // });

//       // return loginResponseData.jwt;
//     } catch (error) {
//       // destroyCookie({}, JWT_COOKIE_NAME, { path: '/' });
//       res.status(404).json({ message: 'Something went wrong' });
//       return null;
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }
