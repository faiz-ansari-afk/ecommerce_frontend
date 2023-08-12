import Link from 'next/link';
import React from 'react';

const RequestHero = ({ collectionFlag = false }) => {
  return (
    <div className="flex justify-center relative ">

      <div
        className="relative w-full lg:w-1/2 bg-center border-2 border-black  rounded  shadow-lg 
        "
      >
        <div className="bg-black animate-pulse absolute hidden md:block top-5 left-[100px] -z-[999] rounded-full overflow-hidden w-36 h-36" />
        <div className=" flex items-center justify-center m-4 md:m-12">
        
          <div className="bg-white bg-opacity-50 p-2 rounded-lg md:p-8 text-center relative ">
          {/* <div className="absolute inset-0 border  animate-ping rounded-lg" /> */}
            {collectionFlag ? (
              <h2 className="text-xl md:text-3xl mb-3">
                <span className="bg-black text-white p-1">Couldn't</span> find?
              </h2>
            ) : (
              <h2 className="text-xl md:text-3xl mb-3">
                <span className="bg-black text-white p-1">Request</span> Any
                Product You Want
              </h2>
            )}
            <p className="md:text-lg mb-4">
              Burqa Design, Abaya, T-Shirts, Watches, Suits, Bike Parts, etc, etc...
            </p>
            <Link href="/request">
              <button className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:shadow-lg">
                Request Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHero;
