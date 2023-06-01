import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Plus, Minus, Warning } from '@/components/Icon';
import { Bullet } from '@/components/Icon';
import RequestForm from '@/components/Request/RequestForm';
import RequestCard from '@/components/Request/RequestCard';

const MyRequests = ({ user, myRequestedItems:_myRequestedItems }) => {
  const [myRequestedItems,setMyRequestedItems] = useState(_myRequestedItems)
  // console.log('myRequestedItems', myRequestedItems);
  const scrollRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);

  return (
    <div>
      <div className="mb-32 pt-12">
        <p className="text-left   mb-4">
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
        <div ref={scrollRef}>
          {openForm && (
            <div className="flex">
              <div className="w-[550px] bg-gray-200 p-2 md:p-6 rounded-lg  ">
                <RequestForm user={user} setOpenForm={setOpenForm} />
              </div>
            </div>
          )}
        </div>

        <hr className="my-6" />
        {myRequestedItems && myRequestedItems.length > 0 ? (
          <div>
            <p className="inline-block bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg mb-3">
              <span className="flex gap-2">
                <Warning />
                You can only edit request that is pending!
              </span>
            </p>
            <div className="grid grid-cols-1 gap-10  lg:grid-cols-3 md:grid-cols-2">
              {myRequestedItems.map((requestedData, index) => (
                <RequestCard
                  requestedData={requestedData}
                  key={index}
                  user={user}
                  accountFlag={true}
                  myRequestedItems={myRequestedItems}
                  setMyRequestedItems={setMyRequestedItems}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className=" flex justify-center md:justify-start">
            <div className=" mt-12 mb-32 bg-gray-100 rounded-lg inline-block p-6">
              <h3 className="mb-4  text-4xl font-light tracking-wide text-gray-800 lg:text-6xl "></h3>
              <h4 className="text-xl tracking-wide text-gray-600">
                You have made no requests yet. <br />
                Take a look at our requests page!
              </h4>
              <Link href="/request">
                <div className="mt-12">
                  <button className="button-transition flex w-max items-center justify-start text-xl ">
                    <span className="h-4 w-4">
                      <Bullet />
                    </span>
                    Go to requests page
                  </button>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
