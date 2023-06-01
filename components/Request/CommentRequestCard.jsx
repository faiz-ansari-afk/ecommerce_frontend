import { useState, useContext, useEffect, useMemo } from 'react';
import { DataContext } from '@/store/globalstate';
import InputField from '@/components/FormComponent/InputField';
import { Warning, Avatar } from '@/components/Icon';
import { getUser } from '@/utils/controller/auth';
import { updateRequest, getSingleRequest } from '@/utils/controller/requestController';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import ToastMessage from '@/components/Toast';
/*
changing strapi user relation to user json
user:{
  id:21,
  username:"Test",
  emai;"optional",
  url:"" ? No URL to display.. final decision
}
*/
const CommentRequestCard = ({ request, user: _user }) => {
  const { dispatch, state } = useContext(DataContext);
  const [user, setUser] = useState(_user);
  useEffect(() => {
    async function getLoggedInUser() {
      const userData = await getUser(null, null);
      if (userData) {
        setUser(userData);
      }
    }
    getLoggedInUser();
  }, [state.userLoggedInGlobal]);

  const [allComments, setAllComments] = useState(
    request.attributes.comments ? request.attributes.comments : null
  );
  const [sortedComments, setSortedComments] = useState(
    allComments
      ? allComments.sort((a, b) => {
          const dateA = new Date(a.commentedAt);
          const dateB = new Date(b.commentedAt);
          return dateA - dateB;
        })
      : null
  );

  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      ToastMessage({
        type: 'warning',
        message: 'Login to add comment.',
      });
      dispatch({ type: 'TRUE_OPEN_LOGIN' });
      return;
    } else {
      dispatch({ type: 'FALSE_OPEN_LOGIN' });
    }
    if (comment.length < 8) {
      setError('Write some meaning full comment');
      return;
    }
    if (comment.length > 80) {
      setError('Please dont be rude.');
      return;
    }
    setError(null);
    const newUpdatedRequest = await getSingleRequest({id:request.id})
    const allNewComments = newUpdatedRequest.attributes.comments ? newUpdatedRequest.attributes.comments : [];
    const dataToSubmit = {
      data: {
        comments: [
          ...allNewComments,
          {
            user: {
              id: user.id,
              username: user.username,
              url: user.profile_pic
                ? `${user.profile_pic.url}`
                : 'USE_DEFAULT_PIC',
              email: user.email,
            },
            comment,
            commentedAt: new Date(),
          },
        ],
      },
    };
    async function updateCommentToStrapi() {
      const updateResponse = await updateRequest({
        data: dataToSubmit,
        id: request.id,
      });
      if (updateResponse) {
        setAllComments(updateResponse.attributes.comments);
        setComment('');
        // ToastMessage({ type: 'success', message: 'Comment Added' });
      } else {
        ToastMessage({
          type: 'error',
          message: 'Something went wrong, while commenting.',
        });
      }
    }
    if (request.attributes.comment_enabled) {
      updateCommentToStrapi();
    }
  };
  const memoizedAllComments = useMemo(() => allComments);
  useEffect(() => {
    setSortedComments(() =>
      allComments.sort((a, b) => {
        const dateA = new Date(a.commentedAt);
        const dateB = new Date(b.commentedAt);
        return dateA - dateB;
      })
    );
  }, [memoizedAllComments]);
  if (request.attributes.status === 'pending') {
    return (
      <div className="py-3 px-1 md:p-3 border-2 rounded-lg h-[80vh] md:shadow-md mt-24 md:mt-0">
        <p className="text-2xl text-gray-600 mb-4 lg:text-3xl">
          Comments/Discussion
        </p>
        <div
          className="bg-rose-100 flex gap-2 items-center border-l-4 border-red-500 text-rose-700 lg:p-4 md:p-2 p-1 my-3"
          role="alert"
        >
          <p className="font-bold">
            <Warning />
          </p>
          <p>Comments will be enabled, once request is approved.</p>
        </div>
        <div>
          {/* https://assets5.lottiefiles.com/packages/lf20_s9lvjg2e.json */}
          <Player
            autoplay
            loop
            src="https://assets5.lottiefiles.com/packages/lf20_s9lvjg2e.json"
            style={{ height: '300px', width: '300px' }}
          ></Player>
          <p className="text-center text-gray-500">Processing your request</p>
        </div>
      </div>
    );
  }
  const handleDelete = async (id) => {
    
    const newUpdatedRequest = await getSingleRequest({id:request.id})
    const allNewComments = newUpdatedRequest.attributes.comments ? newUpdatedRequest.attributes.comments : [];
    const updatedComments = allNewComments.filter((comment) => comment.id !== id);
    const dataToSubmit = {
      data: {
        comments: [...updatedComments],
      },
    };
    async function updateCommentToStrapi() {
      const updateResponse = await updateRequest({
        data: dataToSubmit,
        id: request.id,
      });
      if (updateResponse) {
        setAllComments(updateResponse.attributes.comments);

        ToastMessage({ type: 'success', message: 'Comment Deleted' });
      } else {
        ToastMessage({
          type: 'error',
          message: 'Something went wrong, while deleting.',
        });
      }
    }
    if (request.attributes.comment_enabled) {
      updateCommentToStrapi();
    }
  };
  return (
    <div className="py-3 px-1 md:p-3 border-2 rounded-lg h-[80vh] md:shadow-md mt-24 md:mt-0">
      <p className="text-2xl text-gray-600 mb-4 lg:text-3xl">
        Comments/Discussion
      </p>
      {request.attributes.comment_enabled &&
        request.attributes.status === 'approved' && (
          <>
            <form onSubmit={handleComment}>
              <div className="flex gap-2 flex-shrink-0 items-center">
                <div className="flex-1">
                  <InputField
                    type="comment"
                    name="comment"
                    error={error}
                    onchange={(e) => setComment(e.target.value)}
                    value={comment}
                    disabled={!request.attributes.comment_enabled}
                  >
                    Write your views here*
                  </InputField>
                </div>
                <div className="">
                  <button
                    type="submit"
                    disabled={comment.length === 0}
                    className={`px-3 md:px-3 lg:px-6  py-1 bg-black text-white rounded-full hover:shadow-lg ${
                      comment.length === 0 && 'cursor-not-allowed'
                    }`}
                  >
                    submit
                  </button>
                </div>
              </div>
            </form>
            <div
              className="bg-yellow-100 flex gap-2 items-center border-l-4 border-yellow-500 text-yellow-700 lg:p-4 md:p-2 p-1 my-3"
              role="alert"
            >
              <p className="font-bold">
                <Warning />
              </p>
              <p>Ulta seedha comment kiya to ban lag jayga!</p>
            </div>
          </>
        )}
      {!request.attributes.comment_enabled && (
        <div
          className="bg-rose-100 flex gap-2 items-center border-l-4 border-red-500 text-rose-700 lg:p-4 md:p-2 p-1 my-3"
          role="alert"
        >
          <p className="font-bold">
            <Warning />
          </p>
          <p>Comments are disabled for this request.</p>
        </div>
      )}
      <div
        className={`comment_container  mt-6  h-1/2 pr-4 pb-6 space-y-3 ${
          sortedComments.length > 2 ? 'overflow-y-scroll' : ''
        } `}
      >
        {sortedComments && sortedComments.length > 0 ? (
          sortedComments.reverse().map((comment, index) => {
            const commentedAtRaw = comment.commentedAt;
            const date = new Date(commentedAtRaw);
            const time = date.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            });
            const formattedDate = date.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
            });
            const timeStamp = time + ', ' + formattedDate;
            return (
              <div
                key={index}
                className={`  px-3 py-4 rounded-lg ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex flex-col  justify-center">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs text-gray-500">
                      {comment.user.username}
                    </p>
                    {user &&
                      user.username === comment.user.username &&
                      request.attributes.comment_enabled && (
                        <button
                          className="text-xs text-gray-500 underline"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </button>
                      )}
                  </div>
                  {!comment.isBlock ? (
                    <p className="text-sm">{comment.comment}</p>
                  ) : (
                    <p className="text-rose-700">{comment.block_reason}</p>
                  )}
                  {!comment.isBlock ? (
                    <p className="text-right text-xs">{timeStamp}</p>
                  ) : (
                    <p className="text-right text-xs text-red-700">
                      Comment block, to protect user
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 bg-gray-100 rounded-lg px-3 py-3">
            No comments to show
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentRequestCard;
