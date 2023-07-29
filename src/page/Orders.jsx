import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../components/Context/StoreContext';
import { useAuth } from '../components/Auth/AuthContext';
import { PencilIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import EditOrderRequest from './EditOrderRequest';

const Orders = () => {
  const { orderLoading, orderBooks } = useContext(StoreContext);
  const { loggedInUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState('');
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const orders = orderBooks
    ?.map((order) =>
      order?.books
        ?.filter((book) => book?.sellerEmail === loggedInUser?.email)
        .map((item) => ({
          books: {
            listingId: item?.listingId,
            bookCover: item?.bookCover,
            name: item?.name,
            quantity: item?.quantity,
            sellingPrice: item?.sellingPrice,
            department: item?.sellerDepartment,
          },
          seller: {
            sellerName: item?.sellerName,
            sellerEmail: item?.sellerEmail,
            sellerDepartment: item?.sellerDepartment,
            sellerPhoto: item?.sellerPhoto,
            sellerPhone: item?.sellerPhone,
            sellerAddress: item?.sellerAddress,
          },
          customer: order?.customer,
          delivery: order?.delivery,
          order: {
            orderId: order?.orderId,
            orderDate: new Date(
              order?.timestamp?.seconds * 1000
            )?.toLocaleDateString('en-GB'),
            orderStatus: order?.status,
            orderPaid: order?.paid,
            orderTotal: order?.total,
          },
        }))
    )
    ?.flat();

  return (
    <>
      {/* Edit Order Modal */}
      {editModal && (
        <EditOrderRequest
          setEditModal={setEditModal}
          selectedOrder={selectedOrder}
        />
      )}

      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-6 pb-16 px-4 sm:px-6 lg:px-8'>
          <div>
            <div className='sm:flex sm:items-center'>
              <div className='sm:flex-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>Orders</h1>
                <p className='mt-2 text-sm text-gray-700'>
                  All your orders are here. You can see your orders and cancel
                  them.
                </p>
              </div>
            </div>
            <div className='mt-8 flex flex-col'>
              <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-300'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                          >
                            Book Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Price
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Buyer Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Buyer Number
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Order Placed
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Status
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          />
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {orderLoading && (
                          <tr>
                            <td className='whitespace-nowrap py-4'>
                              <div className='flex items-center'>
                                <img
                                  className='w-16 ml-8'
                                  src='https://media.tenor.com/On7kvXhzml4AAAAj/orderLoading-gif.gif'
                                  alt=''
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                        {!orderLoading &&
                          orders?.length > 0 &&
                          orders?.map((item) => (
                            <tr key={item?.order?.orderId}>
                              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0'>
                                    <img
                                      className='h-10 w-10 rounded-lg'
                                      src={item?.books?.bookCover}
                                      alt=''
                                    />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {item?.books?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  <span className='text-base mr-1 font-bold'>
                                    ৳
                                  </span>{' '}
                                  {item?.books?.sellingPrice}
                                </div>
                              </td>
                              <td className='whitespace-nowrap py-4 pr-3 text-sm'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0'>
                                    <img
                                      className='h-10 w-10 rounded-lg'
                                      src={item?.customer?.photo}
                                      alt=''
                                    />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {item?.customer?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.delivery?.phone}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.order?.orderDate}
                              </td>
                              <td
                                className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${
                                  item?.order?.orderStatus === 'Order placed'
                                    ? 'text-amber-600'
                                    : item?.order?.orderStatus === 'Processing'
                                    ? 'text-purple-500'
                                    : item?.order?.orderStatus === 'Shipped'
                                    ? 'text-cyan-500'
                                    : item?.order?.orderStatus === 'Delivered'
                                    ? 'text-green-600'
                                    : item?.order?.orderStatus === 'Cancelled'
                                    ? 'text-red-500'
                                    : 'text-blue-500'
                                }`}
                              >
                                {item?.order?.orderStatus}
                              </td>
                              <td className='whitespace-nowrap px-3 py-6 text-sm flex justify-start items-center'>
                                <button
                                  type='button'
                                  onClick={() => {
                                    setSelectedOrder(item?.order?.orderId);
                                    setEditModal(true);
                                  }}
                                  className='flex text-indigo-500 hover:text-indigo-600 font-semibold'
                                >
                                  <PencilSquareIcon className='h-5 w-5 mr-1' />{' '}
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))}

                        {!orderLoading && orderBooks?.length === 0 && (
                          <tr>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3'>
                              <div className='flex items-center'>
                                <div className='font-medium text-md text-gray-900'>
                                  No orders found
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
