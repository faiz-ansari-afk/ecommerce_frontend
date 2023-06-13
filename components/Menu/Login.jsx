import { useState, useContext } from 'react';
import { setCookie } from 'nookies';
import { signIn, signUp, searchUserInDatabase } from '@/utils/controller/auth';
import { Arrow } from '@/components/Icon';
import { DataContext } from '../../store/globalstate';
import ToastMessage from '@/components/Toast';
import InputField from '../FormComponent/InputField';
import { useRouter } from 'next/router';
const Login = ({ setIsLoginFormOpen, setIsOpen, ...rest }) => {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = email;
    if (!isValidEmail(identifier)) {
      setEmailError('Please provide correct email.');
      // setLoading(false);
      return;
    }
    setEmailError(null);
    const isUserAvailable = await searchUserInDatabase({field:"email", value: identifier });
    if (isUserAvailable) {
      setIsExistingUser(true);
      setIsNewUser(false);
    } else {
      setIsExistingUser(false);
      setIsNewUser(true);
    }

    if (isExistingUser) {
      setLoading(true);
      const userData = await signIn({ email: identifier, password });

      if (userData.jwt) {
        dispatch({ type: 'RELOAD_CART' });
        dispatch({ type: 'TRUE_GLOBAL_USER_lOGIN' });
        setCookie(null, 'jwt', userData.jwt, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        ToastMessage({ type: 'success', message: `Successfully logged in.` });
        setIsOpen(false);
        setLoading(false);
        dispatch({ type: 'FALSE_OPEN_LOGIN' });
        router.reload();
        return;
      }
      if (userData.error) {
        setPasswordError('Invalid password');
      } else {
        setPasswordError(null);
      }
      setLoading(false);
      return;
    }
    if (isNewUser) {
      if (username.length < 3) {
        setUsernameError('Username must be greater than 3 digits.');
        return;
      }
      setUsernameError(null);
      if (password.length < 6) {
        setPasswordError('Password must contain at least 6 digits.');
        return;
      }
      setPasswordError(null);
      if (password !== confirmPassword) {
        setConfirmPasswordError("Password didn't match.");
        return;
      }
      setConfirmPasswordError(null);

      const registerData = {
        email: identifier,
        password,
        username,
      };
      // handlePasswordError();
      //register user if email is unique
      if (
        usernameError === null &&
        passwordError === null &&
        confirmPasswordError === null
      ) {
        setLoading(true);
        const registerUser = await signUp(registerData);

        if (registerUser.jwt) {
          setCookie(null, 'jwt', registerUser.jwt, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
          ToastMessage({ type: 'success', message: `Successfully Register.` });
          setIsOpen(false);
          dispatch({ type: 'FALSE_OPEN_LOGIN' });
          setLoading(false);
          router.reload();
          return;
        }
        if (registerUser?.error) {
          setUsernameError('This username is not available, choose another..');
        } else {
          setUsernameError(null);
        }
        setLoading(false);
        return;
      }
    }
  };

  return (
    <div className="px-1">
      <div
        className="h-5 w-5 ml-2"
        onClick={() => {
          dispatch({ type: 'FALSE_OPEN_LOGIN' });
          setIsLoginFormOpen((ov) => !ov);
        }}
      >
        <Arrow className="-rotate-90 text-white hover:cursor-pointer" />
      </div>
      <div className="mb-4 mt-3 font-[SangbleuSans] text-4xl">
        {isNewUser ? 'Welcome' : isExistingUser ? 'Welcome Back!' : 'Good day!'}
      </div>
      <div className="text-md my-2 px-4 font-[GillSans] leading-tight text-gray-200">
        {isNewUser
          ? 'Create your account'
          : isExistingUser
          ? 'Fill in your password'
          : 'Fill in your e-mail address to log in or create an account.'}
      </div>

      <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
        <InputField
          classes="bg-gray-700 text-white "
          autoFocus
          name="email"
          type="email"
          value={email}
          // required={true}
          onchange={(e) => {
            setEmail(e.target.value);
            // if(isExistingUser || isNewUser)
            // handleEmailValidation();
          }}
          error={emailError}
        >
          Email
        </InputField>

        {isExistingUser && (
          <>
            <InputField
              classes="bg-gray-700 text-white "
              name="password"
              type="password"
              value={password}
              required={true}
              onchange={(e) => {
                setPassword(e.target.value);
              }}
              error={passwordError}
            >
              Password
            </InputField>
          </>
        )}
        {isNewUser && (
          <>
            <InputField
              classes="bg-gray-700 text-white "
              name="username"
              type="text"
              value={username}
              required={true}
              error={usernameError}
              onchange={(e) => {
                setUsername(e.target.value);
              }}
            >
              Username
            </InputField>
            <InputField
              classes="bg-gray-700 text-white "
              name="createpassword"
              type="password"
              value={password}
              required={true}
              onchange={(e) => {
                setPassword(e.target.value);
              }}
            >
              Password
            </InputField>
            {passwordError && (
              <div className="text-sm text-rose-500">{passwordError}</div>
            )}
            <InputField
              classes="bg-gray-700 text-white "
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onchange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              error={confirmPasswordError}
              required={true}
            >
              Confirm Password
            </InputField>
          </>
        )}

        <div className="mt-8 mb-12 text-center  font-[GillSans] tracking-wider">
          <button
            type="submit"
            className="cursor-pointer underline underline-offset-2"
            disabled={loading}
          >
            {loading ? "Loading" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
