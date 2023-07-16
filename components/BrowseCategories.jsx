import Link from 'next/link';
import { AutoPlaySlider } from '@/components/Slider';
import slugify from 'slugify';

const BrowseCategories = ({ categories }) => {
  return (
    <div className="h-screen relative bg-gradient-to-b from-slate-900 via-slate-200 md:via-white   to-white   flex flex-col justify-center">
      {/* <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-t  from-transparent to-white"/> */}
      <h3 className="tracking-wider text-xl text-center uppercase font-[SangblueSans] my-3">
        Browse our categories
      </h3>
      {categories ? (
        <>
          <div className="flex justify-center">
            <div className="flex overflow-x-auto mx-2 md:mx-12  gap-4 md:gap-6 pb-12 pt-2">
              {categories &&
                categories.map((category, index) => {
                  return (
                    <Link
                      key={index}
                      href={`/collections?category=${slugify(category.name)}`}
                    >
                      <div className="h-65 relative w-56 border rounded-lg overflow-hidden flex-shrink-0  hover:shadow-lg">
                        <div className="absolute z-[100] inset-0 h-56 w-56  rounded-lg"></div>
                        <AutoPlaySlider
                          dataArray={category.images}
                          heightWidth="h-56 w-56 rounded-lg "
                          timer="10000"
                        />

                        <p className="uppercase pt-1 text-center hover:underline">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        // Skeleton _________________-
        <>
          <div className="flex justify-center">
            <div className=" flex overflow-x-auto mx-2 md:mx-12  gap-4 md:gap-6 pb-12 pt-2  ">
              {[1, 2, 3].map((p, index) => (
                <div
                  key={index}
                  className={`w-64 flex-shrink-0  rounded-lg p-2 transition-colors `}
                >
                  <div className="w-64 flex-shrink-0 animate-pulse  rounded-lg p-4 transition-colors bg-gradient-to-br from-gray-300 to-gray-100  h-64" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseCategories;
