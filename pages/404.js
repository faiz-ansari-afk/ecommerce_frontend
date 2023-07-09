import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();
  return (
    <>
      <section className="relative bg-gray-100 container mx-auto flex items-center justify-center  py-32 md:h-screen">
        <div className=" text-center">
          <div className=" flex justify-center">
            <div className="relative h-72 border rounded-lg  w-72 flex-shrink-0 my-3">
              <Image
                src="/page-not-found.gif"
                alt="open box logo"
                fill
                sizes="(max-width: 768px) 100vw,
                                              (max-width: 1200px) 50vw,
                                              33vw"
                className="h-full w-full object-contain  rounded-lg"
              />
            </div>
          </div>
          {/* <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                  Oops! That page can't be found
                </h4> */}
          <p className="mb-8 text-lg ">
            The page you are looking for it maybe deleted
          </p>
          <div className="flex justify-center gap-5">
            <Link
              href="/"
              className="px-3 bg-black text-white py-2 rounded-full shadow-md hover:shadow-lg"
            >
              Go to Home
            </Link>

            <button
              onClick={() => router.back()}
              className="px-3 border-t bg-white text-black py-2 rounded-full shadow-md hover:shadow-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Custom404;
