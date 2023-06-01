import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import slugify from 'slugify';
import { AutoPlaySlider } from '@/components/Slider';
import { Avatar, Time } from '@/components/Icon';
import SubscribeRequest from '@/components/Request/SubscribeRequest';
import EditAndDelete from '@/components/Request/EditAndDelete';
import styles from './RequestCard.module.css';

const RequestCard = ({
  requestedData,
  user,
  accountFlag = false,
  myRequestedItems,
  setMyRequestedItems,
}) => {
  const imagesToSendToSlider = requestedData.attributes.images.data.map(
    (img) => ({
      url: `${img.attributes.url}`,
      altText: img.attributes.name,
    })
  );

  const cardUser = requestedData.attributes.requested_by.data.attributes;
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
  const { bg, text, bg_div } = getColor(requestedData.attributes.status);

  const subscribersCount = requestedData.attributes.subscribers
    ? requestedData.attributes.subscribers.users.length
    : 0;

  // ? Getting Date when request is made
  const dateString = requestedData.attributes.createdAt;
  const dateObj = new Date(dateString);

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const requestedDate = dateObj.toLocaleDateString('en-US', options);

  // Avilable in ? days
  const currentDate = new Date();
  const formattedDate = Date.parse(currentDate.toISOString().split('T')[0]);
  const availableDate = requestedData.attributes.estimated
    ? Date.parse(requestedData.attributes.estimated)
    : null;
  let daysRemaining = <Time />;
  if (availableDate) {
    const timeDiff = Math.abs(availableDate - formattedDate);
    const daysCalc = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysCalc > 0) daysRemaining = `${daysCalc} days`;
    else daysRemaining = <Time />;
  }

  const profilePicUrl = cardUser.profile_pic.data
    ? `${cardUser.profile_pic.data.attributes.url}`
    : 'USE_DEFAULT_PIC';
  return (
    <div
      className={`w-full flex-shrink-0 border rounded-lg  transition-colors hover:shadow-lg ${
        requestedData.attributes.status === 'rejected' && bg_div
      }`}
    >
      <div className=" relative h-64 w-full md:h-64 lg:h-64">
        <AutoPlaySlider
          dataArray={imagesToSendToSlider}
          heightWidth="h-64 w-full"
          scoreBoard={true}
        />
      </div>
      <div className="px-2 py-3">
        <h3 className=" truncate hover:underline pl-3 font-light bg-gray-100 rounded-lg  mb-1 py-1 text-gray-700 text-lg">
          <Link href={`/request/${slugify(requestedData.attributes.name)}`}>
            {requestedData.attributes.name}
          </Link>
        </h3>

        {!accountFlag && (
          <div className="py-1 flex items-center justify-between  gap-2">
            <div className="flex gap-2 bg-gray-100 p-1 pr-2 rounded-lg items-center">
              <Avatar url={profilePicUrl} heightWidth="h-8 w-8" />
              <div className="flex  flex-col justify-center">
                <p className=" text-sm text-gray-600" title="user">
                  {cardUser.username}
                </p>
              </div>
            </div>

            {requestedData.attributes.status === 'approved' && (
              <div className="">
                <SubscribeRequest
                  user={user}
                  requestedItem={requestedData}
                  divStyle="bg-gray-100 px-2 py-1 rounded-lg"
                  buttonStyle="p-1"
                />
              </div>
            )}
          </div>
        )}
        <p className=" text-xs text-gray-600 pl-1 mb-1 " title="user">
          Requested At: {requestedDate}
        </p>
        <div className="flex justify-between items-center">
          <p
            className={`${bg} ${text}  text-sm inline-block px-3 rounded-full`}
          >
            status: {requestedData.attributes.status}
          </p>
          {requestedData.attributes.status === 'approved' && (
            <p className="text-sm text-gray-500 flex gap-1">
              <span className="inline-block ">Estimated:</span>
              <span className="inline-block text-black">{daysRemaining}</span>
            </p>
          )}
        </div>

        {requestedData.attributes.custom_message && (
          <p className="text-sm text-gray-500 mt-2 pl-1">
            Update: {requestedData.attributes.custom_message}
          </p>
        )}
        {requestedData.attributes.link && (
          <div>
            <div
              className={`text-sm mt-1 inline-block px-3 rounded-full hover:shadow-lg ${styles.animateColors}`}
            >
              <Link href={requestedData.attributes.link} className={``}>
                Go to product page
              </Link>
            </div>
          </div>
        )}
        {accountFlag && (
          <div className="pt-1 ">
            <EditAndDelete requestedData={requestedData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
