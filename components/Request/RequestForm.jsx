import { useState, useEffect, useContext, useRef } from 'react';
import { DataContext } from '@/store/globalstate';
import { useRouter } from 'next/router';
import InputField from '@/components/FormComponent/InputField';
import { Trash, Warning } from '@/components/Icon';
import { uploadImage } from '@/utils/controller/imageController';
import { getUser } from '@/utils/controller/auth';
import Select from 'react-select';
import { parseCookies } from 'nookies';
import { decodeJWT } from '@/utils/controller/sessionController';
import ToastMessage from '@/components/Toast';
import {
  createRequest,
  updateRequest,
} from '@/utils/controller/requestController';

const RequestForm = ({ user, setOpenForm, accountFlag = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    images: [],
    address: '',
    // owner_contact: '',
    request_for: 'Product',
    note: '',
  });

  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);

  const userLoggedInGlobal = state.userLoggedInGlobal;
  const [clientSideUser, setClientSideUser] = useState(user ? user : null);
  useEffect(() => {
    const fetchUser = async () => {
      const clientUser = await getUser(null, null);
      setClientSideUser(clientUser);
    };
    fetchUser();
  }, [userLoggedInGlobal]);
  const formRef = useRef(null);

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [errors, setErrors] = useState({
    name: null,
    address: null,
    images: null,
    contact: null,
    requestFor: null,
  });
  // //console.log('errors', errors);
  let timeoutId;
  const { name, images, address, request_for, owner_contact } = formData;
  function isValidPhone(contact) {
    if (contact.length === 0) return true;
    const contactRegex = /^[6789]\d{9}$/;
    return contactRegex.test(contact);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLoggedIn) {
      dispatch({ type: 'TRUE_OPEN_LOGIN' });
      ToastMessage({ type: 'error', message: 'Please login to continue' });
      return;
    } else {
      // Validation
      const newErrors = {};

      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }

      // if (!isValidPhone(owner_contact)) {
      //   newErrors.contact =
      //     'Please provide correct 10 digit number or keep it empty.\n Numbers accepted starts from 6,7,8,9.';
      // }
      if (request_for.length === 0) {
        newErrors.requestFor = 'Please select one';
      }

      if (images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
      if (images.length > 4) {
        newErrors.images = 'Upto 4 images were allowed';
      }
      if (!address.trim()) {
        newErrors.address = 'Address is required';
      }
      // //console.log('formData', formData);
      if (Object.keys(newErrors).length === 0) {
        setErrors(newErrors);
        // Form is valid, proceed with submission or other actions
        dispatch({ type: 'FALSE_OPEN_LOGIN' });

        const form = new FormData();

        for (let key in formData) {
          if (key !== 'images') {
            form.append(`data.${key}`, formData[key]);
          }
        }
        form.append('data.requested_by', clientSideUser.id); //get user id dynamically

        const dataResponse = await createRequest({ data: form, ctx: null });

        if (dataResponse.id) {
          const subsData = {
            data: {
              subscribers: {
                users: [clientSideUser.id],
              },
            },
          };
          const uploadImagePromise = uploadImage({
            collectionName: 'api::request.request',
            idToLink: dataResponse.id,
            fieldName: 'images',
            files: [...formData.images],
          });
          const updateRequestPromise = updateRequest({
            data: subsData,
            ctx: null,
            id: dataResponse.id,
          });
          const [imageResponse, subsResponse] = await Promise.all([
            uploadImagePromise,
            updateRequestPromise,
          ]);
          // //console.log(
          //   'dataResponse',
          //   dataResponse,
          //   imageResponse,
          //   subsResponse
          // );
          if (imageResponse) {
            ToastMessage({
              type: 'success',
              message: 'Your request is submitted.',
            });
            setFormData({
              name: '',
              images: [],
              address: '',
              // owner_contact: '',
              request_for: 'Product',
              note: '',
            });
            setDisplayedImagesUrls([]);
            timeoutId = setTimeout(function () {
              setOpenForm(false);
            }, 1000);
            // if(accountFlag){
            //   router.reload();
            // }
          }
        } else {
          ToastMessage({ type: 'error', message: 'Something went wrong' });
        }
      } else {
        // Form is invalid, update the state with the errors
        setErrors(newErrors);
        ToastMessage({ type: 'error', message: 'Fix error first' });
      }
    }
  };

  // state variable to keep track of the selected images to be displayed
  const [displayedImagesUrls, setDisplayedImagesUrls] = useState([]);

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    const validImages = [];

    // Iterate through each selected image
    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      // Check if the image size is less than 5MB (5,000,000 bytes)
      if (image.size <= 5000000) {
        validImages.push(image);
      } else {
        // Handle invalid image size here (e.g., display an error message)
        //console.log(`Image ${image.name} exceeds the 5MB limit.`);
      }
    }

    // Update the displayed images and the formData separately
    const displayedImagesUrls = validImages.map((image) =>
      URL.createObjectURL(image)
    );
    setDisplayedImagesUrls(displayedImagesUrls);
    setFormData({ ...formData, images: validImages });
  };
  const handleRemoveImage = (index, e) => {
    e.preventDefault();
    const updatedImagesUrls = [...displayedImagesUrls];
    const removedImageUrl = updatedImagesUrls.splice(index, 1)[0];
    URL.revokeObjectURL(removedImageUrl);

    setDisplayedImagesUrls(updatedImagesUrls);

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setFormData({ ...formData, images: updatedImages });
    if (updatedImagesUrls.length === 0) {
      // Reset the input value
      const inputElement = document.getElementById('image-input');
      if (inputElement) {
        inputElement.value = '';
      }
    }
    // Modify the URL without query parameters
    const newUrl = window.location.pathname; // Get the current path
    router.replace(`${newUrl}`, undefined, {
      shallow: true,
    });
  };

  // get user
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    const cookies = parseCookies();
    const user = decodeJWT(cookies.jwt);
    if (user) {
      //console.log('user available');
      setUserLoggedIn(true);
    } else {
      dispatch({ type: 'FALSE_GLOBAL_USER_lOGIN' });
      setUserLoggedIn(false);
      // router.reload();
    }
  }, [userLoggedInGlobal]);

  // ?________________ dropdown ______
  const dropdownList = [
    { value: 'Product', label: 'Product' },
    { value: 'Shop', label: 'Shop' },
  ];

  return (
    <div className="">
      <form
        ref={formRef}
        className="flex flex-col space-y-4 w-full"
        onSubmit={(e) => handleSubmit(e)}
      >
        <p className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg">
          <span className="flex gap-2">
            <Warning />
            You request will be public, once our team approved it.
          </span>
        </p>
        <div className="">
          <p className="text-sm text-gray-500 pt-2 pb-1">
            What are you requesting for? *
          </p>
          <Select
            instanceId={'new one'}
            onChange={(option) =>
              setFormData({ ...formData, request_for: option.label })
            }
            options={dropdownList}
            defaultValue={dropdownList[0]}
          />
          {errors.requestFor && (
            <p className="text-sm text-rose-600 pl-1 pt-1">
              {errors.requestFor}
            </p>
          )}
        </div>
        <InputField
          type="text"
          name="name"
          error={errors.name}
          onchange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        >
          Name*
        </InputField>

        {/* <InputField
          type="number"
          name="contact"
          error={errors.contact}
          onchange={(e) =>
            setFormData({ ...formData, owner_contact: e.target.value })
          }
          value={formData.owner_contact}
        >
          Owner Phone Number
        </InputField> */}
        <div className="w-full  rounded-lg">
          <p className="text-sm text-gray-500 pt-2 pb-1">Images*</p>
          <input
            className="border rounded-md "
            id="image-input"
            type="file"
            onChange={(e) => handleImagesChange(e)}
            multiple
          />
          {errors.images && (
            <p className="text-sm text-rose-600 pl-1 pt-1">{errors.images}</p>
          )}
        </div>
        {displayedImagesUrls.length > 0 && (
          <div className="my-12">
            <div className="flex gap-5 flex-wrap flex-shrink-0 py-3">
              {displayedImagesUrls.map((imageUrl, index) => (
                <div key={index} className="flex-none">
                  <img
                    src={imageUrl}
                    alt={`Image ${index}`}
                    className="w-24 h-24"
                  />
                  <div className="text-center py-1">
                    <button
                      className="text-gray-600 border rounded-full p-1 bg-rose-100 text- hover:scale-[1.1]"
                      onClick={(e) => handleRemoveImage(index, e)}
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500 pt-2 pb-1">Address*</p>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="FS, Crawfard market, Bhindi Bazar..."
            className="w-full resize-y rounded-md border px-3"
          ></textarea>
          {errors.address && (
            <p className="text-sm text-rose-600 pl-1 pt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 pt-2 pb-1">
            Note:{' '}
            <span className="bg-green-200 text-yellow-800  text-xs px-4 ml-2 rounded-full">
              This will only visible to you!
            </span>
          </p>
          <textarea
            name="note"
            id="note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Kya size chiye, kab tak chiye, wagaira wagaira..."
            className="w-full resize-y rounded-md border px-3"
          ></textarea>
        </div>
        <button
          type="submit"
          className={`px-2 max-w-[200px] rounded-full hover:shadow-xl py-1 bg-black text-white`}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
