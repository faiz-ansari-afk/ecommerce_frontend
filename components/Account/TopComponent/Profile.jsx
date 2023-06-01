import { Camera } from '@/components/Icon';
import { uploadImage, deleteImage } from '@/utils/controller/imageController';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const Profile = ({ user }) => {
  // //console.log(user);
  const [greet, setGreet] = useState('Good Morning');
  const date = new Date();
  const hours = date.getHours();

  useEffect(() => {
    if (hours >= 5 && hours < 12) {
      setGreet('Good Morning');
    } else if (hours >= 12 && hours < 18) {
      setGreet('Good Afternoon');
    } else {
      setGreet('Good Evening');
    }
  }, []);

  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    // //console.log("file from navbar",file)
    const imageUrl = URL.createObjectURL(file);
    setImageSrc(imageUrl);
    if (user.profile_pic) {
      // //console.log("id image",user.profile_pic.id)
      await deleteImage({ id: user.profile_pic.id });
    }
    await uploadImage({
      collectionName: 'plugin::users-permissions.user',
      idToLink: user.id,
      fieldName: 'profile_pic',
      files: [file],
    });
    alert('Image uploaded');
    setLoading(false);
  };
  useEffect(() => {
    if (user.profile_pic) {
      setImageSrc(`${user.profile_pic.url}`);
    } else {
      setImageSrc('/avatarDefault.png');
    }
  }, []);
  return (
    <div>
      <div className="  mt-28 flex justify-center lg:mt-28 py-4">
        <div
          className="relative rounded-full cursor-pointer  h-28 w-28 lg:h-32 lg:w-32 "
          onClick={() => {
            if (!loading) handleImageClick();
          }}
        >
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
            <div className="rounded-full  border h-28 w-28 lg:h-32 lg:w-32 transition-colors bg-gradient-to-br from-gray-300 to-gray-100 animate-pulse" />
          )}
          <span className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity hidden md:block ">
            <Camera />
          </span>
          <span className="absolute right-0 bottom-0 bg-black rounded-full p-1  md:hidden ">
            <Camera />
          </span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <style jsx>{`
        .relative:hover span {
          opacity: 1;
        }
      `}</style>

      <div className="mb-28  lg:mb-32 ">
        <h3 className="text-center font-[TiemposFine] text-5xl lg:text-8xl italic">
          {greet} {user.username}!
        </h3>
      </div>
    </div>
  );
};

export default Profile;
