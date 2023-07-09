import Head from 'next/head';
import Image from 'next/image';

const Fallback = () => (
  <>
    <Head>
      <title>next-pwa example</title>
    </Head>
    {/* <h1 className='mt-32'>No internet connection...</h1> */}
    <div className="mt-32 flex justify-center ">
      <div className="flex items-center gap-2 border border-black m-1 pr-3 rounded-lg shadow-lg">
        <div className="relative w-32 h-32">
          <Image
            src="/offlineGIF.gif"
            alt="offline logo"
            fill
            sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
            className="h-full w-full object-contain rounded-lg"
          />
        </div>
        <div className="">
          <p className="text-xl uppercase tracking-widest">offline</p>
        </div>
      </div>
    </div>
  </>
);

export default Fallback;
