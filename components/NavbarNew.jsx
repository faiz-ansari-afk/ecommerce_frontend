import { useState, useEffect, useContext, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Close, Menu } from './Icon';
import SearchBar from './Menu/SearchBar';
import SearchList from './Menu/SearchList';

//user and cart icons
import Avatar from './Icon/Avatar';
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies } from 'nookies';
import { getCount, getMyCart } from '@/utils/controller/cartController';
import { getUser } from '@/utils/controller/auth';
import { DataContext } from '../store/globalstate';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const NavbarNew = ({ isLoginOpen }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [openSearchList, setOpenSearchList] = useState(false);
  //close navbar menu when route change
  //close search list on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Handle the page change event
      setOpenSearchList(false);
      setIsOpen(false);
    };

    // Subscribe to the router's "routeChangeComplete" event
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the event listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  const [searchedProducts, setSearchedProducts] = useState(null);
  const [queryParam, setQueryParam] = useState(null);

  const links = [
    { name: 'Products', link: '/collections' },
    { name: 'Request', link: '/request' },
    { name: 'About Us', link: '/about-us' },
  ];

  //?______________________________ USER AND CART ____________________________
  const [cartLoaded, setCartLoaded] = useState(false);
  const { dispatch, state } = useContext(DataContext);

  const [user, setUser] = useState(null);

  const cookies = parseCookies();
  useEffect(() => {
    const user_data = decodeJWT(cookies.jwt);
    setUser(user_data);
  }, [cookies.jwt]);

  const { cartItemCount: count, cartReload } = state;
  async function getCartItemCount() {
    const myCart = await getMyCart();
    const count = getCount(myCart);
    dispatch({ type: 'SET_CART_ITEMS_COUNT', payload: count });
  }
  useEffect(() => {
    setCartLoaded(false);
    getCartItemCount();
    setCartLoaded(true);
  }, [cartReload]);

  const [fullUser, setFullUser] = useState(null);
  useEffect(() => {
    const fetchUserDetail = async () => {
      if (user) {
        const userDetail = await getUser(user.id, null);
        setFullUser(userDetail);
      }
    };
    fetchUserDetail();
  }, [cookies.jwt, user?.id]);

  // hide on scroll
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    window.onscroll = function () {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos > currentScrollPos) {
        setHideNavbar(false);
      } else {
        setHideNavbar(true);
        setIsOpen(false);
        setOpenSearchList(false);
      }
      prevScrollPos = currentScrollPos;
    };
  }, []);

  //scrol bar gutter when login is open
  useEffect(() => {
    const headerElement = document.querySelector('header');
    const isDesktop = window.innerWidth >= 1024;
    if (isLoginOpen && isDesktop) {
      headerElement.style.paddingRight = '8px'; // Adjust the value as per your needs
      // headerElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    } else {
      headerElement.style.paddingRight = '0';
    }
  }, [isLoginOpen]);
  return (
    <header
      className={` ${
        hideNavbar
          ? 'animate__animated animate__fast animate__fadeInUp hidden'
          : 'fixed  top-0 z-[100] w-full animate__animated animate__faster animate__fadeInDown bg-slate-900  font-[GillSans] translate-y-0 opacity-100  transform origin-top'
      }`}
    >
      <nav className="  container mx-auto ">
        <div className="flex gap-2 w-full  items-center px-2 py-3">
          {/* <div className="flex gap-2 w-full  items-center px-2 py-3"> */}
          <Link href="/" className="flex  justify-center">
            <div className="relative h-9 w-9 lg:w-32  text-center">
              <Image
                src="/favicons/android-chrome-512x512.png"
                fill
                alt="site logo"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-contain  rounded-lg lg:hidden"
              />
              <Image
                src="/site/logo-no-background.svg"
                fill
                alt="site logo"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-contain  rounded-lg hidden lg:block hover:text-white"
              />
            </div>
          </Link>
          <div className="hidden lg:block">
            <ul className="flex items-center text-white gap-10 ml-10">
              {links.map((link) => (
                <li
                  className={`${
                    router.pathname === link.link
                      ? ' bg-slate-700 rounded text-white'
                      : 'text-gray-400'
                  } px-3 py-2 hover:bg-slate-700 hover:rounded transition duration-300 cursor-pointer `}
                  key={link.link}
                >
                  <Link href={link.link}>{link.name} </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* </div> */}
          <div className="relative grow lg:grow-0 ml-auto lg:min-w-[400px]">
            <SearchBar
              setIsKeyboardOpen={null}
              setOpenSearchList={setOpenSearchList}
              setSearchedProducts={setSearchedProducts}
              setQueryParam={setQueryParam}
              queryParam={queryParam}
            />
            {openSearchList && (
              <div className="hidden lg:block fixed top-[60px] rounded-b-lg shadow-lg shadow-white bg-slate-900 min-w-[400px] max-w-[400px] animate__animated animate__fadeIn ">
                <SearchList
                  searchedProducts={searchedProducts}
                  queryParam={queryParam}
                />
              </div>
            )}
          </div>
          <ul className="flex gap-3 lg:mx-3 items-center">
            {!user && (
              <li className="hidden lg:block ">
                <button
                  type="button"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="border inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] hover:bg-gray-800"
                  onClick={() => dispatch({ type: 'TRUE_OPEN_LOGIN' })}
                >
                  Login
                </button>
              </li>
            )}
            {user && (
              <li className="hidden lg:block animate__animated animate__fadeIn ">
                <Link
                  href="/account/overview"
                  className="flex gap-1 items-center"
                >
                  <Avatar heightWidth="h-7 w-7" />
                  {fullUser && (
                    <p className="text-gray-400 hover:text-white">
                      {fullUser.username.length > 6
                        ? fullUser.username.substring(0, 6) + '...'
                        : fullUser.username}
                    </p>
                  )}
                </Link>
              </li>
            )}
            {fullUser && fullUser.local_role !== 'customer' && (
              <li className="hidden lg:block animate__animated animate__fadeIn">
                <Link href="/admin/orders" title="admin panel">
                  <Avatar heightWidth="h-7 w-7" url="/adminAvatar.jpg" />
                </Link>
              </li>
            )}
            <li className="relative">
              {cartLoaded && (
                <>
                  <Link href="/cart" title="cart">
                    <ShoppingBagIcon className="text-white stroke-2 h-7 w-7" />

                    {count > 0 && (
                      <span className="absolute  left-3 top-3 flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full border  bg-white px-[2.5px] text-xs font-bold text-black">
                        {count}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </li>
          </ul>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex-shrink-0 lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? <Close /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden animate__animated animate__fadeIn">
            <ul className=" text-white px-3  text-xl mb-3  ">
              {links.map((link) => (
                <Link href={link.link} key={link.link}>
                  <li
                    className={` my-1 ${
                      router.pathname === link.link &&
                      'block bg-slate-700 rounded'
                    } px-3 pt-1 pb-2  hover:bg-slate-700 hover:rounded cursor-pointer `}
                  >
                    {link.name}
                  </li>
                </Link>
              ))}
            </ul>
            <div className="h-[1px] bg-gray-200 w-full " />
            <div className="flex flex-col px-2 gap-4 my-2">
              {!user && (
                <div className="flex ml-3 max-w-[200px]">
                  <button
                    type="button"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    className="border inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] hover:bg-gray-800"
                    onClick={() => {
                      dispatch({ type: 'TRUE_OPEN_LOGIN' });
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </button>
                </div>
              )}
              {user && (
                <div className="inline-block animate__animated animate__fadeIn">
                  <Link href="/account/overview">
                    <div className="flex gap-3 text-white items-center rounded-lg">
                      <Avatar heightWidth="h-10 w-10" />
                      {fullUser && (
                        <p className="text-xl  tracking-wider">
                          {fullUser.username}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              )}
              {fullUser && fullUser.local_role !== 'customer' && (
                <div className="inline-block animate__animated animate__fadeIn">
                  <Link href="/admin/orders" title="admin panel">
                    <div className="flex gap-3 text-white items-center   rounded-lg">
                      <Avatar heightWidth="h-10 w-10" url="/adminAvatar.jpg" />
                      <p className="text-xl uppercase tracking-widest ">
                        Admin
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        {openSearchList && (
          <div className="lg:hidden">
            <SearchList
              searchedProducts={searchedProducts}
              queryParam={queryParam}
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavbarNew;
