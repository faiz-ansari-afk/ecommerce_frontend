import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Footer({ isPWAInstalled, promptInstall }) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <footer className=" mx-auto bg-gray-900 mt-4 md:mt-0">
      {!isPWAInstalled && (
        <section className="container mx-auto">
          <div className="bg-slate-900  px-4 py-3 text-gray-200 sm:flex sm:items-center sm:justify-between ">
            <p className="md:text-center  text-left">
              To enhance your user experience, we recommend installing our app.
            </p>
            {/* <div className='flex justify-center'> */}
            <button
              className=" block rounded-lg bg-gray-200 px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-white focus:outline-none focus:ring mt-4 md:mt-0"
              href="#"
              onClick={promptInstall}
            >
              Install Now
            </button>
            {/* </div> */}
          </div>
        </section>
      )}
      <div className="container mx-auto p-3 md:py-8">
        <div className="sm:flex items-center justify-between ">
          <Link href="/">
            <div className="relative border w-32 h-8  text-center">
              <Image
                src="/site/logo-no-background.svg"
                fill
                alt="site logo"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-contain  rounded-lg  hover:text-white"
              />
            </div>
          </Link>
          <ul className="flex flex-wrap items-center justify-between my-6 text-sm font-medium text-gray-500  ">
            <li>
              <Link href="/about-us" className="mr-4 hover:underline md:mr-6 ">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/request" className="mr-4 hover:underline md:mr-6 ">
                Requests
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear}{' '}
          <Link href="/" className="hover:underline">
            are baba
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
