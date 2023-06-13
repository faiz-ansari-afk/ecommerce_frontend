import '@/styles/globals.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DataProvider } from '../store/globalstate';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Menu from '@/components/Menu/Menu';
import { getMyCart } from '@/utils/controller/cartController';
import { updateUserData, getUser } from '@/utils/controller/auth';
import Router from 'next/router';

import TopBarProgress from 'react-topbar-progress-indicator';
import { Inter, Literata } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const literata = Literata({
  subsets: ['latin'],
  variable: '--font-lato',
});

export default function App({ Component, pageProps }) {
  // progress bar handling
  const [progress, setProgress] = useState(false);

  Router.events.on('routeChangeStart', () => {
    setProgress(true);
    //function will fired when route change started
  });

  Router.events.on('routeChangeComplete', () => {
    setProgress(false);
    //function will fired when route change ended
  });
  TopBarProgress.config({
    barColors: {
      "0": "#000",
      "1.0": "#000"
    },
    shadowBlur: 5
  });
  // __________________
  const [isOnline, setNetwork] = useState(
    typeof window !== 'undefined' && window.navigator.onLine
  );

  useEffect(() => {
    window.addEventListener('offline', () =>
      setNetwork(window.navigator.onLine)
    );
    window.addEventListener('online', () =>
      setNetwork(window.navigator.onLine)
    );
  });
  useEffect(() => async () => {
    // let cart_uid = null;
    const cartData = await getMyCart();
    const userDetails = await getUser();

    if (userDetails && cartData) {
      const cartId = cartData.id;
      const addCartToUserData = {
        current_cart: cartId,
      };

      //if cart already exist in user
      if (userDetails.current_cart) {
        // ////console.log('cart found in user');
        //check cart status, if it is abandoned or ordered
        if (
          cartData.cart_status === 'ordered' ||
          cartData.cart_status === 'abandoned'
        ) {
          // ////console.log('cart status is abandoned or ordered');
          //remove cart relation from user , #NOTE: doing this for safety side
          const removeCartFromUserData = {
            current_cart: null,
          };
          await updateUserData({
            id: userDetails.id,
            ctx: null,
            data: removeCartFromUserData,
          });
        }
      } else {
        // ////console.log('Cart Not found in user adding now');
        await updateUserData({
          id: userDetails.id,
          ctx: null,
          data: addCartToUserData,
        });
      }
    }
  });
  // check if strapi is working fine or not
  useEffect(() => {
    // ////console.log("running strapi effect")
    async function checkStrapiApiStatus() {
      try {
        const response = await axios.post('/api/status');
        // ////console.log(response.data.status);
        setIsBackendLive(true);
      } catch (error) {
        //console.error(error);
        setIsBackendLive(false);
      }
    }
    checkStrapiApiStatus();
  });
  const [isBackendLive, setIsBackendLive] = useState(true);
  // ////console.log(isBackendLive)

  // useEffect(() => {
  //   ToastMessage({ type: "error", message: "Hello world!" });
  // }, []);
  useEffect(() => {
    const unhandledRejectionHandler = (event) => {
      // Handle unhandled promise rejections
      const error = event.reason;
      if (error && error.name === 'UnhandledRejection') {
        // Handle the error here, e.g., log the error, display an error message, etc.
        console.error('Unhandled Promise Rejection:', error.reason);
      }
    };

    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        unhandledRejectionHandler
      );
    };
  }, []);
  const router = useRouter();

  return (
    <>
      {isBackendLive && (
        <DataProvider>
          {progress && <TopBarProgress />}
          <Navbar />
          <div className={`${literata.variable} font-serif`}>
            <Component {...pageProps} />

            <Menu />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              pauseOnVisibilityChange
              closeOnClick
              pauseOnHover
            />
          </div>
          {/* Not showing footer on account page */}
          {!router.asPath.includes('account') || !router.asPath.includes('admin') && <Footer />}
        </DataProvider>
      )}
      {!isBackendLive && <div>Site is under maintainance</div>}
    </>
  );
}
