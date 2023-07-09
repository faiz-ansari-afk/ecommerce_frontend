import { useState, useEffect } from 'react';

const ShippingDetails = ({
  user,
  userAddressData,
  setIsAddressFilled,
  setContinueToPayment = false,
  continueToPayment,
  accountFlag = false,
}) => {
  //////console.log("shipping details",userAddressData)
  // const {details,address} = userAddressData
  const [address, setAddress] = useState(null);
  const [details, setDetails] = useState(null);
  // const [userData,setUserData] = useState(null);
  useEffect(() => {
    if (userAddressData) {
      setAddress(userAddressData.address);
      setDetails(userAddressData.details);
    }
    if (user) {
      setAddress(user.user_data.address);
      setDetails(user.user_data.details);
    }
  }, [userAddressData]);
  return (
    <div className={`${accountFlag ? '' : 'mt-12'}`}>
      <h2
        className={`${
          accountFlag ? 'text-md mb-2' : 'text-3xl mb-12'
        }   text-gray-500`}
      >
        Delivery Address
      </h2>
      {!accountFlag && <h5 className="pb-2 text-sm text-gray-500">Deliver to</h5>}
      <ul className="font-[SangbleuSans] text-sm text-gray-900">
        {details && address && (
          <>
            <li>{details.name}</li>
            <li>{details.phoneNumber}</li>
            <li>{address.address}</li>
            <li>
              {address.pincode} &nbsp;&nbsp; {address.city}
            </li>
            <li>{address.state}</li>
            <li>{address.country}</li>
          </>
        )}
      </ul>

      <button
        className="my-6 underline underline-offset-4"
        onClick={() => {
          if (setContinueToPayment) {
            setContinueToPayment(false);
          }
          setIsAddressFilled(false);
        }}
      >
        Edit
      </button>
    </div>
  );
};

export default ShippingDetails;
