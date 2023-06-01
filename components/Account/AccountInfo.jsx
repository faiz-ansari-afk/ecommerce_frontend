import AddressForm from '@/components/Checkout/AddressForm';
import ShippingDetails from '@/components/Checkout/ShippingDetails';
import { useState, useEffect } from 'react';
import InputField from '../FormComponent/InputField';
import { updateUserData } from '@/utils/controller/auth';
import ChangePassword from './ChangePassword';

function ContactInfo({ user, setIsEditContact, email, username, contact }) {
  return (
    <div>
      <div className="flex">
        <p className="text-gray-500">Username:&nbsp;</p>
        <p className="pb-1 font-sans  ">{username}</p>
      </div>
      <div className="flex">
        <p className="text-gray-500">Email:&nbsp;</p>
        <p className="font-sans ">{email}</p>
      </div>
      {contact && (
        <div className="flex">
          <p className="text-gray-500">Primary Contact:&nbsp;</p>
          <p className="font-sans ">{contact}</p>
        </div>
      )}
      <button className="py-6 underline" onClick={() => setIsEditContact(true)}>
        Edit
      </button>
    </div>
  );
}
function EditContactInfo({
  user,
  setIsEditContact,
  email,
  setEmail,
  username,
  setUsername,
  contact,
  setContact,
}) {
  //_______________________________prompt user if cancelling after entering details
  const [triggeredDataChangeCheck, setTriggeredDataChangeCheck] =
    useState(false);
  const [originalData, setOriginalData] = useState({
    email: user.email,
    username: user.username,
    contact: user.contact || '',
  });
  const handleCancel = () => {
    const inputValue = { email, username, contact };
    setTriggeredDataChangeCheck(false);
    if (JSON.stringify(inputValue) !== JSON.stringify(originalData)) {
      // Prompt the user to confirm discarding changes
      const confirmDiscard = window.confirm('Discard unsaved changes?');
      if (!confirmDiscard) {
        return;
      }
    }
    setIsEditContact(false);
  };
  useEffect(() => {
    if (triggeredDataChangeCheck) handleCancel();
  }, [triggeredDataChangeCheck]);

  // ? _______________________ Error Handling ______________
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [contactError, setContactError] = useState(null);
  const [loading, setLoading] = useState(false);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidContact(contact) {
    const contactRegex = /^[6789]\d{9}$/;
    return contactRegex.test(contact);
  }

  async function handleSave() {
    // Check for errors before submitting the form
    let hasError = false;

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Email is invalid');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!username) {
      setUsernameError('Username is required');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!contact) {
      setContactError('Contact number is required');
      hasError = true;
    } else if (!isValidContact(contact)) {
      setContactError(
        'Please provide correct number, numbers supported starts from 6,7,8,9'
      );
      hasError = true;
    } else {
      setContactError('');
    }

    if (!hasError) {
      // Submit the form
      // alert('submit form');
      setLoading(true);
      const userDetails = {
        email,
        username,
        contact,
      };
      const saveResult = await updateUserData({
        id: user.id,
        data: userDetails,
      });
      if (saveResult.id) {
        setUsername(saveResult.username);
        setEmail(saveResult.email);
        setContact(saveResult.contact);
        setIsEditContact(false);
        alert('Details updated successfully');
      } else {
        if (saveResult.message.toLowerCase().includes('username')) {
          setUsernameError(saveResult.message);
        } else if (saveResult.message.toLowerCase().includes('email')) {
          setEmailError(saveResult.message);
        }
      }
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-2/3  space-y-3">
      <InputField
        type="text"
        name="Username"
        required={true}
        error={usernameError}
        onchange={(e) => {
          setUsername(e.target.value);
          setTriggeredDataChangeCheck(false);
        }}
        value={username}
      >
        Username*
      </InputField>
      <InputField
        type="email"
        name="Email"
        required={true}
        error={emailError}
        onchange={(e) => {
          setEmail(e.target.value);
          setTriggeredDataChangeCheck(false);
          isValidEmail(e.target.value);
        }}
        value={email}
      >
        Email*
      </InputField>
      <InputField
        type="number"
        name="Conatct"
        required={true}
        error={contactError}
        onchange={(e) => {
          setContact(e.target.value);
          setTriggeredDataChangeCheck(false);
          isValidContact(e.target.value);
        }}
        value={contact}
      >
        Primary Contact*
      </InputField>
      <div className="flex gap-6 items-center">
        <button className=" underline" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          className="text-rose-700"
          onClick={() => setTriggeredDataChangeCheck(true)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
const AccountInfo = ({ user, setUser }) => {
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [contact, setContact] = useState(user.contact || '');

  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [isEditContact, setIsEditContact] = useState(false);
  useEffect(() => {
    if (user.user_data) {
      setIsAddressFilled(true);
    }
  }, [user.user_data]);

  const [openResetPasswordForm, setOpenResetPasswordForm] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1  pb-32">
        <div className="grid  lg:grid-cols-2">
          <div>
            <h2 className="pt-16 pb-6 font-[SangbleuSans] text-4xl tracking-wider text-gray-600 lg:text-6xl">
              Contact Info
            </h2>
            {isEditContact ? (
              <EditContactInfo
                user={user}
                setIsEditContact={setIsEditContact}
                email={email}
                setEmail={setEmail}
                username={username}
                setUsername={setUsername}
                contact={contact}
                setContact={setContact}
              />
            ) : (
              <ContactInfo
                user={user}
                setIsEditContact={setIsEditContact}
                email={email}
                username={username}
                contact={contact}
                F
              />
            )}
          </div>
          {/* <div className="reset password">
            <h2 className="pt-16 pb-6 font-[SangbleuSans] text-4xl tracking-wider text-gray-600 lg:text-6xl">
              Change Password
            </h2>
            <ChangePassword user={user} />
          </div> */}
        </div>

        <div className=" ">
          <div className="">
            <h2 className="pt-16 pb-6 font-[SangbleuSans] text-4xl tracking-wider text-gray-700 lg:text-6xl">
              Address Book
            </h2>
            {isAddressFilled ? (
              <ShippingDetails
                user={user}
                setIsAddressFilled={setIsAddressFilled}
                accountFlag={true}
              />
            ) : (
              // <div className='w-full md:w-2/3 lg:w-1/3'>
              <AddressForm
                user={user}
                setUser={setUser}
                setIsAddressFilled={setIsAddressFilled}
                accountFlag={true}
              />
              // </div>
            )}
            {/* <AddressForm
              user={user}
              setIsAddressFilled={setIsAddressFilled}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
