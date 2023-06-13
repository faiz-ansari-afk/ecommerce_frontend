import CheckoutSummary from '@/components/Checkout/CheckoutSummary';
import { useEffect, useState } from 'react';
import { searchUserInDatabase } from '@/utils/controller/auth';
import { updateOrderStatus } from '@/utils/controller/orderController';
import { useRouter } from 'next/router';

import Select from 'react-select';
import ToastMessage from '@/components/Toast';
import moment from 'moment/moment';
import InputField from '@/components/FormComponent/InputField';

const EditOrders = ({ currentOrderData: order, setOpen }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderStatus: order.attributes.status,
    deliveryGuy: order.attributes.delivery_guy_details.data?.id || null,
    deliveryDate: order.attributes.expected_delivery_date || '',
    customMessage: '',
    paymentStatus: order.attributes.payment,
  });
  const [initialFormData, setInitialFormData] = useState({
    orderStatus: order.attributes.status || null,
    deliveryGuy: order.attributes.delivery_guy_details.data?.id || null,
    deliveryDate: order.attributes.expected_delivery_date || '',
    customMessage: '',
    paymentStatus: order.attributes.payment || null,
  });
  const detectObjectChange = (obj1, obj2) => {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, objects are not equal
    if (keys1.length !== keys2.length) {
      return true;
    }

    // Compare the values of each key in both objects
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    // All keys and values are equal, objects are equal
    return false;
  };

  // ? _____________________ Delivery User Dropdown Logic ___________________

  const [deliveryUsers, setDeliveryUsers] = useState(null);
  useEffect(() => {
    const fetchDeliveryUsers = async () => {
      const users = await searchUserInDatabase({
        field: 'local_role',
        value: 'delivery',
      });
      const selectUserView = users?.map((user) => {
        const obj = {
          label: user.username,
          value: user.id,
        };
        return obj;
      });
      setDeliveryUsers(selectUserView);
    };
    fetchDeliveryUsers();
  }, []);
  const deliveryGuyFlag = order.attributes.delivery_guy_details.data;

  // ?____________________________________ Order Status Dropdown Logic ______________________
  const statusList = [
    { value: 'ordered', label: 'ordered' },
    { value: 'out for delivery', label: 'out for delivery' },
    { value: 'completed', label: 'completed' },
    { value: 'cancelled', label: 'cancelled' },
  ];
  const indexOfStatus = statusList.findIndex(
    (status) => order.attributes.status === status.value
  );
  // ?____________________________________ Payment Status Dropdown Logic ______________________
  const paymentStatusList = [
    { value: 'paid', label: 'paid' },
    { value: 'unpaid', label: 'unpaid' },
  ];
  const indexOfPayment = paymentStatusList.findIndex(
    (pstatus) => order.attributes.payment === pstatus.value
  );

  // ?___________________ DElivery date logic_____________________________
  const today = new Date().toISOString().split('T')[0];
  const [openDeliveryField, setOpenDeliveryField] = useState(
    deliveryGuyFlag ? false : true
  );
  // *___________________ Notify User ____________________-
  const [notifyUser, setNotifyUser] = useState(`${order.attributes.notify}`);

  const handleNotifyChange = (event) => {
    setNotifyUser(event.target.value);
  };
  const [updating, setUpdating] = useState(false);
  const [errorData, setErrorData] = useState({
    deliveryGuyError: null,
    deliveryDateError: null,
    paymentError: null,
    customMessageError: null,
  });

  const handleOrderUpdates = async () => {
    let dataToSend = {
      status: formData.orderStatus,
    };
    // custom mesage will be optional
    //update order if any of the field is changed
    const detectChange = detectObjectChange(formData, initialFormData);
    if (!detectChange) {
      return;
    }
    if (formData.orderStatus === 'out for delivery') {
      if (!formData.deliveryGuy) {
        console.log('Fix error');
        setErrorData((ov) => ({
          ...ov,
          deliveryGuyError: 'Delivery Assign kr bhai',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, deliveryGuyError: null }));
      if (!formData.deliveryDate) {
        console.log('Fix error');
        setErrorData((ov) => ({
          ...ov,
          deliveryDateError: 'Kab delivery hogi wo bhi Assign kr bhai',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, deliveryDateError: null }));
      dataToSend = {
        status: formData.orderStatus,
        delivery_guy_details: formData.deliveryGuy,
        expected_delivery_date: formData.deliveryDate,
      };
      // if(formData.paymentStatus === 'paid'){
      //   console.log("in payment paid")
      //   setErrorData(ov=>({...ov,paymentError:'Delivery ke begair payment ho gayi?'}));
      //   return;
      // }
      // setErrorData(ov=>({...ov,paymentError:null}));
    }

    if (formData.customMessage) {
      if (formData.customMessage.length < 20) {
        setErrorData((ov) => ({
          ...ov,
          customMessageError: 'Kuch acha message likh lamba sa..',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, customMessageError: null }));
      dataToSend = {
        status: formData.orderStatus,
        delivery_guy_details: formData.deliveryGuy,
        expected_delivery_date: formData.deliveryDate,
        customMessage: formData.customMessage,
      };
    }
    console.log('Data to send', dataToSend);
    setUpdating(true);

    const updateResponse = await updateOrderStatus({
      dataToUpdate: {
        ...dataToSend,
      },
      orderID: order.id,
    });
    setUpdating(false);
    if (updateResponse) {
      ToastMessage({
        type: 'success',
        message: `Order no ${order.id} updated.`,
      });
      router.reload();
    } else {
      ToastMessage({
        type: 'error',
        message: `Something Went Wrong.`,
      });
    }
    console.log('updateResponse', updateResponse);
  };

  return (
    <div className="overflow-y-auto mb-32 mx-2 md:mx-6 h-full px-1">
      <div className="flex  my-3 md:my-6 items-center justify-between ">
        <p className="text-xl">
          Order No: <span className="text-5xl">{order.id}</span>
        </p>
        <button
          className="px-3 py-1 rounded-lg border hover:shadow-md"
          onClick={() => setOpen(false)}
        >
          x
        </button>
      </div>
      <p className="px-2 py-1 bg-gray-100 rounded-lg my-4 flex justify-between flex-col md:flex-row md:items-center">
        {' '}
        <span>Ordered At: {moment(order.attributes.createdAt).fromNow()}</span>
        <span className="text-xs">{order.attributes.order_id}</span>
      </p>
      <details open>
        <summary>Delivery Details</summary>
        <div className="lg:flex gap-5">
          <div className=" lg:w-1/2">
            <p className="text-xl">Items:</p>
            <div className="bg-gray-100 p-3 rounded-lg shadow-lg">
              <CheckoutSummary
                cart={order.attributes.cart.data}
                adminFlag={true}
              />
            </div>
          </div>

          <div className=" flex-col gap-5 flex my-6 lg:my-0">
            <div className="">
              <p className="text-xl text-gray-600">Details:</p>
              <p className="bg-lime-200 rounded-lg p-3 font-sans max-w-sm">
                {order.attributes.address.details.name} &nbsp; &nbsp; &nbsp;{' '}
                {order.attributes.address.details.phoneNumber}
              </p>
            </div>
            <div className="">
              <p className="text-xl text-gray-600">Address:</p>
              <p className="bg-indigo-200 rounded-lg p-3  max-w-md">
                {order.attributes.address.address.address},{' '}
                {order.attributes.address.address.city}
              </p>
            </div>
            {order.attributes.address.address.note && (
              <div className="">
                <p className="text-xl text-gray-600">Note:</p>
                <p className="">{order.attributes.address.address.note}</p>
              </div>
            )}
            <div className="">
              <p className="text-xl text-gray-600">Login Details:</p>
              <p className="text-sm">
                Username:{' '}
                {order.attributes.users_permissions_user.data
                  ? order.attributes.users_permissions_user.data.attributes
                      .username
                  : 'Null'}
              </p>
              <p className="text-sm">
                {' '}
                Email:{' '}
                {order.attributes.users_permissions_user.data.attributes.email}
              </p>
            </div>
          </div>
        </div>
      </details>
      <div className=" my-6 ">
        {/* <div className="bg-rose-900 text-white p-3 rounded-lg inline-block">
          <p className="mb-2">Notify user about this change via SMS</p>
          <label className="mr-4">
            <input
              type="radio"
              name="option"
              value="true"
              checked={notifyUser === 'true'}
              onChange={handleNotifyChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="false"
              checked={notifyUser === 'false'}
              onChange={handleNotifyChange}
            />
            No
          </label>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="statusContainer ">
            <p>Order Status</p>
            <Select
              instanceId={'status list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, orderStatus: option.label }))
              }
              isDisabled={order.attributes.status === 'completed'}
              options={statusList}
              defaultValue={statusList[indexOfStatus]}
            />
          </div>
          <div className="flex justify-center flex-col ">
            <p>Delivery Guy:</p>
            {deliveryGuyFlag && (
              <div className="text-sm bg-gray-100 p-3 rounded-lg mb-4">
                <p className="flex justify-between">
                  <span>{deliveryGuyFlag.attributes.username}</span>
                  <button
                    className="underline"
                    onClick={() => setOpenDeliveryField((ov) => !ov)}
                  >
                    {openDeliveryField ? 'close' : 'Change'}
                  </button>
                </p>
                <p>{deliveryGuyFlag.attributes.email}</p>
                <p>
                  Contact:{' '}
                  {deliveryGuyFlag.attributes.contact
                    ? deliveryGuyFlag.attributes.contact
                    : 'Not available'}
                </p>
              </div>
            )}
            {openDeliveryField && (
              <div>
                <Select
                  instanceId={'delivery guy list'}
                  onChange={(option) =>
                    setFormData((ov) => ({ ...ov, deliveryGuy: option.value }))
                  }
                  // isDisabled={isDisabled}
                  isLoading={deliveryUsers ? false : true}
                  isDisabled={deliveryUsers ? false : true}
                  options={deliveryUsers}
                />
                {errorData.deliveryGuyError && (
                  <p className="text-sm my-1 pl-1 text-rose-600">
                    {errorData.deliveryGuyError}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className=" ">
            <p>Delivery Date:</p>
            <input
              className="bg-gray-50 border text-gray-900 text-sm px-2 py-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              type="date"
              value={formData.deliveryDate}
              min={today}
              onChange={(date) => {
                const formattedDate = new Date(date.target.value)
                  .toISOString()
                  .split('T')[0];
                // const dateString = new Date(
                //   date.target.value
                // ).toLocaleDateString();
                setFormData((ov) => ({ ...ov, deliveryDate: formattedDate }));
              }}
            />
            {errorData.deliveryDateError && (
              <p className="text-sm my-1 pl-1 text-rose-600">
                {errorData.deliveryDateError}
              </p>
            )}
          </div>
          {/* <div className=" ">
            <p>Payment Status:</p>
            <Select
              instanceId={'paymentStatus list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, paymentStatus: option.value }))
              }
              options={paymentStatusList}
              defaultValue={paymentStatusList[indexOfPayment]}
              />
              {errorData.paymentError && <p className='text-sm my-1 pl-1 text-rose-600'>{errorData.paymentError}</p>}
          </div> */}
          <div className=" ">
            <p>Add Custom Message:</p>
            <InputField
              type="text"
              name="Custom Message"
              required={true}
              error={errorData.customMessageError}
              onchange={(e) => {
                setFormData((ov) => {
                  return {
                    ...ov,
                    customMessage: e.target.value,
                  };
                });
              }}
              value={formData.customMessage}
            >
              Custom Message
            </InputField>
          </div>
        </div>
        <button
          onClick={handleOrderUpdates}
          disabled={updating}
          className="my-5 px-5 py-2 bg-black rounded-full hover:shadow-lg text-white"
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditOrders;
