import Link from 'next/link';
import { Playfair_Display } from '@next/font/google';
import { useEffect } from 'react';
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

const Main = ({ setIsLoginFormOpen }) => {
  useEffect(() => {
    setIsLoginFormOpen(false);
  }, []);
  return (
    <>
      <ul
        className={`space-y-3 font-heading text-5xl lg:space-y-2 lg:text-6xl ${playfairDisplay.variable}`}
      >
        <li>
          <Link href="/collections">Products</Link>
        </li>
        <li>Stories</li>
        <li>Gift guide</li>
      </ul>
      <ul className="text-md space-y-1 font-sans uppercase lg:space-y-1.5 lg:text-base">
        <li className=" hover:underline">
          <Link href="/about-us">About us</Link>
        </li>
        <li className=" hover:underline">Store Locator</li>

        <li
          className=" hover:underline"
          onClick={() => setIsLoginFormOpen((ov) => !ov)}
        >
          Login
        </li>
        <li className=" hover:underline">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </>
  );
};

export default Main;
