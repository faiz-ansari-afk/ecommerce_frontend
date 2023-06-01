import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { DataContext } from '../store/globalstate';
import { parseCookies } from 'nookies';

import {
  MicrophoneIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Avatar from './Icon/Avatar';
import { decodeJWT } from '@/utils/controller/sessionController';
import { getCount, getMyCart } from '@/utils/controller/cartController';

const Navbar = () => {
  const [page, setPage] = useState('');
  const [cartLoaded, setCartLoaded] = useState(false);
  const router = useRouter();

  const { dispatch, state } = useContext(DataContext);

  const [user, setUser] = useState(null);

  const cookies = parseCookies();
  useEffect(() => {
    const user_data = decodeJWT(cookies.jwt);
    setUser(user_data);
  }, [cookies.jwt]);

  const { cartItemCount: count, cartReload } = state;

  useEffect(() => {
    if (router.pathname === '/') {
      setPage(router.pathname);
    }
  }, [router.pathname]);

  async function getCartItemCount() {
    const myCart = await getMyCart();
    const count = getCount(myCart);
    // //////console.log('Navbar Cart Loaded');
    dispatch({ type: 'SET_CART_ITEMS_COUNT', payload: count });
  }
  useEffect(() => {
    setCartLoaded(false);
    getCartItemCount();
    setCartLoaded(true);
  }, [cartReload]);

  // hide on scroll
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    window.onscroll = function () {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        setHideNavbar(false);
      } else {
        setHideNavbar(true);
      }
      prevScrollPos = currentScrollPos;
    };
  }, []);
  // console.log("navbar user",user)
  return (
    <header
      className={`${
        page !== '/collections'
          ? 'bg-gradient-to-b from-gray-900/50 to-transparent'
          : ''
      }
      ${
        hideNavbar
          ? 'translate-y-full opacity-0 '
          : 'fixed top-0 z-[100] w-full py-4 lg:py-8  translate-y-0 opacity-100 animate-fadeInDown transition-opacity duration-500 delay-200 transform origin-top'
      }
      `}
    >
      <nav className="container mx-auto flex items-center gap-2 md:gap-10 justify-center px-5 lg:px-10">
        {page !== '/' ? (
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center space-x-1 rounded-full bg-gray-900 px-2 py-1 lg:space-x-2 lg:px-4 lg:py-2"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
            <span className="text-sm text-white lg:text-base">Back</span>
          </button>
        ) : (
          <MicrophoneIcon className="h-5 w-5 stroke-2 cursor-pointer text-gray-200 lg:h-7 lg:w-7" onClick={() => dispatch({ type: 'TRUE_OPEN_SEARCH' })} />
        )}
        <span
          className={`text-xl text-center flex-grow font-bold tracking-wider lg:text-3xl ${
            page === '/' ? 'text-gray-50' : 'text-gray-900'
          }`}
        >
          <Link href="/">Ijazat</Link>
        </span>
        <ul
          className={`flex items-center gap-3 md:gap-6 ${
            page === '/' ? 'text-gray-200' : 'text-gray-900'
          }`}
        >
          <li title="search ">
            <MagnifyingGlassIcon
            
              className="h-5 w-5 stroke-2 lg:h-7 lg:w-7 cursor-pointer"
              onClick={() => dispatch({ type: 'TRUE_OPEN_SEARCH' })}
            />
          </li>
          {user && (
            <li className="">
              <Link href="/account/overview">
                <Avatar  />
              </Link>
            </li>
          )}
          <li className="relative">
            {cartLoaded && (
              <>
                <Link href="/cart" title="cart">
                  <ShoppingBagIcon className="h-5 w-5 stroke-2 lg:h-7 lg:w-7" />

                  {count > 0 && (
                    <span className="absolute right-3 top-3 flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full border border-black bg-black px-[2.5px] text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
