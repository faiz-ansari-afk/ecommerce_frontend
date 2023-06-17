import React, { useEffect, useState } from 'react';

import { getRequest } from '@/utils/controller/requestController';

import moment from 'moment/moment';
import Select from 'react-select';
import Pagination from '@/components/Pagination';
import EditRequests from './EditRequests';
// import EditOrders from './EditOrders';

const RequestsTable = ({ requests: _requests, pagination: { pagination }, user }) => {
  const [requests, setRequests] = useState(_requests);

  const [open, setOpen] = useState(false);
  const [currentRequestData, setCurrentRequestData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPage, setTotalPage] = useState(pagination.pageCount);
  const [loading, setLoading] = useState(false);

  const [currentStatus, setCurrentStatus] = useState('all');

  useEffect(() => {
    const fetchData = async ({ status, filterByUserId, all }) => {
      setLoading(true);
      const requests = await getRequest({
        filterBy: {
          all,
          status,
          requested_by: filterByUserId,
          pagination: true,
          pageNumber: currentPage,
          pageSize,
        },
      });
      setRequests(requests.data);

      setCurrentPage(requests.meta.pagination.page);
      setTotalPage(requests.meta.pagination.pageCount);
      setLoading(false);
    };
    if (currentStatus !== 'all') {
      fetchData({ status: currentStatus, filterByUserId: null, all: false });
    }
    if (currentStatus === 'all') {
      fetchData({ status: null, filterByUserId: null, all: true });
    }
  }, [currentPage, pageSize, currentStatus]);
  const columnHeading = [
    { name: 'Request No' },
    { name: 'Customer ' },
    { name: 'Title' },
    { name: 'Status' },
    { name: 'Time' },
    { name: 'Subs' },
    { name: 'Comments' },
    { name: 'Action' },
  ];

  const pageSizeList = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
  ];
  const statusList = [
    { value: 'all', label: 'all' },
    { value: 'approved', label: 'approved' },
    { value: 'pending', label: 'pending' },
    { value: 'completed', label: 'completed' },
    { value: 'cancelled', label: 'cancelled' },
    { value: 'rejected', label: 'rejected' },
  ];
  return (
    <div className="relative pb-32">
      {open && (
        <div className="fixed m-3 rounded-lg md:m-12 bg-white border inset-0 z-[999]">
          <EditRequests setOpen={setOpen} currentRequestData={currentRequestData} user={user} />
        </div>
      )}
      <div className="flex items-center justify-between pb-4">
        <div className="flex  items-center gap-1">
          <span className="">Sort By Status:</span>
          <div className="min-w-[150px] md:min-w-[200px]">
            <Select
              instanceId={'status list'}
              onChange={(option) => setCurrentStatus(option.label)}
              options={statusList}
              defaultValue={statusList[0]}
            />
          </div>
        </div>
        <div className="justify-end flex-shrink-0">
          <Select
            instanceId={'new one'}
            onChange={(option) => setPageSize(parseInt(option.label))}
            options={pageSizeList}
            defaultValue={pageSizeList[1]}
          />
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          className="w-full text-sm text-left text-gray-500 "
          cellSpacing="0"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              {columnHeading.map((heading, index) => (
                <th scope="col" className="px-6 border py-3" key={index}>
                  {heading.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7].map((skeleton) => (
                <tr className="border" key={skeleton}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((column) => (
                    <td key={column + Math.random()}>
                      <span className="h-3 w-full px-2 py-3  bg-gray-300  flex items-center animate-pulse "></span>
                    </td>
                  ))}
                </tr>
              ))
            ) : requests.length < 1 ? (
              <tr>
                <td colspan="8" align="center" className="py-3">
                  No data to show
                </td>
              </tr>
            ) : (
              requests.map((request, index) => {
                return (
                  <tr
                    className="bg-white border-b even:bg-gray-100  hover:bg-gray-300"
                    key={index}
                  >
                    <td className="pl-6 py-4">{request.id}</td>
                    <td className="px-6 py-4">
                      {request.attributes.requested_by.data
                        ? request.attributes.requested_by.data.attributes
                            .username
                        : 'Null'}
                    </td>
                    <td className="px-6 py-4 truncate">
                      {request.attributes.name}
                    </td>
                    <td className={`px-6 py-4 `}>
                      <span
                        className={`
                      ${
                        request.attributes.status === 'completed' &&
                        'text-lime-700'
                      }
                      ${
                        request.attributes.status === 'pending' &&
                        'bg-black p-1 rounded-lg px-2 text-indigo-400'
                      }
                      ${
                        request.attributes.status === 'cancelled' &&
                        'text-rose-800 '
                      }
                      ${
                        request.attributes.status === 'approved' &&
                        'bg-lime-400 p-1 rounded-lg px-2 text-black'
                      }
                      ${
                        request.attributes.status === 'rejected' &&
                        'bg-rose-800 p-1 rounded-lg px-2 text-white'
                      }
                      `}
                      >
                        {request.attributes.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate">
                      {moment(request.attributes.createdAt).fromNow()}
                    </td>
                    <td className="px-6 py-4" align="center">
                      {request.attributes.subscribers.users.length}
                    </td>
                    <td className="px-6 py-4" align="center">
                      {request.attributes.comments.length}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        className="font-medium text-blue-600  hover:underline"
                        onClick={() => {
                          setOpen(true);
                          setCurrentRequestData(request);
                        }}
                        title="Edit"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={(pageNumber) => {
            if (!loading) setCurrentPage(pageNumber);
          }}
        />
      )}
    </div>
  );
};

export default RequestsTable;
