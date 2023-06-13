import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { Camera } from '../Icon';
import { deleteImage, uploadImage } from '@/utils/controller/imageController';
import ToastMessage from '@/components/Toast';
const AdminProfileCard = ({ user }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    ToastMessage({
      type: 'success',
      message: `Profile updated.`,
    });
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
    <div className="bg-gray-200 max-w-sm rounded-lg p-3">
      <div className="flex gap-5">
        <div className="relative rounded-full  border  md:h-32 md:w-32 h-24 w-24">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={user.username}
              fill
              sizes="(max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw"
              className="h-full w-full rounded-full bg-white object-contain"
            />
          )}
          <span
            className="absolute cursor-pointer right-0 bottom-0 bg-black rounded-full p-1 "
            onClick={() => {
              if (!loading) handleImageClick();
            }}
          >
            <Camera />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </span>
        </div>
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex-shrink-0 text-md md:text-xl flex gap-1 md:gap-4">
            <span className="text-gray-500">Username:</span>
            <span className=""> {user.username}</span>
          </div>
          <div className="flex-shrink-0 text-md md:text-xl flex gap-1 md:gap-4">
            <span className="text-gray-500">Email:</span>
            <span className=""> {user.email}</span>
          </div>

          <div className="flex-shrink-0 text-md md:text-xl flex gap-1 md:gap-4">
            <span className="text-gray-500">Role:</span>
            <span className=""> {user.local_role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;
