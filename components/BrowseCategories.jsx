import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AutoPlaySlider } from '@/components/Slider';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import slugify from 'slugify';

const BrowseCategories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(
    () => async () => {
      const categoriesDetails = await mapToModelViewCategory();
      setCategories(() => categoriesDetails);
    },
    []
  );

  return (
    <div className="my-12 mx-2">
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
                      href={`/collections?category=${slugify(category.name)}`}
                      key={index}
                    >
                      <div className="h-65 w-56 border rounded-lg flex-shrink-0 cursor-pointer hover:shadow-lg">
                        <AutoPlaySlider
                          dataArray={category.images}
                          heightWidth="h-56 w-56"
                        />

                        <p className="uppercase pt-1 text-center">
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
          {[1,2,3,4,5,6].map((product, index) => (
                  <div
                  key={index}
                    className={`w-64 flex-shrink-0  rounded-lg p-2 transition-colors `}
                  >
                    <div
                
                className="w-64 flex-shrink-0 animate-pulse   rounded rounded-lg p-4 transition-colors bg-gradient-to-br from-gray-300 to-gray-100  h-64"
              />
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
