import Link from 'next/link';
import React from 'react';

const RequestSummary = ({ requests }) => {
  let pendingRequestCount = 0;
  let completedRequestCount = 0;
  let approvedRequestCount = 0;
  requests.forEach((order) => {
    if (order.attributes.status === 'completed') completedRequestCount++;
    if (order.attributes.status === 'pending') pendingRequestCount++;
    if (order.attributes.status === 'approved') approvedRequestCount++;
  });
  return (
    <div>
              <Link href="/admin/requests">
      <p className="text-3xl mb-4 mt-12 cursor-pointer">Requests summary</p>
              </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="max-w-sm flex-shrink-0 ">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-2xl text-black mb-1 md:mb-4 text-center">
              Pending Requests
            </h1>
            <p className="text-black mb-6 text-6xl text-center">{pendingRequestCount}</p>
              
          </div>
        </div>

        <div className="max-w-sm flex-shrink-0">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-fuchsia-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-2xl text-black mb-1 md:mb-4 text-center">
              Approved Requests
            </h1>
            <p className="text-black mb-6 text-6xl text-center">{approvedRequestCount}</p>
          </div>
        </div>

        <div className="max-w-sm flex-shrink-0">
          <div className="relative rounded-lg p-4 md:p-8 shadow-lg backdrop-filter backdrop-blur-lg backdrop-brightness-75 backdrop-saturate-150">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-lime-500 to-lime-100 opacity-50 -z-[999] rounded-lg`}
            ></div>
            <h1 className="text-2xl text-black mb-1 md:mb-4 text-center">
              Completed Requests
            </h1>
            <p className="text-black mb-6 text-6xl text-center">{completedRequestCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSummary;
