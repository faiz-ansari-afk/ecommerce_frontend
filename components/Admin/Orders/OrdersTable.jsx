import React, { useEffect, useState } from 'react';
import { getAllOrdersOfAllUsers } from '@/utils/controller/orderController';

import { getRelativeDay } from '@/utils/helper';
import moment from 'moment/moment';
import Select from 'react-select';
import Pagination from '@/components/Pagination';
import EditOrders from './EditOrders';

const OrdersTable = ({ orders: _orders, pagination: { pagination } }) => {
  const [orders, setOrders] = useState(_orders);

  const [open, setOpen] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPage, setTotalPage] = useState(pagination.pageCount);
  const [loading, setLoading] = useState(false);

  const [currentStatus, setCurrentStatus] = useState('all');

  useEffect(() => {
    const fetchData = async (status) => {
      setLoading(true);
      const orders = await getAllOrdersOfAllUsers({
        pageSize,
        pageNumber: currentPage,
        status: status ? status : null,
      });
      setOrders(orders.data);

      setCurrentPage(orders.meta.pagination.page);
      setTotalPage(orders.meta.pagination.pageCount);
      setLoading(false);
    };
    if (currentStatus !== 'all') {
      fetchData(currentStatus);
    } else {
      fetchData();
    }
  }, [currentPage, pageSize, currentStatus]);
  const columnHeading = [
    { name: 'Order No' },
    { name: 'Customer ' },
    { name: 'Total' },
    { name: 'Status' },
    { name: 'Delivery By' },
    { name: 'Delivery At' },
    { name: 'Recieved At' },
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
    { value: 'ordered', label: 'ordered' },
    { value: 'completed', label: 'completed' },
    { value: 'cancelled', label: 'cancelled' },
    { value: 'out for delivery', label: 'out for delivery' },
  ];

  return (
    <div className="relative pb-32">
      {open && (
        <div className="fixed m-3 rounded-lg md:m-12 bg-white border inset-0 z-[999]">
          <EditOrders setOpen={setOpen} currentOrderData={currentOrderData} />
        </div>
      )}
      <div className="flex items-center justify-between pb-4">
        <div className="flex  items-center gap-1">
          <span className="text-sm">Sort By Status:</span>
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

        {/* <div className="relative">
          <SearchBar />
        </div> */}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
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
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((skeleton) => (
                <tr className="border" key={skeleton}>
                  {[1, 2, 3, 4, 5, 6, 7].map((column) => (
                    <td key={column + Math.random()}>
                      <span className="h-3 w-full px-2 py-3 my-3 bg-gray-300 rounded-lg flex items-center animate-pulse "></span>
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length < 1 ? (
              <tr>
                <td colspan="7" align="center" className="py-3">
                  No data to show
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const [deliveryDate,classBasedOnDelivery] = order.attributes.expected_delivery_date ? getRelativeDay(order.attributes.expected_delivery_date,order.attributes.status) : ["Not assigned","text-rose-600"]
                return (
                  <tr
                    className="bg-white border-b even:bg-gray-100  hover:bg-gray-300"
                    key={index}
                  >
                    <td className="pl-6 py-4">{order.id}</td>
                    <td className="px-6 py-4">
                      {order.attributes.users_permissions_user.data
                        ? order.attributes.users_permissions_user.data
                            .attributes.username
                        : 'Null'}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {order.attributes.final_price}
                    </td>
                    <td className={`px-6 py-4 truncate`}>
                      <span
                        className={`
                      ${
                        order.attributes.status === 'completed' &&
                        'text-lime-700'
                      }
                      ${
                        order.attributes.status === 'out for delivery' &&
                        'bg-black p-1 rounded-lg px-2 text-indigo-400'
                      }
                      ${
                        order.attributes.status === 'cancelled' &&
                        'text-rose-800 '
                      }
                      ${
                        order.attributes.status === 'ordered' &&
                        'bg-lime-400 p-1 rounded-lg px-2 text-black'
                      }
                      `}
                      >
                        {order.attributes.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.attributes.delivery_guy_details.data ? (
                        order.attributes.delivery_guy_details.data.attributes
                          .username
                      ) : (
                        <span className="text-sm text-rose-500">None</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 truncate ${classBasedOnDelivery}`}>
                      {deliveryDate}
                    </td>
                    <td className="px-6 py-4 truncate">
                      {moment(order.attributes.createdAt).fromNow()}
                    </td>
                    <td className="px-6 py-4">
                      {/* {order.attributes.status === 'completed' ? (
                        <button className="font-mediumtext-black">
                          Closed
                        </button>
                      ) : ( */}
                      <button
                        className="font-medium text-blue-600  hover:underline"
                        onClick={() => {
                          // if (order.attributes.status !== 'completed') {
                          setOpen(true);
                          setCurrentOrderData(order);
                          // }
                        }}
                        // disabled={order.attributes.status === 'completed'}
                        title="Edit"
                      >
                        Edit
                      </button>
                      {/* )} */}
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

export default OrdersTable;
