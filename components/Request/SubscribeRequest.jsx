'use-client';
import { BellAlert, BellSilent } from '@/components/Icon';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../store/globalstate';
import { getUser } from '@/utils/controller/auth';
import ToastMessage from '@/components/Toast';
import { updateRequest, getSingleRequest } from '@/utils/controller/requestController';

const SubscribeRequest = ({
  user: _user,
  requestedItem: _request,
  divStyle = 'bg-gray-100 p-2 rounded-lg',
  buttonStyle = 'p-2 ',
}) => {
  const [request, setRequest] = useState(_request);
  const { dispatch, state } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  //?___________________fetching logged in user _________________________
  const [user, setUser] = useState(_user);
  const triggerUserFetch = state.userLoggedInGlobal;
  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getUser(null, null);
      setUser(loggedInUser);
    };
    fetchUser();
  }, [triggerUserFetch]);
  //??_________________________________________________________

  // !____________________ SUBCRIBER COUNT __________________________
  function countSubscribers(REQ) {
    return REQ.attributes.subscribers
      ? REQ.attributes.subscribers.users.length
      : 0;
  }
  const [subscribersCount, setSubscribersCount] = useState(
    countSubscribers(request)
  );
  // !______________________________________________________________

  // *___________________________ IF SUBCRIBED OR NOT ________________________________
  function checkSubscribe(REQ, USER) {
    return REQ.attributes.subscribers && USER
      ? REQ.attributes.subscribers.users.includes(USER.id.toString())
      : false;
  }
  const [alreadySubscribed, setAlreadySubscribed] = useState(() => {
    return checkSubscribe(request, user);
  });

  // ? check if user is already subscribed or not
  useEffect(() => {
    if (user && request.attributes.subscribers) {
      const findSubs = request.attributes.subscribers.users.includes(
        user.id.toString()
      );
      setAlreadySubscribed(findSubs);
    } else {
      setAlreadySubscribed(false);
    }
  }, [triggerUserFetch, user]);
  // *___________________________________________________________________________________________

  //?______________________________ UPLOAD TO DATABASE FUNCTION ___________________________
  const handleSubscribeEvent = async (type) => {
    // alert(type);
    if (!user) {
      dispatch({ type: 'TRUE_OPEN_LOGIN' });
      ToastMessage({
        type: 'error',
        message: 'Login to subscribe to this request',
      });
      return;
    }
    setLoading(true);
    const newUpdatedRequest = await getSingleRequest({id:request.id})
    // //console.log('fetch request again for updated data',request.id, newUpdatedRequest);
    const ogSubsArray = newUpdatedRequest.attributes.subscribers.users
      ? [...newUpdatedRequest.attributes.subscribers.users]
      : [];
    let arrayToSend = [...ogSubsArray];

    if (type === 'add') {
      arrayToSend = [...ogSubsArray, user.id.toString()];
    } else {
      const filteredArray = ogSubsArray.filter(
        (value) => value !== user.id.toString()
      );
      arrayToSend = [...filteredArray];
    }
    const subsData = {
      data: {
        subscribers: {
          users: arrayToSend,
        },
      },
    };

    const updateRequestSubs = await updateRequest({
      data: subsData,
      ctx: null,
      id: request.id,
    });

    if (updateRequestSubs) {
      setAlreadySubscribed(checkSubscribe(updateRequestSubs, user));
      setSubscribersCount(countSubscribers(updateRequestSubs));
      setRequest(updateRequestSubs);
      ToastMessage({
        type: 'success',
        message: `${type === 'add' ? 'Subscribed' : 'Unsubscribed'}`,
      });
    } else {
      ToastMessage({ type: 'error', message: 'Something went wrong' });
    }
    setLoading(false);
  };

  return (
    <div className={`${divStyle} gap-3 flex items-center `}>
      {request.attributes.status === 'approved' && (
        <p className=" text-gray-400 text-sm" title="voted by">
          Subscribers: {subscribersCount}
        </p>
      )}
      {alreadySubscribed ? (
        <button
          className={`${buttonStyle} border bg-white rounded-lg hover:shadow-md`}
          onClick={() => handleSubscribeEvent('remove')}
          disabled={loading}
        >
          <span title="Turn Off Notification">
            <BellSilent />
          </span>
        </button>
      ) : (
        <button
          className={`${buttonStyle} border bg-white rounded-lg hover:shadow-md`}
          onClick={() => handleSubscribeEvent('add')}
          disabled={loading}
        >
          <span title="Turn On Notification">
            <BellAlert />
          </span>
        </button>
      )}
    </div>
  );
};

export default SubscribeRequest;
