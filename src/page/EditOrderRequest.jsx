import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../components/Context/StoreContext';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';

const EditOrderRequest = ({ setEditModal, selectedOrder }) => {
  const { orderLoading, orderBooks } = useContext(StoreContext);
  const [viewOrder, setViewOrder] = useState({});

  useEffect(() => {
    if (!orderLoading) {
      const order = orderBooks?.find(
        (order) => order?.orderId === selectedOrder
      );
      setViewOrder(order);
    }
  }, [orderBooks, selectedOrder, orderLoading]);

  const handleStatusChange = async ({ orderId, orderStatus }) => {
    if (orderId?.length === '') {
      toast.error('Please select the order first!');
      return;
    }
    const loading = toast.loading('Please wait...');

    try {
      // update order status on database
      const orderData = {
        ...viewOrder,
        status: orderStatus,
      };

      // update order status on database
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, orderData, { merge: true });

      setViewOrder({});
      setEditModal(false);

      toast.dismiss(loading);
      toast.success('Order status changed successfully!');
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter saturate-150 backdrop-blur-sm'>
        <div className='max-w-2xl mx-auto py-4 sm:py-8 px-4 sm:px-8 sm:max-w-5xl'>
          <div className='flex items-center justify-center'>
            <div className='bg-white border border-gray-100 rounded-lg shadow-4xl'>
              <div className='flex items-center justify-between pt-6'>
                <div className='px-4 sm:px-8'>
                  <h3 className='text-lg sm:text-xl text-gray-800 leading-6 text-brand-accent-700 font-semibold'>
                    Order Details
                  </h3>
                  <p className='mt-1 max-w-2xl text-base text-gray-700'>
                    Buyer details with order information.
                  </p>
                </div>

                <button
                  className='justify-end p-1 mr-4 -mt-6 transition-colors duration-200 transform rounded-md hover:bg-opacity-25 text-blue-600 hover:bg-blue-400 focus:outline-none'
                  type='button'
                  aria-label='Close'
                  aria-hidden='true'
                  onClick={() => setEditModal(false)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='icon icon-tabler icon-tabler-circle-x'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                    <circle cx='12' cy='12' r='9'></circle>
                    <path d='M10 10l4 4m0 -4l-4 4'></path>
                  </svg>
                </button>
              </div>

              {orderLoading && (
                <div className='py-4'>
                  <div className='flex items-center'>
                    <img
                      className='w-16 ml-8'
                      src='https://media.tenor.com/On7kvXhzml4AAAAj/orderLoading-gif.gif'
                      alt=''
                    />
                  </div>
                </div>
              )}

              {!orderLoading && (
                <>
                  <div className='px-4 sm:px-8 pt-6 sm:grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12'>
                    <div className='flex flex-col'>
                      <div className='mb-4'>
                        <p className='text-base font-semibold tracking-normal text-gray-800'>
                          Order ID:{' '}
                          <span className='font-normal text-gray-700'>
                            #{viewOrder?.orderId}
                          </span>
                        </p>
                        <p className='text-base font-semibold text-gray-800 mt-3'>
                          Order Placed:{' '}
                          <span className='font-normal text-gray-700'>
                            {new Date(
                              viewOrder?.timestamp?.seconds * 1000
                            )?.toLocaleDateString('en-GB')}
                          </span>
                        </p>
                        {viewOrder?.status === 'Delivered' && (
                          <p className='text-base font-semibold text-gray-800 mt-3'>
                            Order Delivered:{' '}
                            <span className='font-normal text-gray-700'>
                              {new Date(
                                viewOrder?.deliveryOn?.seconds * 1000
                              )?.toLocaleDateString('en-GB')}
                            </span>
                          </p>
                        )}
                      </div>

                      <p className='text-base font-semibold tracking-normal text-gray-800'>
                        Tracking Id:{' '}
                        <span className='font-normal text-gray-700'>
                          #{Math.floor(Math.random() * 10000000) + 1}
                        </span>
                      </p>
                      <p className='text-base font-semibold text-gray-800 mt-3'>
                        Order Status:{' '}
                        <span className='font-normal text-gray-700'>
                          {viewOrder?.status}
                        </span>
                      </p>
                      <p className='text-base font-semibold text-gray-800 mt-3'>
                        Payment Status:{' '}
                        <span className='font-normal text-gray-700'>
                          {viewOrder?.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </p>
                      <p className='text-base font-semibold text-gray-800 mt-3'>
                        Total Amount:{' '}
                        <span className='font-normal text-gray-700'>
                          <span className='text-lg font-bold'>৳</span>{' '}
                          {viewOrder?.total}
                        </span>
                      </p>
                    </div>

                    <div className='flex flex-col mt-6 sm:mt-0'>
                      <dl className='text-base'>
                        <div>
                          <dt className='font-semibold text-gray-800'>
                            Buyer Information
                          </dt>
                          <div className='mt-3 text-gray-700 space-y-2'>
                            <img
                              alt=''
                              src={viewOrder?.customer?.photo}
                              className='object-cover rounded-full h-20 w-20'
                            />
                            <p className='text-base font-semibold text-gray-800 mt-3'>
                              Name:{' '}
                              <span className='font-normal text-gray-700'>
                                {viewOrder?.customer?.name}
                              </span>
                            </p>
                            <p className='text-base font-semibold text-gray-800 mt-3'>
                              Email:{' '}
                              <span className='font-normal text-gray-700'>
                                {viewOrder?.customer?.email}
                              </span>
                            </p>
                            <p className='text-base font-semibold text-gray-800 mt-3'>
                              Phone:{' '}
                              <span className='font-normal text-gray-700'>
                                {viewOrder?.delivery?.phone}
                              </span>
                            </p>
                            <p className='text-base font-semibold text-gray-800 mt-3'>
                              Landmark:{' '}
                              <span className='font-normal text-gray-700'>
                                {viewOrder?.delivery?.landmark}
                              </span>
                            </p>
                            <p className='text-base font-semibold text-gray-800 mt-3'>
                              Address:{' '}
                              <span className='font-normal text-gray-700'>
                                {viewOrder?.delivery?.address}
                              </span>
                            </p>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                  {/* Products */}
                  <div className='px-4 sm:px-8 pt-6 flex flex-col'>
                    <p className='text-base sm:text-lg text-gray-800 font-medium tracking-wide'>
                      Book Details
                    </p>
                  </div>
                  <ul
                    role='list'
                    className='divide-y divide-gray-200 sm:grid sm:grid-cols-2 sm:gap-x-6 mb-4'
                  >
                    {viewOrder?.books?.map((book) => (
                      <li
                        key={book?.listingId}
                        className='p-4 sm:p-6 border-l border-t-0 border-b border-gray-200'
                      >
                        <div className='flex items-center sm:items-start '>
                          <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md bg-gray-200 sm:h-40 sm:w-32'>
                            <img
                              src={book?.bookCover}
                              alt=''
                              className='h-full w-full object-cover object-center'
                            />
                          </div>
                          <div className='ml-6 text-sm'>
                            <div className='font-medium text-gray-800 sm:flex sm:justify-between sm:flex-col'>
                              <h5>{book?.name}</h5>
                              <p className='text-gray-500 mt-3'>
                                {book?.sellerDepartment}
                              </p>
                              <p className='text-gray-500 mt-3'>
                                Quantity {book?.quantity}
                              </p>
                              <p className='mt-3 flex text-base'>
                                <span className='text-base mr-1 font-bold'>
                                  ৳
                                </span>{' '}
                                {book?.sellingPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* Billing */}
                  <div>
                    <h2 className='sr-only'>Billing Summary</h2>

                    <div className='bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8'>
                      <dl className='grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7'>
                        <div>
                          <dt className='text-base font-medium text-gray-800'>
                            Billing address
                          </dt>
                          <dd className='mt-3 text-gray-600 '>
                            <span className='block'>
                              {viewOrder?.delivery?.landmark}
                            </span>
                            <span className='block mt-2'>
                              {viewOrder?.delivery?.address}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className='text-base font-medium text-gray-800'>
                            Payment information
                          </dt>
                          <dd className='mt-3 text-gray-600 '>
                            <span className='block'>
                              {viewOrder?.delivery?.method}
                            </span>
                            <span className='block mt-2'>
                              {viewOrder?.delivery?.method === 'COD'
                                ? 'Cash on delivery'
                                : 'Paid with SSLCOMMERZ'}
                            </span>
                          </dd>
                        </div>
                      </dl>

                      <dl className='mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0'>
                        <div className='flex items-center justify-between pb-2'>
                          <dt className='text-gray-600'>Subtotal</dt>
                          <dd className='font-medium text-gray-800'>
                            <span className='text-xl font-bold'>৳</span>{' '}
                            {viewOrder?.subtotal}
                          </dd>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                          <dt className='text-gray-600'>Delivery</dt>
                          <dd className='font-medium text-gray-800'>
                            <span className='text-xl font-bold'>৳</span> 10
                          </dd>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                          <dt className='text-gray-600'>Charge</dt>
                          <dd className='font-medium text-gray-800'>
                            <span className='text-xl font-bold'>৳</span> 0
                          </dd>
                        </div>
                        <div className='flex items-center justify-between pt-3'>
                          <dt className='font-medium text-gray-800'>
                            Order total
                          </dt>
                          <dd className='font-medium text-indigo-600'>
                            <span className='text-xl font-bold'>৳</span>{' '}
                            {viewOrder?.total}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className='px-4 sm:px-8 py-3 my-6 mx-4 flex items-center justify-between border border-indigo-100 bg-indigo-50 rounded-lg shadow-4xl'>
                    <div className='flex flex-col'>
                      <p className='text-base sm:text-lg text-indigo-500 font-medium tracking-wide'>
                        Order Status
                      </p>
                      <p className='text-sm text-gray-500 tracking-wide'>
                        Change order status
                      </p>
                    </div>

                    <select
                      className={`block w-48 font-semibold py-2 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 tracking-wide  transition-colors duration-200  focus:focus:border-primary-500 ${
                        viewOrder?.status === 'Order placed'
                          ? 'text-amber-600'
                          : viewOrder?.status === 'Processing'
                          ? 'text-purple-500'
                          : viewOrder?.status === 'Shipped'
                          ? 'text-cyan-500'
                          : viewOrder?.status === 'Delivered'
                          ? 'text-green-600'
                          : viewOrder?.status === 'Cancelled'
                          ? 'text-red-500'
                          : 'text-blue-500'
                      }`}
                      name='status'
                      defaultValue={viewOrder?.status}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: viewOrder?.orderId,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option
                        value='Order placed'
                        selected={viewOrder?.status === 'Order placed'}
                      >
                        Order placed
                      </option>
                      <option
                        value='Processing'
                        selected={viewOrder?.status === 'Processing'}
                      >
                        Processing
                      </option>
                      <option
                        value='Shipped'
                        selected={viewOrder?.status === 'Shipped'}
                      >
                        Shipped
                      </option>
                      <option
                        value='Delivered'
                        selected={viewOrder?.status === 'Delivered'}
                      >
                        Delivered
                      </option>
                      <option
                        value='Cancelled'
                        selected={viewOrder?.status === 'Cancelled'}
                      >
                        Cancelled
                      </option>
                    </select>
                  </div>
                </>
              )}

              <div className='p-4'>
                <div className='flex items-end justify-end space-x-2'>
                  <button
                    className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-yellow-600 hover:bg-yellow-700 focus:outline-none'
                    onClick={() => setEditModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-indigo-600 hover:bg-indigo-800 focus:outline-none'
                    onClick={() => setEditModal(false)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Modal Opacity */}
      <div className='opacity-30 fixed inset-0 z-40 bg-gray-900' />
    </section>
  );
};

export default EditOrderRequest;
