import { messaging } from '@/firebase';
import { onMessage } from 'firebase/messaging';
import { Literata } from 'next/font/google';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import NotificationToast from './NotificationToast';

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-lato',
});

const Layout = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [triggerNotifyTimer, setTriggerNotifyTimer] = useState(false);
  const [link,setLink] = useState(null);

  const [pushData, setPushData] = useState(null);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { notification } = payload;
      setLink(payload?.fcmOptions?.link)
      
      setPushData(notification);
      setShowNotification(true);
      setTriggerNotifyTimer((ov) => !ov);
      // console.log("push notify",payload)
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [triggerNotifyTimer]);


  //checking if user internet status
  //  #FIXME: ?Adding below code gives hydration error
  // const [isOnline, setIsOnline] = useState(
  //   typeof window !== 'undefined' && window.navigator.onLine
  // );

  // useEffect(() => {
  //   const handleOnlineStatus = () => {
  //     setIsOnline(true);
  //   };

  //   const handleOfflineStatus = () => {
  //     setIsOnline(false);
  //   };

  //   window.addEventListener('online', handleOnlineStatus);
  //   window.addEventListener('offline', handleOfflineStatus);

  //   return () => {
  //     window.removeEventListener('online', handleOnlineStatus);
  //     window.removeEventListener('offline', handleOfflineStatus);
  //   };
  // }, []);

  return (
    <>
      <main className={`${literata.variable} font-serif`}>
        {children}
        {showNotification && (
          <NotificationToast
            setShowNotification={setShowNotification}
            imageUrl={pushData.image ? pushData.image : null}
            title={pushData.title}
            body={pushData.body}
            buttonLink={link ? link : null}
          />
        )}
      </main>
    </>
  );
};

export default Layout;
