import Image from 'next/image'
import { Menu } from '@/components/Icon';

import Link from 'next/link';


const NotificationToast = ({imageUrl,title,body,buttonLink, setShowNotification}) => {
  
  return (
    <div
      id="toast-message-cta"
      className="shadow-md  fixed z-[99999] bottom-2 md:max-w-md  text-gray-500 bg-slate-800 rounded-lg   mx-2 first-letter:
      animate__animated animate__fadeInLeft animate__faster
      "
      role="alert"
    >
      {/* <div className="absolute bg-gray-500 w-full h-[3px] rounded-t-lg" /> */}
      <div className="p-2 md:p-3">
      <div className="flex">
        {imageUrl && <div className={` relative border rounded-lg  w-24 h-24 flex-shrink-0`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>}
        <div className="ml-3 text-sm font-normal">
          <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
          <div className="mb-2 text-sm font-normal">
            {body}
          </div>
          {buttonLink && <Link
            href={buttonLink}
            className="bg-white text-black px-3 py-1 rounded-full shadow-md hover:shadow-lg"
          >
            View
          </Link>}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-message-cta"
          aria-label="Close"
          onClick={()=>setShowNotification(false)}
        >
          <span className="sr-only">Close</span>
          <Menu />
        </button>
      </div>
      </div>
    </div>
  );
};

export default NotificationToast;
