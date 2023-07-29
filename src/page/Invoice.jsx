import {
  BanknotesIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  HomeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { StoreContext } from '../components/Context/StoreContext';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';

const pages = [
  { name: 'Order History', href: '/order-history', current: false },
  { name: 'Invoice', href: '#', current: true },
];

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Invoice = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  const selectedOrder = query.get('orderId');
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const confirmPayment = async (transitionId, transitionDate) => {
      if (
        viewOrder?.orderId?.length > 0 &&
        query.get('status') === 'VALID' &&
        transitionId?.length > 0 &&
        transitionDate?.length > 0
      ) {
        try {
          const bookingData = {
            status: 'Processing',
            paid: true,
            paidAt: new Date().toLocaleString('en-GB', {
              hour12: true,
            }),
            transitionId,
            transitionDate,
          };
          // update order status on database
          const bookingRef = doc(db, 'orders', viewOrder?.orderId);
          await setDoc(bookingRef, bookingData, { merge: true });

          // create a payment transaction on database
          const payload = {
            transitionId,
            transitionDate,
            transitionAmount: viewOrder?.total,
            orderId: viewOrder?.orderId,
            customer: viewOrder?.customer,
            books: viewOrder?.books,
            reason: 'Placed order',
          };
          const paymentRef = doc(db, 'payments', viewOrder?.orderId);
          await setDoc(paymentRef, payload, { merge: true });

          // send email to user
          axios
            .post(`${process.env.REACT_APP_API_URL}/mail/bookingRentPayment`, {
              name: viewOrder?.customer?.name,
              email: viewOrder?.customer?.email,
              amount: viewOrder?.total,
              transitionId,
              transitionDate,
            })
            .then((res) => {
              toast.success(res.data.message);
            })
            .catch((err) => {
              toast.error(err.data.message);
            });
        } catch (err) {
          toast.error(err?.message);
        }
      }
    };

    if (
      viewOrder?.orderId?.length > 0 &&
      query.get('status') === 'VALID' &&
      query.get('tran_id')?.length > 0 &&
      query.get('tran_date')?.length > 0
    ) {
      confirmPayment(query.get('tran_id'), query.get('tran_date'));
    }
  }, [viewOrder?.orderId, query]);

  const handlePayment = async () => {
    const loading = toast.loading('Please wait a moment...');
    // send booking data to ssl commerz server for payment
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/sslcommerz`,
        {
          bookingId: viewOrder?.orderId,
          total_amount: parseInt(viewOrder?.total, 10),
          product_name: `${viewOrder?.books?.length} books ordered from ${loggedInUser?.department} dept for ${loggedInUser?.displayName}`,
          product_category: `${loggedInUser?.department} department`,
          cus_name: loggedInUser?.displayName,
          cus_email: loggedInUser?.email,
          cus_add1: loggedInUser?.address,
          cus_phone: loggedInUser?.phone,
          ship_name: loggedInUser?.displayName,
          ship_add1: 'Dhaka',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then((res) => {
        toast.dismiss(loading);
        console.log(res);
        if (res?.data?.status === 'SUCCESS') {
          window.open(res?.data?.url, '_blank');
          navigate('/order-history');
        } else {
          toast.error('Session timeout! Please try again.');
        }
      })
      .catch((err) => {
        toast.dismiss(loading);
        toast.error(err?.message);
      });
  };

  return (
    <section className='max-w-2xl mx-auto pt-6 sm:px-6 sm:max-w-7xl'>
      {/* Breadcrumbs */}
      <nav className='flex px-4 sm:px-0 mb-4 sm:mb-6' aria-label='Breadcrumb'>
        <ol className='flex items-center space-x-4'>
          <li>
            <div>
              <Link to='/' className='text-gray-500 hover:text-gray-600'>
                <HomeIcon
                  className='flex-shrink-0 h-5 w-5'
                  aria-hidden='true'
                />
                <span className='sr-only'>Home</span>
              </Link>
            </div>
          </li>
          {pages?.map((page) => (
            <li key={page?.name}>
              <div className='flex items-center'>
                <ChevronRightIcon
                  className='flex-shrink-0 h-4 w-4 text-gray-500'
                  aria-hidden='true'
                />
                <Link
                  to={page?.href}
                  className='ml-4 text-base font-medium text-gray-700 hover:text-gray-800'
                  aria-current={page?.current ? 'page' : undefined}
                >
                  {page?.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      {!viewOrder?.paid &&
        (viewOrder?.status === 'Order placed' ||
          viewOrder?.status === 'Processing' ||
          viewOrder?.status === 'Shipped') && (
          <div className='flex items-end justify-end space-x-2 my-6'>
            <button
              className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
              onClick={handlePayment}
            >
              Make Payment
            </button>
          </div>
        )}

      <div className='max-w-3xl mx-auto mt-4 mb-10 '>
        {/* Payment Canceled */}
        {query.get('status') === 'CANCELLED' && (
          <div className='mt-12 bg-white border border-gray-200 shadow-4xl rounded-lg'>
            <h2 className='p-6 font-medium text-base sm:text-lg text-gray-800 tracking-wide'>
              <ExclamationCircleIcon
                className='inline-flex items-center cursor-pointer justify-center h-5 w-5 sm:h-6 sm:w-6 mr-1.5 text-red-600'
                aria-hidden='true'
              />
              Payment Cancelled! {query.get('error')}.
            </h2>
          </div>
        )}

        {/* Payment Failed */}
        {query.get('status') === 'FAILED' && (
          <div className='mt-12 bg-white border border-gray-200 shadow-4xl rounded-lg'>
            <h2 className='p-6 font-medium text-base sm:text-lg text-gray-800 tracking-wide'>
              <BanknotesIcon
                className='inline-flex items-center cursor-pointer justify-center h-5 w-5 sm:h-6 sm:w-6 mr-1.5 text-red-600'
                aria-hidden='true'
              />
              Payment Failed! {query.get('error')}.
            </h2>
          </div>
        )}

        {/* Payment Confirmation */}
        {viewOrder?.transitionId?.length > 0 &&
          viewOrder?.transitionDate?.length > 0 && (
            <div className='mt-12 bg-white border border-gray-200 shadow-4xl rounded-lg'>
              <div className='p-6'>
                <h2 className='font-semibold text-base sm:text-lg text-green-800 tracking-wide'>
                  <ShieldCheckIcon
                    className='inline-flex items-center cursor-pointer justify-center h-5 w-5 sm:h-6 sm:w-6 mr-1.5 text-green-800'
                    aria-hidden='true'
                  />
                  Payment Successful
                </h2>

                <div className='mt-4 flex flex-wrap'>
                  <p className='text-sm sm:text-base font-medium text-gray-900 mb-4 mr-0 sm:mb-0 sm:mr-4'>
                    <span className='font-semibold'>Transition ID: </span>
                    {viewOrder?.transitionId}
                  </p>
                  <p className='text-sm sm:text-base font-medium text-gray-900'>
                    <span className='font-semibold'>Transition Date: </span>
                    {viewOrder?.transitionDate}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>

      {orderLoading && (
        <div className='mt-16 mb-12'>
          <div className='flex items-center justify-center'>
            <img
              className='w-28'
              src='https://media.tenor.com/On7kvXhzml4AAAAj/bookLoading-gif.gif'
              alt=''
            />
          </div>
        </div>
      )}

      {!orderLoading && viewOrder?.orderId?.length > 0 && (
        <div className='flex items-center justify-center' ref={componentRef}>
          <div className='bg-white border border-gray-200 rounded-lg shadow-4xl'>
            <div className='flex justify-between px-8 py-4'>
              <div>
                <Link to='/' className='inline-flex items-center'>
                  <img
                    src='https://i.ibb.co/YytpcVr/logo-image-removebg-preview.png'
                    alt=''
                    className='w-16'
                  />
                </Link>
                <p className='text-lg sm:text-xl text-indigo-600 pl-1 text-bold'>
                  D-Book Shop
                </p>
              </div>

              {/* Invoice */}
              <div className='p-1'>
                <ul className='flex'>
                  <li className='flex flex-col p-2 text-gray-800 font-medium'>
                    <span className='text-sm text-right'>
                      www.dbookshop.com
                    </span>
                    <span class='text-sm text-right'>+880 1790-547728</span>
                    <span class='text-sm text-right'>
                      Daffodil Smart City, Asuliya, Savar, Dhaka
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className='w-full h-0.5 bg-brand-900'></div>

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
                          <span className='text-base mr-1 font-bold'>৳</span>{' '}
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

              <div className='px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8'>
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
                    <dt className='font-medium text-gray-800'>Order total</dt>
                    <dd className='font-medium text-indigo-600'>
                      <span className='text-xl font-bold'>৳</span>{' '}
                      {viewOrder?.total}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className='w-full h-0.5 bg-brand-900'></div>

            <div className='pb-4'>
              <div className='flex items-center justify-center text-gray-800'>
                Thank you for choosing D-Book Shop
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex items-end justify-end space-x-2 mt-6 pb-16'>
        <button
          className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
          onClick={handlePrint}
        >
          Print
        </button>
        <button className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-yellow-600 hover:bg-yellow-700 focus:outline-none'>
          <Link to={`/order-history/`}>Back</Link>
        </button>
      </div>
    </section>
  );
};

export default Invoice;
