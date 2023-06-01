import React, { useState } from 'react';
import InputField from '@/components/FormComponent/InputField';
import ToastMessage from '@/components/Toast';

const ResetPassword = ({ user }) => {
  const [openOtpField, setOpenOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const GENERATE_OTP = 123456;
  //console.log(GENERATE_OTP, otp);
  const handleOtpVerification = () => {
    if (parseInt(otp) !== GENERATE_OTP) {
      setOtpError('Wrong OTP');
      return;
    }
    setOtpError(null);
    setIsOtpVerified(true);
    ToastMessage({ type: 'success', message: `OTP has been verified` });
  };

  // const sendOtpToUserEmail = () => {
  //   ToastMessage({
  //     type: 'success',
  //     message: `Reset password otp has been sent to your email`,
  //   });
  //   setIsOtpSent(true);
  // };
  const handlePasswordUpdate = () => {};
  return (
    <div className="w-2/3 space-y-3">
      <InputField
        type="email"
        name="Email"
        required={true}
        disabled
        value={user.email}
      >
        Email*
      </InputField>
      {openOtpField && (
        <div>
          <InputField
            type="number"
            name="otp"
            required={true}
            value={otp}
            error={otpError}
            disabled={isOtpVerified}
            onchange={(e) => {
              setOtp(e.target.value);
            }}
          >
            Enter 6 digit otp sent to your email*
          </InputField>
          {!isOtpVerified && (
            <button
              className="underline pt-2 pb-5"
              onClick={handleOtpVerification}
              disabled={isOtpVerified}
            >
              verify otp
            </button>
          )}
          {isOtpVerified && (
            <div className="pt-3">
              <InputField
                type="text"
                name="password"
                required={true}
                //   value={otp}
                //   error={otpError}
                //   onchange={(e) => {
                //     setOtp(e.target.value);
                //   }}
              >
                Create New Password*
              </InputField>
              <button
                className="underline pt-2 pb-5"
                onClick={handlePasswordUpdate}
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      )}
      {!isOtpSent && (
        <button
          className="hover:underline "
          onClick={() => {
            sendOtpToUserEmail();
            setOpenOtpField(true);
          }}
        >
          Send Reset Password Link
        </button>
      )}
    </div>
  );
};

export default ResetPassword;
