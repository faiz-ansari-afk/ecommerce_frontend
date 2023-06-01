import React from 'react';
import { updateRequest } from '@/utils/controller/requestController';
import ToastMessage from '@/components/Toast';
import { Pencil, Trash } from '@/components/Icon';
import {useRouter} from 'next/router'


const EditAndDelete = ({ requestedData }) => {
  const router = useRouter();
  const handleRequestDelete = async (id) => {
    const dataToSubmit = { data: { publishedAt: null } };
    async function updateCommentToStrapi() {
      const updateResponse = await updateRequest({
        data: dataToSubmit,
        id: requestedData.id,
      });
      if (updateResponse) {
        // setAllComments(updateResponse.attributes.comments);
        ToastMessage({ type: 'success', message: 'Request Deleted' });
        router.reload();
      } else {
        ToastMessage({
          type: 'error',
          message: 'Something went wrong, while deleting.',
        });
      }
    }
    if ('completed' !== requestedData.attributes.status) {
      updateCommentToStrapi();
    }
  };
  return (
    <div className="flex gap-3 items-center justify-end">
      {requestedData.attributes.status === 'pending' && (
        <button className="p-2 bg-gray-100 rounded-lg hover:shadow-md">
          <Pencil />
        </button>
      )}

      {['rejected', 'pending', 'approved', 'closed'].includes(
        requestedData.attributes.status
      ) && (
        <button
          className="p-2 bg-red-500 rounded-lg hover:shadow-md"
          onClick={() => handleRequestDelete(requestedData.id)}
        >
          <Trash stroke="white" />
        </button>
      )}
    </div>
  );
};

export default EditAndDelete;
