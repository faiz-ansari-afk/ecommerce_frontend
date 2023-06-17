import Image from 'next/image';
import { getUser } from '@/utils/controller/auth';
import { useEffect, useState } from 'react';
/* 

url:USE_DEFAULT_PIC || actual url of image
*/
const Avatar = ({
  heightWidth = 'h-5 md:h-6 md:w-6 lg:h-7 w-5 lg:w-7',
  url = null,
}) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser(null, null);

      if (userData && userData.profile_pic) {
        setImageSrc(`${userData.profile_pic.url}`);
      } else {
        setImageSrc('/avatarDefault.png');
      }
    }
    if (!url) fetchUser();
    else {
      if (url === 'USE_DEFAULT_PIC') {
        setImageSrc('/avatarDefault.png');
      } else {
        setImageSrc(url);
      }
    }
  }, [url]);

  return (
    <div className={`relative ${heightWidth} `} title="profile">
      {imageSrc ? (
        <Image
          src={imageSrc}
          fill
          alt="user avatar"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover rounded-full"
        />
      ) : (
        <div className="rounded-full  border h-5 md:h-6 md:w-6 lg:h-7 w-5 lg:w-7 transition-colors bg-gradient-to-br from-gray-300 to-gray-100 animate-pulse" />
      )}
    </div>
  );
};

export default Avatar;
