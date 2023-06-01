import axios from 'axios';
import { getAuthJWT } from './sessionController';

export async function uploadImage({
  collectionName,
  idToLink,
  fieldName,
  files,
  ctx = null,
}) {
  const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
  const formData = new FormData();
  formData.append('ref', collectionName);
  formData.append('refId', idToLink);
  formData.append('field', fieldName);

  files.forEach((file, index) => {
    formData.append('files', file);
  });
  const jwt = await getAuthJWT(ctx);
  try {
    //   //console.log("running image upload",file)
    const response = await axios.post(`${strapiUrl}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
    // //console.log('Image uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function deleteImage({ id, ctx = null }) {
  // /api/upload/files/:id
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_WEBSITE;
    const jwt = await getAuthJWT(ctx);
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${strapiUrl}/api/upload/files/${id}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    const response = await axios.request(config);
    // //console.log("response delete",response)
    return 'success';
  } catch (error) {
    console.error(error);
    return null;
  }
}
