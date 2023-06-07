import { sendSMS } from "@/utils/sendSMS";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const webhookToken = process.env.NEXT_PUBLIC_WEBHOOK_TOKEN; // webhook token stored in client side and server side should match

    const { to, text } = req.body;
    const { authorization } = req.headers;
    if (webhookToken === authorization) {
        const sendResponse = await sendSMS({
            to,
            text,
            route: 'otp',
        });
        // console.log(req.body,sendResponse)
        return res.status(200).send('Send sms');
      
    } else {
      return res.status(401).send('Invalid Authorization Header');
    }
  } else {
    res.status(400).json({ message: 'Invalid request method ' });
  }
}
