import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useMemo } from 'react';
import { DataContext } from '@/store/globalstate';
import parse from 'html-react-parser';
import {
  DeliveryCar,
  Circle,
  Download,
  Share,
  Wishlist,
  Bullet,
  ChevronUp,
  ChevronDown,
} from '@/components/Icon';
import styles from './product.module.css';

import {
  getAllProducts as getData,
  getCoverImageUrl,
  mapToSliderImages,
  getThemeColor,
} from '@/utils/controller/productController';
import BrowseCollection from '@/components/BrowseCollection';
import { addToCart, getCount } from '@/utils/controller/cartController';
import ImageSlider from '@/components/product/ImageSlider';
import Variants from '@/components/product/Variants';
import VideoHero from '@/components/product/VideoHero';
import ShopView from '@/components/product/ShopView';
import ToastMessage from '@/components/Toast';
import slugify from 'slugify';

export const getStaticPaths = async () => {
  const products = await getData();
  // const slugLink = getSlugText(products);

  // const paths = [...slugLink].map((p) => ({ params: { slug: p.toString() } }));
  // console.log("products",products)
  const paths = products.map((p) => ({
    params: { slug: slugify(p.attributes.name.toString()) },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const products = await getData();

  // Cannot be fixed nextjs ki taraf se
  // const results = await getFilteredProducts({
  //   collectionName: 'products',
  //   attributeNames: ['name'],
  //   attributeValues: [params.slug],
  //   operator: '$containsi',
  // });
  // const originalValue = params.slug.replace(/-/g, " ");
  // console.log('.................❤️❤️❤️.........slugs', params, results);
  // console.log("Running Get static props")

  const product = products.find(
    (product) => slugify(product.attributes.name.toString()) === params.slug
  );

  return {
    props: {
      product,
      key: params.slug,
      revalidate: 0,
    },
  };
};

const Product = ({ product }) => {
  const theme = product.attributes.theme;
  const [showMore, setShowMore] = useState(false);
  const productHero = useMemo(() => product.attributes?.product_hero);
  const [showMore2, setShowMore2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [disableBuyButton, setDisableBuyButton] = useState(
    !product.attributes.inStock
  );
  // ////console.log(product)
  const { dispatch, state } = useContext(DataContext);
  const router = useRouter();

  //**____________________ OPEN VARIANTS POPUP ________________________________
  const [selectedColorID, setSelectedColorID] = useState(null);
  const [selectedSizeID, setSelectedSizeID] = useState(null);
  const _product = useMemo(() => product);
  const [openVariants, setOpenVariants] = useState(false);
  const [selectedVariantImage, setSelectedVariantImage] = useState(
    getCoverImageUrl(product)
  );
  // const [buttonName, setButtonName] = useState('Choose Variant');
  const [priceBasedOnVariants, setPriceBasedOnVariants] = useState(
    product.attributes.base_price
  );
  const [selectedVariantDetails, setSelectedVariantDetails] = useState(null);

  useEffect(() => {
    selectedVariantDetails
      ? setSelectedVariantImage(selectedVariantDetails.image)
      : null;
  }, [selectedVariantDetails]);

  //**************************************************************************************** */
  const mappedImages = mapToSliderImages(product.attributes.images.data);

  async function handleAddToCart(productVariant) {
    if (!product.attributes.inStock) {
      alert('Product is out of stock');
      return;
    }
    try {
      const addToCartResponse = await addToCart(productVariant);
      console.log("addToCartResponse",addToCartResponse)
      const count = getCount(addToCartResponse);
      dispatch({ type: 'SET_CART_ITEMS_COUNT', payload: count });
      dispatch({ type: 'RELOAD_CART' });
      let nameString = product.attributes.name;
      if (nameString.length > 50) {
        nameString = nameString.substring(0, 50) + '...';
      }
      // alert(`${product.attributes.name} added to cart`);
      ToastMessage({ type: 'success', message: `${nameString} added to cart` });
      router.push('/cart');
      setSelectedColorID(null);
      setSelectedSizeID(null);
    } catch (error) {
      ToastMessage({ type: 'error', message: `Failed to add to cart` });
    }
    setLoading(false);
  }

  // ? ______ product share link ______
  const handleShare = async () => {
    const shareableLink = `/product/${slugify(
      product.attributes.name.toString()
    )}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.attributes.name,
          text: 'Check out this product!',
          url: shareableLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(shareableLink);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      copyToClipboard(shareableLink);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Product URL copied to clipboard. You can share it manually.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  return (
    <>
      <Head>
        <title>{product.attributes.name}</title>
      </Head>
      <div
        className={`fixed bottom-4 right-1/2  w-11/12 translate-x-1/2 transform items-center  rounded-lg bg-white py-2 lg:py-4 px-2 shadow-lg md:right-4 md:w-[500px] md:translate-x-0   border border-black z-[100] ${styles.borderAnimation}`}
      >
        <div className="flex gap-2 ">
          <div className="relative rounded-lg h-24 w-24 flex-shrink-0  lg:h-28 lg:w-28">
            {selectedVariantImage && (
              <Image
                src={selectedVariantImage}
                alt={product.attributes.name}
                priority
                fill
                sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                className="h-full rounded-lg w-full object-fit"
              />
            )}
          </div>
          <div>
            <div className="mb-2">
              <h1
                className={`flex-grow  font-heading lg:text-xl font-medium tracking-wide text-gray-900 line-clamp-2 `}
              >
                {product.attributes.name}
              </h1>
              <div className="flex gap-3 items-center">
                <p className="text-xl  ">₹{priceBasedOnVariants}</p>
                {selectedVariantDetails?.size_and_price && (
                  <p className="  ">
                    <span className="text-sm text-gray-600">Size:</span>{' '}
                    {selectedVariantDetails.size_and_price.sizes}
                  </p>
                )}
                {selectedVariantDetails?.color && (
                  <p className="  ">
                    <span className="text-sm text-gray-600">Color:</span>{' '}
                    {selectedVariantDetails.color}
                  </p>
                )}
              </div>
              {product.attributes.inStock ? (
                <span className="animate-pulse rounded-full text-xs lg:text-base">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  In Stock{' '}
                  {product.attributes.stock_quantity < 10 && (
                    <span className="ml-1 text-xs">
                      only {product.attributes.stock_quantity} peice left
                    </span>
                  )}
                </span>
              ) : (
                <span className=" rounded-full text-xs lg:text-base text-gray-500">
                  <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mr-1"></span>
                  out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
        {openVariants && (
          <Variants
            product={_product}
            setOpenVariants={setOpenVariants}
            setPriceBasedOnVariants={setPriceBasedOnVariants}
            setSelectedVariantImage={setSelectedVariantImage}
            setSelectedVariantDetails={setSelectedVariantDetails}
            selectedColorID={selectedColorID}
            setSelectedColorID={setSelectedColorID}
            selectedSizeID={selectedSizeID}
            setSelectedSizeID={setSelectedSizeID}
          />
        )}
        <div className="md:text-right mr-1 flex gap-3">
          <button
            className={`rounded-full py-1 px-3 flex text-gray-900   border border-black bg-white lg:px-4 lg:py-2`}
            onClick={() => {
              setSelectedColorID(null);
              setSelectedSizeID(null);
              setOpenVariants((ov) => !ov);
            }}
          >
            Choose Color {openVariants ? <ChevronDown /> : <ChevronUp />}
          </button>
          {selectedVariantDetails && (
            <button
              className={`rounded-full bg-gray-900 hover:shadow-lg  px-4 py-1 text-white lg:px-4 lg:py-2 animate__animated animate__fadeIn animate__faster ${
                loading && 'hover:cursor-not-allowed'
              }`}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  handleAddToCart(selectedVariantDetails);
                }, 200);
              }}
              disabled={loading}
            >
              {loading ? 'Adding' : 'Add'} to cart
            </button>
          )}
        </div>
      </div>

      <section className="mt-16">
        <div className="relative ">
          <ImageSlider
            images={mappedImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            heightWidth="w-screen lg:h-screen h-[60vh]"
            imageCover="object-contain"
          />
        </div>
        {/* _____________________Wrapper Div __________________________ */}
        <div>
          {mappedImages.length > 1 && (
            <div className="flex justify-center">
              <div className="flex overflow-x-auto gap-3 mx-4">
                {mappedImages.map((image, index) => (
                  <div className="mx-3 my-4" key={image.url}>
                    <div
                      className={`flex-shrink-0 cursor-pointer hover:scale-[1.1] rounded p-2 border relative h-24 w-24 lg:h-28 lg:w-28 ${
                        selectedImage === index
                          ? 'border-2 border-black scale-[1.1]'
                          : ''
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image.url}
                        alt={product.attributes.name}
                        priority
                        fill
                        sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"
                        className="h-full w-full object-fit"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* _____________________________Details Container_________________________________ */}
            <div className=" container mx-auto px-2 md:px-10 md:col-span-2 md:pb-20  lg:pb-32">
              <div>
                <div className="items-center mx-1">
                  <h1
                    className={`${
                      product.attributes.name.length > 50
                        ? showMore2
                          ? ''
                          : 'line-clamp-2'
                        : ''
                    }  flex-grow mt-4 font-heading text-3xl font-medium tracking-wide text-gray-900 lg:mt-8 md:text-5xl`}
                  >
                    {product.attributes.name}
                  </h1>
                  {product.attributes.name.length > 50 && (
                    <button
                      onClick={() => setShowMore2((showMore) => !showMore)}
                      className="text-gray-600 underline"
                    >
                      {showMore2 ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div
                  className={`mt-4 md:mt-8 mb-1 max-w-prose text-xl font-light text-gray-600 lg:mb-2 lg:text-2xl ${
                    showMore ? '' : 'line-clamp-5'
                  }`}
                >
                  {parse(product.attributes.description)}
                </div>
                <button
                  onClick={() => setShowMore((showMore) => !showMore)}
                  className="text-gray-600 underline"
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </button>
              </div>
              <div className="mt-4 flex gap-4 overflow-x-auto ">
<div className="mx-1 mb-5 cursor-pointer rounded-full px-6 py-4 font-light text-gray-800 shadow hover:shadow-lg">
                  <button
                    className="flex gap-3 items-center justify-center"
                    onClick={handleShare}
                  >
                    <span className="h-6 w-6">
                      <Share />
                    </span>
                    <span className="uppercase text-gray-500">Share</span>
                  </button>
                </div>

              </div>
            </div>

            {/* ___________________________delivery container___________________________ */}
            <div className="container mx-auto flex max-w-[600px] flex-col gap-4 px-5  mt-4  my-12">
              {product.attributes?.shop?.data && (
                <ShopView shop={product.attributes.shop.data} />
              )}
              <div
                className={`flex flex-col gap-4 ${
                  !product.attributes?.shop?.data && 'mt-4'
                }`}
              >
                <div
                  className={`flex gap-3 px-2 py-2 rounded-lg
                ${getThemeColor(theme)}
                `}
                >
                  <span className="flex h-16  w-16 items-center font-light text-gray-600">
                    <DeliveryCar />
                  </span>
                  <h3 className=" flex items-center text-xl font-light text-gray-600 lg:mb-2 lg:text-2xl">
                    Shipping All over{' '}
                    <span className="text-black">&nbsp;Bhiwandi</span>
                  </h3>
                </div>

                <div
                  className={`flex gap-3 px-2 py-2 rounded-lg 
                ${getThemeColor(theme)}
                `}
                >
                  <span className="flex h-16 w-16 items-center font-light text-gray-600">
                    <Circle />
                  </span>
                  <h3 className=" flex items-center text-xl font-light text-gray-600 lg:mb-2 lg:text-2xl">
                    Open Box Delivery
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {productHero && (
            <VideoHero
              product_hero={productHero}
              category={product.attributes.category.data.attributes.name}
            />
          )}
        </div>
        <div className="my-64">
          <BrowseCollection currentProduct={product} />
        </div>
      </section>
    </>
  );
};

export default Product;
