import React, { useContext } from 'react';
import { DataContext } from '@/store/globalstate';
import { useRouter } from 'next/router';
import { Bullet } from '../Icon';
import Link from 'next/link';

import { destroyCookie } from 'nookies';

const Nav = ({ user }) => {
  const { dispatch, state } = useContext(DataContext);
  let Links = [
    { name: 'PROFILE', link: '/admin/overview' },
    { name: 'ORDERS', link: '/admin/orders' },
  ];
  if (user.local_role === 'admin') {
    Links = [
      { name: 'PROFILE', link: '/admin/overview' },
      { name: 'DASHBOARD', link: '/admin/dashboard' },
      { name: 'ORDERS', link: '/admin/orders' },
      { name: 'REQUESTS', link: '/admin/requests' },
    ];
  }
  const router = useRouter();
  const handleLogout = () => {
    destroyCookie({}, 'jwt', {
      path: '/', // THE KEY IS TO SET THE SAME PATH
    });
    destroyCookie({}, 'cart_uid', {
      path: '/', // THE KEY IS TO SET THE SAME PATH
    });
    dispatch({ type: 'FALSE_GLOBAL_USER_lOGIN' });
    dispatch({ type: 'RELOAD_CART' });
    router.push('/');
  };
  return (
    <div className="w-full flex justify-center ">
      <div className="mx-auto  py-5  w-full flex-shrink-0">
        <ul className="overflow-auto lg:justify-center items-center flex mx-3 gap-6 md:gap-12">
          {Links.map((link) => {
            return (
              <Link href={`${link.link}`} key={link.name}>
                <li
                  className={`py-3 my-1 items-center gap-2 flex ${
                    router.pathname === link.link
                      ? 'bg-gray-100 rounded-full px-4 shadow-lg pt-3'
                      : ''
                  }`}
                >
                  {router.pathname === link.link && (
                    <span className="w-4 h-4">
                      <Bullet />
                    </span>
                  )}
                  <span>{link.name}</span>
                </li>
              </Link>
            );
          })}
          <li>
            <button
              className={`py-1 my-1 items-center gap-2 flex uppercase bg-rose-900 text-white px-2 text-sm rounded-lg`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
