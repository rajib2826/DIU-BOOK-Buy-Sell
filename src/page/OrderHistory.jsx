import React, { useContext, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { StoreContext } from '../components/Context/StoreContext';
import { useAuth } from '../components/Auth/AuthContext';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const OrderHistory = () => {
  const { orderLoading, orderBooks } = useContext(StoreContext);
  const { loggedInUser } = useAuth();
  const orders = orderBooks?.filter(
    (order) => order?.customer?.email === loggedInUser?.email
  );
  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='bg-white'>
        <div className='pb-12 pt-6'>
          <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
            <div className='mx-auto px-4 lg:px-0'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
                Order history
              </h1>
              <p className='mt-2 text-sm text-gray-600'>
                Check the status of recent orders, manage returns, and discover
                similar products
              </p>
            </div>
          </div>

          {orderLoading && (
            <div className='my-40'>
              <div className='flex items-center justify-center'>
                <img
                  className='w-28'
                  src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                  alt=''
                />
              </div>
            </div>
          )}

          {!orderLoading && orders?.length === 0 && (
            <div className='my-32'>
              <div className='flex items-center justify-center'>
                <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                  No order history found!
                </div>
              </div>
            </div>
          )}

          {!orderLoading && orders?.length > 0 && (
            <div className='mt-10'>
              <h2 className='sr-only'>Recent orders</h2>
              <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
                <div className='mx-auto space-y-8 sm:px-4 lg:px-0'>
                  {orders?.map((order) => (
                    <div
                      key={order?.orderId}
                      className='border-b border-t border-gray-200 bg-white shadow-xl sm:rounded-lg sm:border mb-12'
                    >
                      <div className='flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-6 sm:gap-x-6 sm:p-6'>
                        <div className='font-semibold text-gray-900'>
                          <span className='font-bold'>Order</span> #
                          {order?.orderId?.substring(0, 8)}
                        </div>
                        <dl className='grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-5'>
                          <div>
                            <dt className='font-medium text-gray-900'>
                              Tracking number
                            </dt>
                            <dd className='mt-1 text-gray-600'>
                              #{Math.floor(Math.random() * 10000000) + 1}
                            </dd>
                          </div>
                          <div>
                            <dt className='font-medium text-gray-900'>
                              Date placed
                            </dt>
                            <dd className='mt-1 text-gray-600'>
                              <span>
                                {new Date(
                                  order?.timestamp?.seconds * 1000
                                )?.toLocaleDateString('en-US', options)}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className='font-medium text-gray-900'>
                              Total amount
                            </dt>
                            <dd className='font-medium text-gray-600'>
                              <span className='text-xl font-bold '>৳</span>{' '}
                              {order?.total}
                            </dd>
                          </div>
                          <div>
                            <dt className='font-medium text-gray-900'>
                              Payment Status
                            </dt>
                            <dd className='mt-1 text-gray-600'>
                              {order?.paid ? 'Paid' : 'Unpaid'}
                            </dd>
                          </div>
                          {order?.paid && (
                            <div>
                              <dt className='font-medium text-gray-900'>
                                Paid At
                              </dt>
                              <dd className='mt-1 text-gray-600'>
                                {order?.transitionDate?.substring(0, 10)}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div>
                          <Link
                            to={`/invoice/?orderId=${order?.orderId}`}
                            className='text-md font-semibold leading-6 px-4 py-2 text-white transition-colors duration-300 rounded shadow-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
                          >
                            View Invoice <span aria-hidden='true'>→</span>
                          </Link>
                        </div>
                      </div>

                      {/* Products */}
                      <h4 className='sr-only'>Items</h4>
                      <ul
                        role='list'
                        className='divide-y divide-gray-200 sm:grid sm:grid-cols-3 sm:gap-x-6'
                      >
                        {order?.books?.map((book) => (
                          <li
                            key={book?.listingId}
                            className='p-4 sm:p-6 sm:border-l sm:border-t-0'
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
                                <div className='font-medium text-gray-900 sm:flex sm:justify-between sm:flex-col'>
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

                      <div className='border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8'>
                        <h4 className='sr-only'>Status</h4>
                        <p className='flex text-sm font-medium text-gray-900'>
                          {order?.status === 'Delivered' && (
                            <CheckCircleIcon
                              className='h-5 w-5 text-green-500 mr-1.5'
                              aria-hidden='true'
                            />
                          )}
                          {order?.status} on{' '}
                          <span className='ml-1'>
                            {order?.status === 'Delivered'
                              ? new Date(
                                  order?.deliveryOn?.seconds * 1000
                                )?.toLocaleDateString('en-US', options)
                              : new Date(
                                  order?.timestamp?.seconds * 1000
                                )?.toLocaleDateString('en-US', options)}
                          </span>
                        </p>
                        <div className='mt-6' aria-hidden='true'>
                          <div className='overflow-hidden rounded-full bg-gray-200'>
                            <div
                              className={`h-2 rounded-full ${
                                order?.status === 'Cancelled'
                                  ? 'bg-red-500'
                                  : 'bg-indigo-600'
                              }`}
                              style={{
                                width: `calc((${
                                  order?.status === 'Order placed'
                                    ? 0
                                    : order?.status === 'Processing'
                                    ? 1
                                    : order?.status === 'Shipped'
                                    ? 2
                                    : 3
                                } * 2 + 2) / 8 * 100%)`,
                              }}
                            />
                          </div>
                          <div className='mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid'>
                            <div
                              className={classNames(
                                order?.status === 'Order placed'
                                  ? 'text-indigo-600'
                                  : '',
                                'text-center'
                              )}
                            >
                              Order placed
                            </div>
                            <div
                              className={classNames(
                                order?.status === 'Processing'
                                  ? 'text-indigo-600'
                                  : '',
                                'text-center'
                              )}
                            >
                              Processing
                            </div>
                            <div
                              className={classNames(
                                order?.status === 'Shipped'
                                  ? 'text-indigo-600'
                                  : '',
                                'text-center'
                              )}
                            >
                              Shipped
                            </div>
                            <div
                              className={classNames(
                                order?.status === 'Delivered'
                                  ? 'text-indigo-600'
                                  : '',
                                'text-right'
                              )}
                            >
                              Delivered
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Billing */}
                      <div>
                        <h2 className='sr-only'>Billing Summary</h2>

                        <div className='bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8'>
                          <dl className='grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7'>
                            <div>
                              <dt className='text-base font-medium text-gray-900'>
                                Billing address
                              </dt>
                              <dd className='mt-3 text-gray-600 '>
                                <span className='block'>
                                  {order?.delivery?.landmark}
                                </span>
                                <span className='block mt-2'>
                                  {order?.delivery?.address}
                                </span>
                              </dd>
                            </div>
                            <div>
                              <dt className='text-base font-medium text-gray-900'>
                                Payment information
                              </dt>
                              <dd className='mt-3 text-gray-600 '>
                                <span className='block'>
                                  {order?.delivery?.method}
                                </span>
                                <span className='block mt-2'>
                                  {order?.delivery?.method === 'COD'
                                    ? 'Cash on delivery'
                                    : 'Paid with SSLCOMMERZ'}
                                </span>
                              </dd>
                            </div>
                          </dl>

                          <dl className='mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0'>
                            <div className='flex items-center justify-between pb-2'>
                              <dt className='text-gray-600'>Subtotal</dt>
                              <dd className='font-medium text-gray-900'>
                                <span className='text-xl font-bold'>৳</span>{' '}
                                {order?.subtotal}
                              </dd>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                              <dt className='text-gray-600'>Delivery</dt>
                              <dd className='font-medium text-gray-900'>
                                <span className='text-xl font-bold'>৳</span> 10
                              </dd>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                              <dt className='text-gray-600'>Charge</dt>
                              <dd className='font-medium text-gray-900'>
                                <span className='text-xl font-bold'>৳</span> 0
                              </dd>
                            </div>
                            <div className='flex items-center justify-between pt-3'>
                              <dt className='font-medium text-gray-900'>
                                Order total
                              </dt>
                              <dd className='font-medium text-indigo-600'>
                                <span className='text-xl font-bold'>৳</span>{' '}
                                {order?.total}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
