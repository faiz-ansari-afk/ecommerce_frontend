//firebase import for FCM
import { getFCMToken } from '@/firebase';
import { getUser, updateUserData } from '@/utils/controller/auth';
import ToastMessage from '@/components/Toast';

import { useEffect, useState } from 'react';

const PushNotifyPermission = ({ openDemo, setOpenDemo }) => {
  const [notificationStatus, setNotificationStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const checkNotifyStatus = ()=>{
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setNotificationStatus(currentPermission);
    }
  }

  useEffect(() => {
    checkNotifyStatus();
  }, []);
  
  
  async function requestPermission() {
    if (notificationStatus === 'denied') {
      setOpenDemo(true);
      return;
    }
    setLoading(true);

    const token = await getFCMToken();
    if (token) {
      // console.log("token",token)
      const user = await getUser();
      // console.log('User from FCM', user);
      if (user) {
        const userDetails = {
          firebaseToks: token,
        };
        await updateUserData({
          id: user.id,
          data: userDetails,
        });
        ToastMessage({ type: 'success', message: `Notification turned on successfully.` });
      }
    }
    checkNotifyStatus();
    
    setLoading(false);
  }
  return (
    <>
      {notificationStatus !== 'granted' && (
        <div className="bg-orange-200 rounded-lg py-2 my-1 px-2 flex justify-between flex-col md:flex-row gap-2">
          <h3 className="text-xl">Get notified about your orders.</h3>
          <button
            className="bg-white px-4 py-1 rounded-full hover:shadow-lg shadow-md w-fit"
            onClick={() => requestPermission()}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Turn on notification'}
          </button>
        </div>
      )}
    </>
  );
};

export default PushNotifyPermission;
