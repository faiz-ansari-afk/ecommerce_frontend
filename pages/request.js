import { getUser } from '@/utils/controller/auth';
import { useState, useRef, useEffect, useMemo } from 'react';
import Head from 'next/head';
import RequestForm from '@/components/Request/RequestForm';
import { Plus, Minus } from '@/components/Icon';
import { getRequest } from '@/utils/controller/requestController';
import RequestCard from '@/components/Request/RequestCard';
import SearchBar from '@/components/Shops/SearchBar';
import Link from 'next/link';

const request = ({ requestedItem: _requestedItem, user }) => {
  const [requestedItem, setRequestedItem] = useState(_requestedItem);
  console.log("requestedItem",_requestedItem)
  // const [sortBy, setSortBy] = useState('All');
  // const requestedItemMemo = useMemo(() => requestedItem);
  const scrollRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  //
  // useEffect(() => {
  //   //clone og array
  //   const cloneArray = structuredClone(requestedItem)
  //   const status = sortBy.toLowerCase(requestedItem);

  //   if (sortBy !== 'All') {
  //     const sortedArray = cloneArray.filter((req) => req.attributes.status === status);
  //     setRequestedItem(sortedArray);
  //   }else{
  //     setRequestedItem(_requestedItem);
  //   }
  // }, [sortBy]);
  return (
    <>
      <Head>
        <title>Request to add - Ijazat</title>
        <meta
          name="description"
          content={`you can request your favourite to be added on website.`}
        />
      </Head>

      <main className="py-20 px-5 lg:py-32 lg:px-10 ">
        {/* **************** Heading tab ************************ */}
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-medium italic tracking-wide text-gray-900 lg:mb-8 lg:text-7xl `}
          >
            Request
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl">
            Share your favorite products and shops to be featured on our
            website. Submit your recommendations and help us create a valuable
            resource for our{' '}
            <span className="text-black font-bold ">Bhiwandi</span> ki public.
          </p>
        </div>
        <div className="  mt-12 container mx-auto">
          {/* ******************* Button and form wrapper ******************** */}

          <div className="">
            {/* <div className="my-5 max-w-3xl mx-auto ">
              <SearchBar
                dataSets={requestedItem}
                results={requestedItem}
                setResults={setRequestedItem}
                ofWhich="PRODUCTS"
                placeholder={`Search all request`}
              />
            </div> */}
            <div className="___button-wrapper___ ">
              <p className="text-right lg:mx-8 mx-2">
                <button
                  className="rounded-lg bg-black hover:shadow-lg px-3 py-2 text-white"
                  onClick={() => {
                    setOpenForm((ov) => !ov);
                    const scrollToHeight = () => {
                      const height = scrollRef.current.offsetTop;
                      window.scrollTo({
                        top: height,
                        behavior: 'smooth',
                      });
                    };
                    if (!openForm) {
                      scrollToHeight();
                    } else {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className=" w-4 h-4 flex justify-center items-center">
                      {openForm ? <Minus /> : <Plus />}
                    </span>
                    New Request
                  </span>
                </button>
              </p>
            </div>
            <div className=" flex flex-col items-center" ref={scrollRef}>
              {openForm && (
                <div className="md:w-2/3 lg:w-1/2 md:px-6 py-6 my-6 bg-gray-100 rounded-lg  ">
                  <RequestForm user={user} setOpenForm={setOpenForm} />
                </div>
              )}
            </div>
          </div>

          <section className="mb-32 mt-8 ">
            {/* sorting logic not working */}
            {/* {requestedItem.length > 0 && (
              <div className="flex justify-center gap-2 items-center ">
                <p className="">Sort By:</p>
                <button
                  className={`border  rounded-full px-3 ${
                    sortBy === 'All' ? 'bg-black text-white' : 'text-black'
                  } `}
                  onClick={() => {
                    setSortBy('All');
                  }}
                >
                  All
                </button>
                <button
                  className={`border  rounded-full px-3 ${
                    sortBy === 'Approved' ? 'bg-black text-white' : 'text-black'
                  } `}
                  onClick={() => {
                    setSortBy('Approved');
                  }}
                >
                  Approved
                </button>
                <button
                  className={`border  rounded-full px-3 ${
                    sortBy === 'Completed'
                      ? 'bg-black text-white'
                      : 'text-black'
                  } `}
                  onClick={() => {
                    setSortBy('Completed');
                  }}
                >
                  Completed
                </button>
              </div>
            )} */}
            <hr className="mb-6 mt-3" />
            {user && (
              <p className="mb-3 px-2 py-3 bg-gray-100 rounded-lg inline-block">
                <Link href="/account/my-requests">
                  <button className="underline">Click here</button>
                </Link>{' '}
                to know the request you have made.
              </p>
            )}
            {requestedItem && requestedItem.length > 0 ? (
              <div className="grid grid-cols-1 gap-5  lg:grid-cols-3 md:grid-cols-3 ">
                {requestedItem.map((requestedData, index) => (
                  <RequestCard
                    requestedData={requestedData}
                    key={index}
                    user={user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center">
                No request is made till now. Create New
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default request;
export async function getServerSideProps(context) {
  const getAllRequestedItems = await getRequest({
    data: null,
    ctx: context,
    method: 'get',
  });
  const user = await getUser(null, context);
  if(getAllRequestedItems)
  return {
    props: {
      requestedItem:  getAllRequestedItems,
      user,
    },
  };
  else
  return {
    props: {
      requestedItem: null,
      user,
    },
  };
}
