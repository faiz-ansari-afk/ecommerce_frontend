import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, useContext } from 'react';
import Login from './Login';
import { DataContext } from '../../store/globalstate';

import { parseCookies } from 'nookies';
import { decodeJWT } from '@/utils/controller/sessionController';

// import { Playfair_Display } from '@next/font/google';
import SearchBar from './SearchBar';
import SearchList from './SearchList';

// const playfairDisplay = Playfair_Display({
//   subsets: ['latin'],
//   variable: '--font-playfair-display',
// });

const Menu = () => {
  const { dispatch, state } = useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [openSearchList, setOpenSearchList] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState(null);
  const [queryParam, setQueryParam] = useState(null);
  const router = useRouter();
  const ref = useRef(null);

  const cookies = parseCookies();
  const user = decodeJWT(cookies.jwt);

  useEffect(() => {
    setIsOpen((ov) => false);
  }, [router.pathname]);

  //open serahcbar from navbar
  useEffect(() => {
    if (state.openSearch) {
      setIsOpen(true);
    }
    // else{
    //   // setIsOpen(false);
    //   setIsLoginFormOpen(false)
    // }
  });
  //open login form during checkout if user is not logged in
  useEffect(() => {
    if (state.openLogin) {
      setIsOpen(true);
      setIsLoginFormOpen(true);
    }
    // else{
    //   // setIsOpen(false);
    //   setIsLoginFormOpen(false)
    // }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        event.target.textContent !== 'Close' &&
        event.target.textContent !== 'Login' &&
        event.target.tagName !== 'svg' &&
        !ref.current.contains(event.target)
      ) {
        //console.log(event.target.tagName, isKeyboardOpen);
        dispatch({ type: 'FALSE_OPEN_LOGIN' });
        dispatch({ type: 'FALSE_OPEN_SEARCH' });
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style = 'overflow-y: hidden';
      return;
    }
    setIsLoginFormOpen(false);
    setOpenSearchList(false);
    setSearchedProducts(null);
    document.body.style = 'overflow-y: auto';
  }, [isOpen]);

  ////console.log("searchedProducts",searchedProducts)
  // fixing mobile device problem
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleFocus = () => {
      setIsKeyboardOpen(true);
    };
    const handleBlur = () => {
      setIsKeyboardOpen(false);
    };
    const handleResize = () => {
      setKeyboardHeight(
        window.innerHeight -
          document.activeElement.getBoundingClientRect().bottom
      );
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      {isOpen && (
        <div
          ref={ref}
          className={`fixed left-1/2  bottom-32 z-50  w-80 -translate-x-1/2 transform space-y-4 rounded-lg  bg-gradient-to-l from-black to-slate-700    px-1 text-center  text-gray-200  lg:bottom-36  lg:space-y-8 lg:px-1 ${
            isLoginFormOpen || isSignupFormOpen ? 'p-5' : ''
          }
          ${
            isKeyboardOpen && keyboardHeight > 0
              ? 'h-[250px] md:min-h-[440px] overflow-y-scroll'
              : 'min-h-[440px]'
          }
          `}
        >
          {isLoginFormOpen ? (
            <Login
              setIsLoginFormOpen={setIsLoginFormOpen}
              setIsOpen={setIsOpen}
            />
          ) : (
            <div>
              <SearchBar
                setIsKeyboardOpen={setIsKeyboardOpen}
                setOpenSearchList={setOpenSearchList}
                setSearchedProducts={setSearchedProducts}
                setQueryParam={setQueryParam}
              />
              {openSearchList ? (
                <SearchList
                  searchedProducts={searchedProducts}
                  queryParam={queryParam}
                />
              ) : (
                <>
                  <ul
                    className={`space-y-2 mt-6 mb-10 md:mb-6 md:mt-12 font-heading text-5xl md:text-[36px]  `}
                  >
                    <li className="hover:text-gray-100">
                      <Link href="/collections">Products</Link>
                    </li>
                    <li className="hover:text-gray-100">
                      <Link href="/shops">Shops</Link>
                    </li>
                    <li className="hover:text-gray-100">
                      <Link href="/request?requestType=product">Request</Link>
                    </li>
                  </ul>
                  <ul className="text-xl md:text-[12px] space-y-1 font-[GillSans] uppercase ">
                    <li className=" hover:underline cursor-pointer">
                      <Link href="/">HOME</Link>
                    </li>
                    <li className=" hover:underline cursor-pointer">
                      <Link href="/about-us">About us</Link>
                    </li>

                    {!user && (
                      <li
                        className=" hover:underline cursor-pointer"
                        onClick={() => setIsLoginFormOpen((ov) => !ov)}
                      >
                        Login
                      </li>
                    )}
                    <li className=" hover:underline cursor-pointer">
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          dispatch({ type: 'FALSE_OPEN_LOGIN' });
          dispatch({ type: 'FALSE_OPEN_SEARCH' });
          setIsOpen((isOpen) => !isOpen);
        }}
        className="fixed bottom-10 left-1/2 z-50 h-20 w-20 -translate-x-1/2 transform transition-transform active:scale-95 lg:h-24 lg:w-24"
        // style={{ bottom: isKeyboardOpen ? keyboardHeight + 16 : 32 }}
      >
        <Image
          src="/nav-button.webp"
          alt="menu"
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
        <span className="absolute inset-0 z-[60] grid place-content-center uppercase text-gray-200 lg:text-lg">
          {isOpen ? 'Close' : 'Menu'}
        </span>
      </button>
    </>
  );
};

export default Menu;
