// import { mapToModelViewCategory } from '@/utils/controller/categoryController';
// import { getHomepageData } from '@/utils/controller/homepageController';
// import axios from 'axios';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp } from 'firebase-admin/app';
import { jsonDataForService } from '@/serviceAccount';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    /* 
    ?This route is dedicated to ORDER only
    model: represent collection name 
    entry: contains the data of collection on which event is performed
    Handling only when order is created or updated
    */

    async function sendSMSWrapper(message, res) {
      getMessaging()
        .send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return res
            .status(200)
            .json({ status: 'success', message: 'Push sent successfully.' });
        })
        .catch((error) => {
          console.log('Error sending push message:', error);
          return res
            .status(400)
            .json({ status: 'error', message: 'Error sending push' });
        });
    }
    const webhookToken = process.env.NEXT_PUBLIC_WEBHOOK_TOKEN; // webhook token stored in client side and server side should match

    const { event, model: collection, entry: order } = req.body;
    const { authorization } = req.headers;
    //     const incomingToken = authorization.split(' ')[1];
    //console.log("incomingToken",authorization)
    if (webhookToken === authorization) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(jsonDataForService),
        });
      }
      if (collection === 'order') {
        // const to = order.address.details.phoneNumber;
        console.log("order",order)
        if (event.includes('create')) {
          //send push notify when order is created
          if (order.users_permissions_user.firebaseToks) {
            const message = {
              notification: {
                title: 'Order recieved',
                body: `Order no: ${order.id} of Rs. ${order.final_price} is recieved. Thankyou.`,
                imageUrl: order.cart.cart_data.products[0].image,
              },
              webpush:{
                fcmOptions:{
                  link:'/account/overview'
                }
              },
              token: order.users_permissions_user.firebaseToks,
            };
            sendSMSWrapper(message, res);
          }
        } else {
          if (order.notify) {
            if (order.status === 'processing') {
              let text = `We are processing your Order no: ${order.id} of Rs. ${order.final_price}. Thankyou.`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              if (order.users_permissions_user.firebaseToks) {
                const message = {
                  notification: {
                    title: 'Processing your order',
                    body: text,
                    imageUrl: order.cart.cart_data.products[0].image,
                  },
                  webpush:{
                    fcmOptions:{
                      link:'/account/overview'
                    }
                  },
                  token: order.users_permissions_user.firebaseToks,
                };
                sendSMSWrapper(message, res);
              }
            } else if (order.status === 'out for delivery') {
              let text = `Order no: ${order.id} of Rs.${order.final_price} is out for delivery.`;
              if (order.delivery_guy_details) {
                text = `Order no: ${order.id} of Rs.${order.final_price} is out for delivery by ${order.delivery_guy_details.username}.`;
              }
              if (order.customMessage) {
                text = order.customMessage;
              }

              if (order.users_permissions_user.firebaseToks) {
                const message = {
                  notification: {
                    title: 'Out for delivery',
                    body: text,
                    imageUrl: order.cart.cart_data.products[0].image,
                  },
                  webpush:{
                    fcmOptions:{
                      link:'/account/overview'
                    }
                  },
                  token: order.users_permissions_user.firebaseToks,
                };
                sendSMSWrapper(message, res);
              }
            } else if (order.status === 'completed') {
              let text = `Order no: ${order.id} of Rs.${order.final_price} is delivered successfully. Thank you.`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              if (order.users_permissions_user.firebaseToks) {
                const message = {
                  notification: {
                    title: 'Order completed',
                    body: text,
                    imageUrl: order.cart.cart_data.products[0].image,
                  },
                  webpush:{
                    fcmOptions:{
                      link:'/account/overview'
                    }
                  },
                  token: order.users_permissions_user.firebaseToks,
                };
                sendSMSWrapper(message, res);
              }
            } else if (order.status === 'cancelled') {
              let text = `Order no: ${order.id} of Rs.${order.final_price} is cancelled.`;
              if (order.customMessage) {
                text = order.customMessage;
              }
              if (order.users_permissions_user.firebaseToks) {
                const message = {
                  notification: {
                    title: 'Order cancelled',
                    body: text,
                    imageUrl: order.cart.cart_data.products[0].image,
                  },
                  webpush:{
                    fcmOptions:{
                      link:'/account/overview'
                    }
                  },
                  token: order.users_permissions_user.firebaseToks,
                };
                sendSMSWrapper(message, res);
              }
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
