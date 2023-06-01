import Link from 'next/link';
import {
  getCoverImageUrl,
  getSlugText,
} from '@/utils/controller/productController';
import Image from 'next/image';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const SearchList = ({ searchedProducts, queryParam }) => {
  // ////////console.log('searched products', searchedProducts);

  if (searchedProducts === null)
    return (
      // skeleton
      <ul className="mt-5 animate-pulse space-y-3">
        {/* <li className="h-12 w-full rounded-md bg-gray-500 "></li>
        <li className="h-12 w-full rounded-md bg-gray-500 "></li>
        <li className="h-12 w-full rounded-md bg-gray-500 "></li>
        <li className="h-12 w-full rounded-md bg-gray-500 "></li>
        <li className="h-3 ml-3  rounded-md bg-gray-500 "></li> */}
        <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/private_files/lf30_jo7huq2d.json"
          style={{ height: '300px', width: '300px' }}
        ></Player>
      </ul>
    );
  if (searchedProducts.length === 0)
    return (
      <div>
        <div className="">
          <p className="mt-4">No product found</p>
        </div>
        <div className="mt-4">
          <Link
            href={`/search?category=All-Categories&query=${queryParam}`}
            className="my-4 underline underline-offset-2 text-right"
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
    <ul className="">
      {_searchedProducts.map((product) => (
        <li className="" key={product.id}>
          <Link
            href={`/product/${getSlugText([product])}`}
            className="my-4  text-left grid grid-cols-5 gap-2"
          >
            <div className="relative h-12 w-12 col-span-1 ">
              <Image
                src={getCoverImageUrl(product)}
                alt={product.attributes.name}
                priority
                fill
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="hover:underline line-clamp-2 col-span-4">
              {product.attributes.name}
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={`/search?category=All-Categories&searchQuery=${queryParam}`}
          className="my-4 underline underline-offset-2 text-right"
        >
          See more
        </Link>
      </li>
    </ul>
  );
};

export default SearchList;
