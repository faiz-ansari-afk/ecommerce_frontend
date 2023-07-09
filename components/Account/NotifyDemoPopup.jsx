import {useState, useEffect} from 'react';
import Image from 'next/image';

const NotifyDemoPopup = ({ setOpenDemo }) => {
  const openPWAInChrome = () => {
    const isChrome = /Chrome/.test(navigator.userAgent);
    const pwaUrl = process.env.NEXT_PUBLIC_WEB_ADD;

    if (isChrome) {
      window.open(pwaUrl, '_blank');
    } else {
      console.log('Chrome is not available. Please use a different browser.');
    }
  };



  const [isUserInBrowser, setIsUserInBrowser] = useState(true);


  
  useEffect(() => {
    const checkStandaloneMode = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('User is using the website in standalone mode (PWA).');
        setIsUserInBrowser(false)
      } else {
        console.log('User is using the website in a regular browser.');
        setIsUserInBrowser(true)
      }
    };

    checkStandaloneMode();
  }, []);

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[1111] h-[50%] w-[80%] my-auto lg:h-[95%]    overflow-y-scroll rounded-lg border bg-white px-1  md:pb-12 shadow-lg  md:px-8 animate__animated animate__zoomIn animate__faster 
      `}
    >
        <div className="flex items-center py-1 justify-between">
          <h2 className="text-rose-600 text-sm md:text-normal">Allow Notification access manually</h2>
          <button
            className="border border-black px-2 rounded-lg hover:shadow-lg lg:text-xl hover:scale-[1.1] md:mr-2 md:text-4xl"
            onClick={() => setOpenDemo(false)}
          >
            X
          </button>
        </div>
      <div className='hidden lg:block w-full mx-auto h-full'>
        <div className="relative h-full w-full  flex-shrink-0">
          <Image
            src="/notifyDemo.gif"
            alt="open box logo"
            fill
            sizes="(max-width: 768px) 100vw,
                                      (max-width: 1200px) 50vw,
                                      33vw"
            className="h-full w-full object-contain border rounded-lg"
          />
        </div>
      </div>
      <div className='lg:hidden'>
          
        <div className='flex flex-col items-center justify-center'>
          <div className="relative h-[250px] w-[250px]  flex-shrink-0 my-3">
          <Image
            src="/notifyDemo.gif"
            alt="open box logo"
            fill
            sizes="(max-width: 768px) 100vw,
                                      (max-width: 1200px) 50vw,
                                      33vw"
            className="h-full w-full object-contain border rounded-lg"
          />
        </div>
        {!isUserInBrowser &&<button className='bg-black text-gray-300 rounded-full shadow-md px-3 py-1' onClick={openPWAInChrome}>Open in Chrome</button>
        }
        </div>
      
      </div>
    </div>
  );
};

export default NotifyDemoPopup;
