import axios from 'axios';

const STRAPI_API_ENDPOINT = `${process.env.NEXT_PUBLIC_WEBSITE}/api`;
const STRAPI_API_TIMEOUT_MS = 5000;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.get(STRAPI_API_ENDPOINT, { timeout: STRAPI_API_TIMEOUT_MS });
      if (response.status === 200) {
        res.status(400).json({ status: 'ok' });
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        res.status(500).json({ status: 'error', message: 'Request to Strapi API timed out' });
      }else if( error.response.status === 404){
        res.status(200).json({ status: 'success', message: 'backend running fine' })
      } 
      else {
        res.status(500).json({ status: 'error', message: 'Failed to connect to Strapi API' });
      }
    }
  } else {
    res.status(400).json({ message: 'Invalid request method' });
  }
}
