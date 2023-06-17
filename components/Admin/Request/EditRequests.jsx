import { useEffect, useState } from 'react';
import { updateOrderStatus } from '@/utils/controller/orderController';
import { useRouter } from 'next/router';

import { updateRequest } from '@/utils/controller/requestController';
import Select from 'react-select';
import ToastMessage from '@/components/Toast';
import moment from 'moment/moment';
import InputField from '@/components/FormComponent/InputField';
import { Avatar, Warning } from '@/components/Icon';
import Image from 'next/image';
import CommentRequestCard from '@/components/Request/CommentRequestCard';

const EditRequests = ({ currentRequestData: request, setOpen, user }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    requestStatus: request.attributes.status,
    estimateDate: request.attributes.estimated || '',
    customMessage: request.attributes.custom_message || '',
    productLink: request.attributes.link || '',
    // commentEnable: request.attributes.comment_enabled ? 'Enable' : 'Disable',
    commentEnable: '',
  });

  const initialFormData = {
    requestStatus: request.attributes.status,
    estimateDate: request.attributes.estimated || '',
    customMessage: request.attributes.custom_message || '',
    productLink: request.attributes.link || '',
    commentEnable: '',
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

    //  objects are changed
    return false;
  };

  // ?____________________________________ Request Status Dropdown Logic ______________________
  const statusList = [
    { value: 'pending', label: 'pending' },
    { value: 'approved', label: 'approved' },
    { value: 'completed', label: 'completed' },
    { value: 'closed', label: 'closed' },
    { value: 'rejected', label: 'rejected' },
  ];
  const indexOfStatus = statusList.findIndex(
    (status) => request.attributes.status === status.value
  );

  // ?___________________ Estimated date logic_____________________________
  const today = new Date().toISOString().split('T')[0];

  // *___________________ Enable/Disable Comment ____________________-

  const handleDisabledComment = (event) => {
    setFormData((ov) => ({ ...ov, commentEnable: event.target.value }));
  };
  const [updating, setUpdating] = useState(false);

  const [errorData, setErrorData] = useState({
    estimateDateError: null,
    productLinkError: null,
    customMessageError: null,
    commentEnableError: null,
  });

  const handleRequestUpdates = async () => {
    const {
      requestStatus,
      estimateDate,
      customMessage,
      productLink,
      commentEnable,
    } = formData;

    let dataToSend = {
      data: {
        status: requestStatus,
      },
    };

    const detectChange = detectObjectChange(formData, initialFormData);
    if (!detectChange) return;

    if (requestStatus === 'completed') {
      if (!estimateDate) {
        setErrorData((ov) => ({
          ...ov,
          estimateDateError: 'Please add estimated date.',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, estimateDateError: null }));

      if (!productLink) {
        setErrorData((ov) => ({
          ...ov,
          productLinkError:
            'Please add product link before marking as complete.',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, productLinkError: null }));

      if (commentEnable === 'Enable') {
        setErrorData((ov) => ({
          ...ov,
          commentEnableError: 'Disabled comment when completing request.',
        }));
        return;
      }
      setErrorData((ov) => ({ ...ov, commentEnableError: null }));
      dataToSend = {
        data: {
          status: requestStatus,
          estimated: estimateDate,
          link: productLink,
          comment_enabled: commentEnable === 'Enable' ? true : false,
        },
      };
    }
    if (requestStatus === 'approved') {
      dataToSend = {
        data: {
          status: requestStatus,
          comment_enabled: true,
        },
      };
      if (estimateDate) {
        dataToSend = {
          data: {
            status: requestStatus,
            comment_enabled: true,
            estimated: estimateDate,
          },
        };
      }
    }
    if (requestStatus === 'closed' || requestStatus === 'rejected') {
      dataToSend = {
        data: {
          ...dataToSend.data,
          comment_enabled: false,
        },
      };
    }

    // custom message may be upated anytime
    if (customMessage) {
      dataToSend = {
        data: {
          ...dataToSend.data,
          custom_message: customMessage,
        },
      };
    }
    if (commentEnable) {
      if (requestStatus === 'approved') {
        dataToSend = {
          data: {
            ...dataToSend.data,
            comment_enabled: commentEnable === 'Enable' ? true : false,
          },
        };
      }
    }


    setUpdating(true);

    const updateResponse = await updateRequest({
      data: dataToSend,
      id: request.id,
    });
    setUpdating(false);
    if (updateResponse) {
      ToastMessage({
        type: 'success',
        message: `Request no ${request.id} updated.`,
      });
      router.reload();
    } else {
      ToastMessage({
        type: 'error',
        message: `Something Went Wrong.`,
      });
    }
  };
  const disabledAllField = ['completed', 'rejected', 'closed'].includes(
    request.attributes.status
  );

  return (
    <div className="overflow-y-auto mb-32 mx-2 md:mx-6 h-full px-1">
      <div className="flex  my-3 md:my-6 items-center justify-between ">
        <p className="text-xl">
          Request No: <span className="text-5xl">{request.id}</span>
        </p>
        <button
          className="px-3 py-1 rounded-lg border hover:shadow-md"
          onClick={() => setOpen(false)}
        >
          x
        </button>
      </div>
      <h2 className="text-2xl my-2 bg-gray-100 p-2 rounded-lg">
        {request.attributes.name}
        <p className="text-sm text-right">
          {moment(request.attributes.createdAt).fromNow()}
        </p>
      </h2>

      <details open>
        <summary>Requested Item Details</summary>
        <div className="mt-5">
          <div className=" flex gap-2 overflow-x-auto">
            {request.attributes.images.data.map((image, index) => (
              <div
                className={`border flex-shrink-0 border-black rounded-lg relative h-64 w-64`}
                key={index}
              >
                <Image
                  src={image.attributes.url}
                  alt={image.attributes.name}
                  fill
                  sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>
            ))}
          </div>

          <div className="my-4  flex flex-col md:flex-row gap-4 md:gap-10">
            <div className="">
              <p className="text-xl text-gray-600">User Details:</p>
              <div className="inline-block">
                <div className="flex items-center p-2 gap-2 rounded-lg bg-gray-100">
                  <Avatar
                    heightWidth="h-9 md:h-10 md:w-10 lg:h-12 w-9 lg:w-12"
                    url={
                      request.attributes.requested_by.data.attributes
                        .profile_pic.data
                        ? request.attributes.requested_by.data.attributes
                            .profile_pic.data.attributes.url
                        : 'USE_DEFAULT_PIC'
                    }
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800">
                      {request.attributes.requested_by.data.attributes.username}
                    </p>
                    <p className="text-gray-800">
                      {request.attributes.requested_by.data.attributes.email}
                    </p>
                    {request.attributes.requested_by.data.attributes
                      .contact && (
                      <p className="text-gray-800">
                        {
                          request.attributes.requested_by.data.attributes
                            .contact
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xl text-gray-600">Address:</p>
              <p className="text-sm rounded-lg bg-gray-100 p-2 inline-block ">
                {request.attributes.address}
              </p>
            </div>
            {request.attributes.note && (
              <div>
                <p className="text-xl text-gray-600">Note:</p>
                <p className="text-sm rounded-lg bg-gray-100 p-2 inline-block ">
                  {request.attributes.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </details>
      <details>
        <summary>Manage Comments</summary>
        <div className=" my-6 lg:w-1/2">
          <CommentRequestCard request={request} user={user} />
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
            <p>Cannot Edit Completed, Closed or Rejected request.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="statusContainer ">
            <p>Request Status</p>
            <Select
              instanceId={'status list'}
              onChange={(option) =>
                setFormData((ov) => ({ ...ov, requestStatus: option.label }))
              }
              isDisabled={disabledAllField}
              options={statusList}
              defaultValue={statusList[indexOfStatus]}
            />
          </div>

          <div className=" ">
            <p>Estimated Date:</p>
            <input
              className="bg-gray-50 border text-gray-900 text-sm px-2 py-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              type="date"
              value={formData.estimateDate}
              min={today}
              disabled={disabledAllField}
              onChange={(date) => {
                const formattedDate = new Date(date.target.value)
                  .toISOString()
                  .split('T')[0];
                setFormData((ov) => ({ ...ov, estimateDate: formattedDate }));
              }}
            />
            {errorData.estimateDateError && (
              <p className="text-sm my-1 pl-1 text-rose-600">
                {errorData.estimateDateError}
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
          <div className=" ">
            <p>Add Product Link:</p>
            <InputField
              type="text"
              name="Link"
              required={true}
              disabled={disabledAllField}
              error={errorData.productLinkError}
              onchange={(e) => {
                setFormData((ov) => {
                  return {
                    ...ov,
                    productLink: e.target.value,
                  };
                });
              }}
              value={formData.productLink}
            >
              Link
            </InputField>
            {formData.productLink && <a className="text-sm bg-lime-400 p-1 rounded-full px-2 " href={formData.productLink} target="_blank">Product Link</a>}
          </div>
          <div className="bg-rose-900 text-white p-3 rounded-lg inline-block">
            <p className="mb-2">Enabled Comment/Discussion for this request?</p>
            <label className="mr-4">
              <input
                type="radio"
                name="option"
                value="Enable"
                disabled={disabledAllField}
                checked={formData.commentEnable === 'Enable'}
                onChange={handleDisabledComment}
              />
              Enable
            </label>
            <label>
              <input
                type="radio"
                name="option"
                value="Disable"
                disabled={disabledAllField}
                checked={formData.commentEnable === 'Disable'}
                onChange={handleDisabledComment}
              />
              Disable
            </label>
            {errorData.commentEnableError && (
              <p className="text-sm my-1 pl-1 text-white">
                {errorData.commentEnableError}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleRequestUpdates}
          disabled={updating || disabledAllField}
          className="my-5 px-5 py-2 bg-black rounded-full hover:shadow-lg text-white"
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditRequests;
