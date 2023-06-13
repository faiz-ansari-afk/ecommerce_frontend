import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import { getHomepageData } from '@/utils/controller/homepageController';
import axios from 'axios';



export default async function handler(req, res) {
  if (req.method === 'GET') {
    // const homepage = await getHomepageData();
    const categoriesDetails = await mapToModelViewCategory();
    console.log(categoriesDetails)
    res.status(200).json({ status: 'success', message: 'backend running fine' })

  } else {
    res.status(400).json({ message: 'Invalid request method' });
  }
}
