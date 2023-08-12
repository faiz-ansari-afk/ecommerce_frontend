import {useState, useEffect,  useContext } from 'react';
import { decodeJWT } from '@/utils/controller/sessionController';
import { parseCookies } from 'nookies';

import Image from 'next/image';
import { DataContext } from '@/store/globalstate';



const Feature = () => {
    const { dispatch } = useContext(DataContext);
    const [user, setUser] = useState(null);
  

  const cookies = parseCookies();
  useEffect(() => {
    const user_data = decodeJWT(cookies.jwt);
    setUser(user_data);
  }, [cookies.jwt]);
  const feature = [
    {
      image: '/openbox.jpg',
      alt: 'Open Box Image',
      title: <span className="bg-orange-300 text-black p-2">OPEN</span>,
      desc: 'BOX DELIVERY',
    },
    {
      image: '/cod.gif',
      alt: 'Cash on delivery image',
      title: <span className="bg-lime-300 text-black p-2">CASH</span>,
      desc: 'ON DELIVERY',
    },
    {
      image: '/freeDelivery.gif',
      alt: 'Free delivery gif',
      title: <span className="bg-rose-300 text-black p-2">FREE</span>,
      desc: ' DELIVERY',
    },
  ];
  return (
    <div className=''>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  items-center  justify-center mx-3 gap-3">
        {feature.map((f, i) => (
          <div
            className=" flex justify-center items-center gap-4 last:md:col-span-2 lg:last:col-span-1    border-gray-300  bg-white border-t rounded-lg  p-1 lg:p-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-300 ease-in-out"
            key={i}
          >
            <div className="relative h-32 w-32 md:h-44 md:w-44 flex-shrink-0">
              <Image
                src={f.image}
                alt={f.alt}
                fill
                sizes="(max-width: 768px) 100vw,
                                (max-width: 1200px) 50vw,
                                33vw"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className=" text-2xl leading-10 lg:text-2xl md:text-3xl text-gray-600">
              {f.title} {f.desc}
            </div>
          </div>
        ))}
      </div>
      {!user && (
        <div className=" flex justify-center  m-2  mt-32 ">
          <div className="flex flex-col md:flex-row border  shadow rounded-lg">
            <div className="flex justify-center">
              <div className="relative h-[200px] w-[200px]  flex-shrink-0">
                <Image
                  src="/loginGif.gif"
                  alt="open box logo"
                  fill
                  sizes="(max-width: 768px) 100vw,
                                          (max-width: 1200px) 50vw,
                                          33vw"
                  className="h-full w-full object-contain  rounded-lg"
                />
              </div>
            </div>
            <div className="  rounded-lg m-2 p-2 text-center max-w-lg md:flex justify-center md:flex-col ">
              <h3 className="text-xl text-center">Welcome to Our Store</h3>
              <p className="md:text-lg my-2 text-gray-700">
                Please log in to access your account, cart, orders and request.
              </p>
              <div className="flex  justify-center">
                <button
                  className="button-transition w-fit px-9 py-2 uppercase bg-black text-white"
                  onClick={() => {
                    dispatch({ type: 'TRUE_OPEN_LOGIN' });
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feature;
