import { useState, useRef, useEffect, useContext } from 'react';

import { DataContext } from '@/store/globalstate';
import Login from './Menu/Login';

const LoginPopup = ({ isLoginOpen, setIsLoginOpen }) => {
  const { dispatch, state } = useContext(DataContext);

  //open login form during checkout if user is not logged in
  useEffect(() => {
    if (state.openLogin) {
      setIsLoginOpen(true);
    }
  });
  //close when click outside
  const ref = useRef(null);
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
        setIsLoginOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {isLoginOpen && (
        <div
          ref={ref}
          className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  w-[95%]  h-[70%] md:h-[50%] lg:h-[80%] lg:w-[50%]  bg-gradient-to-l from-black via-slate-800 to-slate-700 rounded-lg  shadow-md z-[999999]"
        >
          <button
            className="text-xl absolute top-0 left-0 py-2 px-4 rounded-tl-lg text-white bg-gray-600 cursor-pointer rounded-br-lg"
            onClick={() => {
              setIsLoginOpen(false);
              dispatch({ type: 'FALSE_OPEN_LOGIN' });
            }}
          >
            x
          </button>
          <div className='flex justify-center items-center  h-full md:w-[50%] mx-auto'>
            <Login setIsLoginOpen={setIsLoginOpen} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
