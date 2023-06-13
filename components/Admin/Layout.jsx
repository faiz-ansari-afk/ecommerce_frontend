import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="h-screen container mx-auto pt-16 bg-orange-300 md:pt-28 flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex-1 p-4 ">{children}</div>
    </div>
  );
};

export default Layout;
