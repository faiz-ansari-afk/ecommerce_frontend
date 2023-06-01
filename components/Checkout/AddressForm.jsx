import React from 'react';
import InputField from '@/components/FormComponent/InputField';
import { v4 as uuidv4 } from 'uuid';
import { states, getPincodeDetails, isValidPinCode } from '@/utils/states';
import { updateUserData } from '@/utils/controller/auth';
import { createOrder } from '@/utils/controller/orderController';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { parseCookies, setCookie } from 'nookies';
import { sendSMS } from '@/utils/sendSMS';
import ToastMessage from '@/components/Toast';

const AddressForm = ({
  user,
  setUser,
  setIsAddressFilled,
  accountFlag = false,
  setUserAddressData,
}) => {
  const [openNote, setOpenNote] = useState(false);
  // otp logic
  const [buttonName, setButtonName] = useState(
    user.user_data ? 'Update Details' : 'Send OTP'
  );
  // _________________________________ VALIDATION STATE ______________________________
  const [name, setName] = useState(
    user.user_data ? user.user_data.details.name : ''
  );
  const [phone, setPhone] = useState(
    user.user_data ? user.user_data.details.phoneNumber : ''
  );
  const [address, setAddress] = useState(
    user.user_data ? user.user_data.address.address : ''
  );
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [openOtpField, setOpenOtpField] = useState(false);

  //___________________________________________________________________________________
  //_______________________________prompt user if cancelling after entering details
  const [disableUpdateButton, setDisableUpdateButton] = useState(
    user.user_data ? true : false
  );
  const [triggeredDataChangeCheck, setTriggeredDataChangeCheck] =
    useState(false);
  const originalData = {
    phone: user.user_data ? user.user_data.details.phoneNumber : '',
    name: user.user_data ? user.user_data.details.name : '',
    address: user.user_data ? user.user_data.address.address : '',
  };
  const handleCancel = (updateFlag) => {
    const inputValue = { phone, name, address };
    setTriggeredDataChangeCheck(false);
    // //console.log('in if of handel cancel');
    if (JSON.stringify(inputValue) !== JSON.stringify(originalData)) {
      // Prompt the user to confirm discarding changes
      const confirmDiscard = window.confirm('Discard unsaved changes?');
      if (!confirmDiscard) {
        return;
      } else {
        setIsAddressFilled(true);
      }
    } else {
      setIsAddressFilled(true);
      setDisableUpdateButton(true);
    }
  };
  const checkNewChanges = () => {
    const inputValue = { phone, name, address };

    if (JSON.stringify(inputValue) !== JSON.stringify(originalData)) {
      setDisableUpdateButton(false);
    } else {
      setDisableUpdateButton(true);
    }
  };
  useEffect(() => {
    checkNewChanges();
  }, [phone, address, name]);
  //console.log('disableUpdateButton', loading, disableUpdateButton);
  useEffect(() => {
    if (triggeredDataChangeCheck) handleCancel();
  }, [triggeredDataChangeCheck]);

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random number between 100000 and 999999
    return otp.toString();
  };
  
  function isValidPhone(contact) {
    const contactRegex = /^[6789]\d{9}$/;
    return contactRegex.test(contact);
  }
  // async function handleProceedCheckout (){}
  const handleProceedCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check for errors before submitting the form
    let hasError = false;
    if (!name) {
      setNameError('Name is required');
      hasError = true;
    } else {
      setNameError('');
    }
    if (!address) {
      setAddressError('Address is required');
      hasError = true;
    } else if (address.length < 10) {
      setAddressError('Please provide proper address.');
    } else {
      setAddressError('');
    }
    if (!phone) {
      setPhoneError('Phone number is required');
      hasError = true;
    } else if (!isValidPhone(phone)) {
      setPhoneError(
        'Please provide correct 10 digit number, numbers supported starts from 6,7,8,9'
      );
      hasError = true;
    } else {
      setPhoneError('');
    }
    if (!hasError) {
      const GENERATED_OTP = 123456;
      const genOTP = generateOTP();
      const sendResponse = await sendSMS({to:phone,text:genOTP})
      console.log("genOTP",genOTP,phone,sendResponse);
      if (!openOtpField) {
        setOpenOtpField(true);
        setButtonName('Verify OTP');
        //send otp here to user_________________//?_______________
        ToastMessage({
          type: 'success',
          message: `OTP has been sent to ${phone}.`,
        });
        setLoading(false);
        return;
      }
      if (otp.length !== 6) {
        setOtpError('Please enter 6 digit otp');
        setLoading(false);
        return;
      }
      //console.log('entered otp', otp, GENERATED_OTP);
      //validate otp here then proceed further
      if (!otpVerified) {
        if (parseInt(otp) !== GENERATED_OTP) {
          setOtpError('Wrong OTP ');
          setLoading(false);
          return;
        } else {
          ToastMessage({ type: 'success', message: `OTP has been verified.` });
          if (!accountFlag) {
            setButtonName('Book order');
          } else {
            setButtonName('Update Details');
          }
          setOtpError(null);
          setOtpVerified(true);
          setLoading(false);
          return;
        }
      }

      const userDetails = {
        user_data: {
          details: {
            name,
            phoneNumber: phone,
          },
          address: {
            address,
            state: 'Maharashtra',
            country: 'India',
            pincode: '421 302',
            city: 'Bhiwandi',
            note: note || '',
          },
        },
      };

      //update user data with its address and naming detail
      if (!user) {
        alert('session expired, login again');
        return;
      }
      const updatedUserDetails = await updateUserData({
        id: user.id,
        ctx: null,
        data: userDetails,
      });

      if (updatedUserDetails?.data === null) {
        alert('Something went wrong');
        return;
      }
      if (updatedUserDetails.id) {
        setUser(updatedUserDetails);
      }
      if (!accountFlag) setUserAddressData(updatedUserDetails.user_data);
      setIsAddressFilled(true);
    }
    setLoading(false);
  };
  /*#FIXME:if address is filled and user want to update again then check if phone is changed or not
  if changed then only send otp else not */
  useEffect(() => {
    if (user.user_data) {
      if (user.user_data.details.phoneNumber !== phone) {
        setButtonName('Send OTP');
      } else {
        setButtonName('Update Details');
      }
    }
  }, [phone]);

  return (
    <form onSubmit={handleProceedCheckout}>
      <div className="shipping address div mt-12">
        <h2 className="text-xl">
          {user.user_data ? 'Update' : 'Fill'} shipping address
        </h2>
        <div className="mb-3 mt-4 text-sm text-gray-400">
          Required fields are marked with an asterisk *
        </div>

        <div className="mb-4 md:w-2/3  w-full space-y-4 ">
          <InputField
            classes="border"
            type="text"
            name="Name"
            error={nameError}
            onchange={(e) => setName(e.target.value)}
            value={name}
          >
            Name*
          </InputField>

          <InputField
            classes="border"
            type="text"
            name="address"
            error={addressError}
            value={address}
            onchange={(e) => setAddress(e.target.value)}
          >
            Address*
          </InputField>
          <div className="grid grid-cols-2 w-full gap-5">
            <InputField
              classes="border"
              type="number"
              name="contact"
              error={phoneError}
              value={phone}
              onchange={(e) => setPhone(e.target.value)}
            >
              Phone number*
            </InputField>
            {openOtpField && (
              <InputField
                classes="border"
                type="number"
                name="otp"
                error={otpError}
                value={otp}
                onchange={(e) => setOtp(e.target.value)}
              >
                Enter OTP*
              </InputField>
            )}
          </div>
        </div>
      </div>
      {accountFlag ? (
        <div className="py-4 flex gap-4 md:w-2/3 w-full">
          <button
            className={`w-full  rounded-full  py-2 text-white  ${
              loading || disableUpdateButton
                ? 'cursor-not-allowed bg-gray-500'
                : 'bg-black hover:shadow-lg'
            }`}
            disabled={loading || disableUpdateButton}
            type="submit"
          >
            {buttonName}
          </button>
          {user.user_data && (
            <button
              className="text-black hover:underline"
              disabled={loading}
              onClick={() => setTriggeredDataChangeCheck(true)}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <>
          {!openNote && (
            <div className="mx-4 my-6">
              <button
                className="underline underline-offset-4"
                onClick={() => setOpenNote(true)}
              >
                Add a note
              </button>
            </div>
          )}
          {openNote && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Delivery Note (optional)"
              className="w-full resize-y rounded-md border px-3"
            ></textarea>
          )}
          <div className="py-4 flex gap-4 md:w-2/3 w-full">
            <button
              className={`w-full max-w-[500px] rounded-full py-2 text-white  ${
                loading || disableUpdateButton
                  ? 'cursor-not-allowed bg-gray-500'
                  : 'bg-black hover:shadow-lg'
              }`}
              type="submit"
              disabled={loading || disableUpdateButton}
            >
              {buttonName}
            </button>
            {user.user_data && (
              <button
                type="button"
                className="    text-black hover:underline"
                disabled={loading}
                onClick={() => {
                  setTriggeredDataChangeCheck(true);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default AddressForm;
