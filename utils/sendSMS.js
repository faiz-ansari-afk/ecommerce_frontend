import axios from 'axios';
export async function sendSMS({ to, text, route = 'v3' }) {
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  let data = {
    sender_id: 'TXTIND',
    message: text,
    route,
    numbers: to,
  };
  if (route === 'otp') {
    data = {
      variables_values: text,
      route: 'otp',
      numbers: to,
    };
  }
  const config = {
    headers: {
      authorization: process.env.FAST2SMS_KEY,
    },
  };

  try {
    const response = await axios.post(url, data, config);
    return true;
  } catch (error) {
    console.log('Error sedning sms', error);
    return false;
  }
}
