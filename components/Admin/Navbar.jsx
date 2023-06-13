import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Bullet } from '../Icon';
import Link from 'next/link';
const Nav = () => {
  let Links = [
    { name: 'PROFILE', link: '/admin/overview' },
    { name: 'DASHBOARD', link: '/admin/dashboard' },
    { name: 'ORDERS', link: '/admin/orders' },
    { name: 'REQUESTS', link: '/admin/requests' },
    { name: 'USERS', link: '/admin/users' },
    { name: 'LOGOUT' },
  ];
  const router = useRouter();
  return (
    <div className="w-full flex justify-center ">
      <div className="mx-auto  py-5  w-full flex-shrink-0">
        <ul className="overflow-auto lg:justify-center flex mx-3 gap-6 md:gap-12">
          {Links.map((link) => {
            return (
              <Link href={`${link.link}`}
                key={link.name}
              >
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
        </ul>
      </div>
    </div>
  );
};

export default Nav;
