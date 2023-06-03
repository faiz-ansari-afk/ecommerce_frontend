import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Avatar, Time, Share } from '@/components/Icon';
import SubscribeRequest from '@/components/Request/SubscribeRequest';
import CommentRequestCard from '@/components/Request/CommentRequestCard';
import { mapToSliderImages } from '@/utils/controller/productController';
import BrowseCollection from '@/components/BrowseCollection';
import ImageSlider from '@/components/product/ImageSlider';
import styles from '@/components/Request/RequestCard.module.css';
import Link from 'next/link';
import { getRequest } from '@/utils/controller/requestController';
import slugify from 'slugify';
import { getUser } from '@/utils/controller/auth';

export const getStaticPaths = async () => {
  // const requests = await getRequest({ filterBy: { all: true } });

  // if (!requests)  return {
  //   paths:[],
  //   fallback: "blocking",
  // };
  // const slugLink = requests.map((req) => slugify(req.attributes.name));
  // const paths = slugLink.map((p) => ({ params: { slug: p.toString() } }));
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx) => {
  const requests = await getRequest({ filterBy: { all: true } });

  const request =
    requests &&
    requests.find((req) => slugify(req.attributes.name) === ctx.params.slug);

  return {
    props: {
      request,
      key: ctx.params.slug,
      revalidate: 0,
    },
  };
};

const RequestSlug = ({ request }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser(null, null);
      if (userData) {
        setUser(userData);
      }
    }
    fetchUser();
  }, []);
  
  const router = useRouter();

  const mappedImages = mapToSliderImages(request.attributes.images.data);
  const handleShare = async () => {
    const shareableLink = `/request/${slugify(request.attributes.name)}`;
    const fullURL = window.location.origin + router.asPath;
    if (navigator.share) {
      try {
        await navigator.share({
          title: request.attributes.name,
          text: 'Check out this Request!',
          url: shareableLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(fullURL);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      copyToClipboard(fullURL);
    }
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Request URL copied to clipboard. You can share it manually.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  //   ?user profile showing logic
  const cardUser = request.attributes.requested_by.data.attributes;
  function getColor(status) {
    if (status === 'pending') {
      return {
        bg: 'bg-yellow-500',
        text: 'text-black',
        bg_div: 'bg-yellow-100',
      };
    } else if (status === 'approved') {
      return { bg: 'bg-blue-500', text: 'text-white', bg_div: 'bg-blue-100' };
    } else if (status === 'rejected') {
      return { bg: 'bg-rose-500', text: 'text-white', bg_div: 'bg-rose-100' };
    } else if (status === 'completed') {
      return { bg: 'bg-green-500', text: 'text-white', bg_div: 'bg-green-100' };
    } else {
      return {
        bg: 'bg-orange-500',
        text: 'text-black',
        bg_div: 'bg-orange-100',
      };
    }
  }
  const { bg, text } = getColor(request.attributes.status);
  const currentDate = new Date();
  const formattedDate = Date.parse(currentDate.toISOString().split('T')[0]);
  const availableDate = request.attributes.estimated
    ? Date.parse(request.attributes.estimated)
    : null;
  let daysRemaining = <Time />;
  if (availableDate) {
    const timeDiff = Math.abs(availableDate - formattedDate);
    daysRemaining = `${Math.ceil(timeDiff / (1000 * 3600 * 24))} days`;
  }

  const profilePicUrl = cardUser.profile_pic.data
    ? `${cardUser.profile_pic.data.attributes.url}`
    : 'USE_DEFAULT_PIC';

  // ? Getting Date when request is made
  const dateString = request.attributes.createdAt;
  const dateObj = new Date(dateString);

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const requestedDate = dateObj.toLocaleDateString('en-US', options);

  return (
    <>
      <Head>
        <title>{request.attributes.name}</title>
      </Head>

      <section className="container mx-auto border ">
        <div className="relative lg:h-screen h-[60vh]">
          <ImageSlider
            images={mappedImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            heightWidth="w-full lg:h-screen h-[60vh]"
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
                        alt={request.attributes.name}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:px-4">
            {/* _____________________________Details Container_________________________________ */}
            <div className=" container mx-auto px-2  md:col-span-2 md:pb-20  lg:pb-32">
              <div>
                <div className="items-center lg:mx-1">
                  <h1
                    className={`
                    
                     flex-grow bg-gray-200 rounded-lg px-2 py-3 mt-4 font-heading text-3xl font-medium tracking-wide text-gray-900  md:text-4xl lg:text-5xl`}
                  >
                    {request.attributes.name}
                  </h1>
                </div>
              </div>
              <div className="ml-1 my-3 flex  md:gap-5 gap-2 items-center  ">
                <div className="">
                  <div className="flex  gap-2 bg-gray-100 py-2 pl-2 pr-5 rounded-lg items-center">
                    <Avatar url={profilePicUrl} heightWidth="h-8 w-8" />
                    <div className="flex  flex-col justify-center">
                      <p className=" text-md text-gray-600" title="user">
                        {cardUser.username}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center ">
                  <div className=" text-right  cursor-pointer rounded-full px-6 py-4 font-light text-gray-800 shadow hover:shadow-lg">
                    <button
                      className="flex  h-4 w-4 items-center justify-center"
                      onClick={handleShare}
                    >
                      <Share />
                    </button>
                  </div>
                </div>
                {request.attributes.status === 'approved' && (
                  <div className=" flex  gap-2">
                    <SubscribeRequest
                      user={user}
                      requestedItem={request}
                      divStyle="bg-gray-100 rounded-lg px-2 py-1"
                    />
                  </div>
                )}
              </div>

              <p className=" text-md text-gray-600 pl-1 mb-2">
                Requested At: {requestedDate}
              </p>
              <div className="flex gap-5 items-center">
                <p
                  className={`${bg} ${text}  text-sm inline-block px-3 rounded-full`}
                >
                  status: {request.attributes.status}
                </p>
                {request.attributes.status === 'approved' && (
                  <p className="text-sm text-gray-500 flex gap-1">
                    <span className="inline-block ">Available in:</span>
                    <span className="inline-block text-black">
                      {daysRemaining}
                    </span>
                  </p>
                )}
              </div>

              {request.attributes.custom_message && (
                <p className="text-sm text-gray-500 mt-2 pl-1">
                  Update: {request.attributes.custom_message}
                </p>
              )}
              {request.attributes.link && (
                <div>
                  <div
                    className={`text-sm mt-1 inline-block px-3 rounded-full hover:shadow-lg ${styles.animateColors}`}
                  >
                    <Link href={request.attributes.link} className={``}>
                      Go to product page
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ___________________________Comment container___________________________ */}
            <div className="container mx-auto flex  flex-col gap-4 px-2  mt-4  my-12">
              <CommentRequestCard request={request} user={user} />
            </div>
          </div>
        </div>
        <div className="my-64">
          <BrowseCollection />
        </div>
      </section>
    </>
  );
};

export default RequestSlug;
