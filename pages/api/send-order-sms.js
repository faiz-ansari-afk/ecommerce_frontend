import { sendSMS } from '@/utils/sendSMS';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    /* 
    ?This route is dedicated to ORDER only
    model: represent collection name 
    entry: contains the data of collection on which event is performed
    Handling only when order is created or updated
    */

    async function sendSMSWrapper({ to, text, res }) {
      const smsResponse = sendSMS({ to, text });
      if (smsResponse) {
        res.status(200).send('MSG sent success');
      } else {
        res.status(500).send('Something went wrong while sending SMS');
      }
    }
    const webhookToken = process.env.NEXT_PUBLIC_WEBHOOK_TOKEN; // webhook token stored in client side and server side should match

    const { event, model: collection, entry: order } = req.body;
    const { authorization } = req.headers;
//     const incomingToken = authorization.split(' ')[1];
//console.log("incomingToken",authorization)
    if (webhookToken === authorization) {
      if (collection === 'order') {
        const to = order.address.details.phoneNumber;
        if (event.includes('create')) {
          //send sms when order is created
          const text = `Order no: ${order.id} of Rs. ${order.final_price} is recieved. Thankyou.`;
          //console.log('order created', text);
          sendSMSWrapper({ to, text, res });
        } else {
          if (order.notify) {
            console.log("order💥💥💥",order.cart.cart_data.products)
            if (order.status === 'processing') {
              let text = `We are processing your Order no: ${order.id} of Rs. ${order.final_price}. Thankyou.`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              sendSMSWrapper({ to, text, res });
            } else if (order.status === 'out for delivery') {
              let text = `Order no: ${order.id} of Rs.${order.final_price} is out for delivery by ${order.delivery_guy_details.username} (Contact: ${order.delivery_guy_details.contact}).`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              sendSMSWrapper({ to, text, res });
            } else if (order.status === 'completed') {
              let text = `Order no: ${order.id} of Rs.${order.final_price} is delivered successfully. Thank you.`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              sendSMSWrapper({ to, text, res });
            } else {
              return res.status(204).send();
            }
          } else {
            return res.status(204).send();
          }
        }
      } else {
        return res.status(204).send();
      }
    } else {
      return res.status(401).send('Invalid Authorization Header');
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
