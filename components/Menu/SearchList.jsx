import Link from 'next/link';
import {
  getCoverImageUrl,
  getSlugText,
} from '@/utils/controller/productController';
import Image from 'next/image';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const SearchList = ({ searchedProducts, queryParam }) => {
  

  // if (true)
  if (searchedProducts === null)
    return (
      // skeleton
      <ul className=" px-2 space-y-3 pb-2 animate__animated animate__fadeIn">
        {[1,2,3].map(ind=>(
        <li className="flex gap-2 mb-2" key={ind}>
          <div className="h-12 w-12 bg-gray-500 rounded"></div>
          <div className="grow  ">
            <div className="h-2 w-full  rounded bg-gradient-to-r from-gray-500 to-gray-300  mb-3"></div>
            <div className="h-2 w-32  rounded bg-gradient-to-r from-gray-500 to-gray-300 "></div>
          </div>
        </li>

        ))}
        {/* <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/private_files/lf30_jo7huq2d.json"
          style={{ height: '300px', width: '300px' }}
        ></Player> */}
      </ul>
    );
    // if(true)
    if (searchedProducts.length === 0)
    return (
        <div className="mt-4 text-center ">
        <div className="animate__animated animate__fadeIn mb-3">
        <div className="">
          <p className="mt-4 text-gray-300 text-center">No product found</p>
        </div>
          <Link
            href={`/search?category=All-Categories&query=${queryParam}`}
            className="my-4 underline underline-offset-2 text-right text-gray-300 "
          >
            Go to Advance Search
          </Link>
        </div>
      </div>
    );
  let _searchedProducts = searchedProducts;

  if (searchedProducts.length > 5)
    _searchedProducts = searchedProducts.splice(0, 5);

  return (
    <ul className="animate__animated animate__fadeIn text-gray-300 pb-2 shadow-lg">
      {_searchedProducts.map((product) => (
        <li  key={product.id} className='px-2'>
          <Link
            href={`/product/${getSlugText([product])}`}
            className="my-4  text-left flex gap-1"
          >
            <div className="relative h-12 w-12 flex-shrink-0 ">
              <Image
                src={getCoverImageUrl(product)}
                alt={product.attributes.name}
                priority
                fill
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                className="h-full w-full object-cover rounded"
              />
            </div>
            <span className="hover:underline line-clamp-2 grow ">
              {product.attributes.name}
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={`/search?category=All-Categories&searchQuery=${queryParam}`}
          className="my-2 underline underline-offset-2 flex justify-center"
        >
          See more
        </Link>
      </li>
    </ul>
  );
};

export default SearchList;
