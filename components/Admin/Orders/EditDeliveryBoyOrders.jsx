import CheckoutSummary from '@/components/Checkout/CheckoutSummary';
import { useEffect, useState } from 'react';
import { searchUserInDatabase } from '@/utils/controller/auth';
import { updateOrderStatus } from '@/utils/controller/orderController';
import { useRouter } from 'next/router';

import Select from 'react-select';
import ToastMessage from '@/components/Toast';
import moment from 'moment/moment';
import InputField from '@/components/FormComponent/InputField';
import { Warning } from '@/components/Icon';

const EditOrders = ({ currentOrderData: order, setOpen }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderStatus: order.attributes.status,
    customMessage: order.attributes.customMessage || '',
    paymentDetail: order.attributes.payment_details || '',
    paymentStatus: order.attributes.payment,
  });
  const initialFormData = {
    orderStatus: order.attributes.status,
    customMessage: order.attributes.customMessage || '',
    paymentStatus: order.attributes.payment,
    paymentDetail: order.attributes.payment_details || '',
  };
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

  // ?____________________________________ Order Status Dropdown Logic ______________________
  const statusList = [
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

  const paymentDetailsList = [
    { value: 'cash', label: 'cash' },
    { value: 'online', label: 'online' },
  ];
  const indexOfPaymentDetail = paymentDetailsList.findIndex(
    (pstatus) => order.attributes.payment_details === pstatus.value
  );

  const [updating, setUpdating] = useState(false);
  const [errorData, setErrorData] = useState({
    paymentStatusError: null,
    paymentDetailError: null,
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
    // #TODO: Add validation
    /*
    orderStatus: order.attributes.status,
    customMessage: order.attributes.customMessage || '',
    paymentDetail: order.attributes.payment_details || '',
    paymentStatus: order.attributes.payment,

    paymentStatusError: null,
    paymentDetailError: null,
    customMessageError: null,
    */
    if (formData.orderStatus === 'completed') {
      if (formData.paymentStatus === 'unpaid') {
        setErrorData((ov) => ({
          ...ov,
          paymentStatusError: 'Mark this order as PAID, if order is delivered',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, paymentStatusError: null }));
      if (formData.paymentDetail === '') {
        setErrorData((ov) => ({
          ...ov,
          paymentDetailError: 'Customer pay kaise kiya wo enter kro',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, paymentDetailError: null }));
      dataToSend = {
        status: formData.orderStatus,
        payment: formData.paymentStatus,
        payment_details: formData.paymentDetail,
      };
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
        ...dataToSend,
        customMessage: formData.customMessage,
      };
    }
    
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
    
  };
  const disabledAllField = ['completed', 'cancelled'].includes(
    order.attributes.status
  );

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
        {disabledAllField && (
          <div
            className="bg-rose-100 flex gap-2 items-center border-l-4 border-red-500 text-rose-700 lg:p-4 md:p-2 p-1 my-3"
            role="alert"
          >
            <p className="font-bold">
              <Warning />
            </p>
            <p>Cannot Edit Cancelled or Completed request.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="statusContainer ">
            <p>Order Status:</p>
            <Select
              instanceId={'status list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, orderStatus: option.label }))
              }
              isDisabled={disabledAllField}
              options={statusList}
              defaultValue={statusList[indexOfStatus]}
            />
          </div>

          <div className=" ">
            <p>Payment Status:</p>
            <Select
              instanceId={'paymentStatus list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, paymentStatus: option.value }))
              }
              isDisabled={formData.orderStatus === 'cancelled' || disabledAllField}
              options={paymentStatusList}
              defaultValue={paymentStatusList[indexOfPayment]}
            />
            {errorData.paymentStatusError && (
              <p className="text-sm my-1 pl-1 text-rose-600">
                {errorData.paymentStatusError}
              </p>
            )}
          </div>
          <div className=" ">
            <p>Payment Detail:</p>
            <Select
              instanceId={'paymentDetail list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, paymentDetail: option.value }))
              }
              isDisabled={formData.orderStatus === 'cancelled' || disabledAllField}
              options={paymentDetailsList}
              defaultValue={paymentDetailsList[indexOfPaymentDetail]}
            />
            {errorData.paymentDetailError && (
              <p className="text-sm my-1 pl-1 text-rose-600">
                {errorData.paymentDetailError}
              </p>
            )}
          </div>
          <div className=" ">
            <p>Add Custom Message:</p>
            <InputField
              type="text"
              name="Custom Message"
              required={true}
              disabled={disabledAllField}
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
          disabled={updating || disabledAllField}
          className="my-5 px-5 py-2 bg-black rounded-full hover:shadow-lg text-white"
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditOrders;
