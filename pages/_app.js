import '@/styles/globals.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DataProvider } from '../store/globalstate';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getMyCart } from '@/utils/controller/cartController';
import { updateUserData, getUser } from '@/utils/controller/auth';
import Router from 'next/router';
import Image from 'next/image';

import TopBarProgress from 'react-topbar-progress-indicator';
import { Literata } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarNew from '@/components/NavbarNew';

import 'animate.css';
import LoginPopup from '@/components/LoginPopup';

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
      0: '#fff',
      '1.0': '#fff',
    },
    shadowBlur: 5,
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
  //handle scroll bargutter here becasue of navbar
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // scroll lock when login is open
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isLoginOpen && isDesktop) {
      document.body.style.overflowY = 'hidden';
      document.body.style.paddingRight = '8px'; // Adjust the value as per your needs
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.paddingRight = '0';
    }
  }, [isLoginOpen]);

  //prompt for new version
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (event) => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        if (
          confirm(
            'A newer version of this web app is available, reload to update?'
          )
        ) {
          wb.addEventListener('controlling', (event) => {
            window.location.reload();
          });

          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSkipWaiting();
        } else {
          console.log(
            'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
          );
        }
      };

      wb.addEventListener('waiting', promptNewVersionAvailable);

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);

  //Logic for manually installation of PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Add event listener for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      // Clean up event listener when component unmounts
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    setDeferredPrompt(event);
  };

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          window.location.reload();
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    setIsPWAInstalled(mediaQuery.matches);
  }, []);
  return (
    <>
      {/* {isBackendLive && ( */}
      {/* {!isBackendLive && <div>Site is under maintainance</div>} */}

      <DataProvider>
        {progress && <TopBarProgress />}
        <NavbarNew isLoginOpen={isLoginOpen} />
        {/* <Navbar /> */}
        <div className={`${literata.variable} font-serif`}>
          {/* {isOnline && (
        <div className="mt-16 flex justify-center ">
          <div className="flex items-center gap-2 border border-black m-1 pr-3 rounded-lg shadow-lg">
            <div className="relative w-32 h-32">
              <Image
                src="/offlineGIF.gif"
                alt="offline logo"
                fill
                sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className=''>
            <p className='text-xl uppercase tracking-widest'>offline</p>
              </div>
          </div>
        </div>
      )} */}
          <Component {...pageProps} />
          <LoginPopup
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
          />
          {/* <Menu /> */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
          />
        </div>
        {/* Not showing footer on account page */}
        {router.pathname.includes('admin') ? null : router.pathname.includes(
            'account'
          ) ? null : (
          <Footer
            isPWAInstalled={isPWAInstalled}
            promptInstall={promptInstall}
          />
        )}
        {/* <Footer /> */}
      </DataProvider>
      {/* )} */}
    </>
  );
}
