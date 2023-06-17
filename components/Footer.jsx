import React from 'react';
import Link from 'next/link';

function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <footer className="bg-black text-white py-16 container mx-auto font-[GillSans]">
      <div className="w-full  flex items-center justify-center bg-black">
        <div className="md:w-2/3 w-full px-4 text-white flex flex-col">
          <div className="flex flex-col  ">
            <h3 className="text-3xl hover:scale-[1.1] transition duration-300 text-center my-5">
              <Link href="/">Are Baba</Link>
            </h3>
            <div className="flex  mb-8 flex-row justify-between">
              <Link
                className="cursor-pointer  text-gray-600 hover:text-gray-200 transition duration-500 uppercase"
                href="/about-us"
              >
                About
              </Link>
              <Link
                className="cursor-pointer  text-gray-600 hover:text-gray-200 transition duration-500 uppercase"
                href="about-us"
              >
                Services
              </Link>
              <Link
                className="cursor-pointer  text-gray-600 hover:text-gray-200 transition duration-500 uppercase"
                href="about-us"
              >
                Why us
              </Link>
              <Link
                className="cursor-pointer  text-gray-600 hover:text-gray-200 transition duration-500 uppercase"
                href="contact"
              >
                Contact
              </Link>
            </div>
            <div className="border-gray-100 h-1 w-full" />
            <p className="w-full text-center my-12 text-gray-600 pb-32">
              Copyright © {currentYear}{' '}
              <span className="hover:text-white  transition duration-300">
                Are Baba
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
