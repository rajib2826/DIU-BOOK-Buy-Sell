import {
  BanknotesIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  HomeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../components/Context/StoreContext';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';

const pages = [
  { name: 'Listing', href: '/listing', current: false },
  { name: 'Invoice', href: '#', current: true },
];

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BookList = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  const selectedList = query.get('booking_id');
  const { bookLoading, allBooks } = useContext(StoreContext);
  const [viewOrder, setViewOrder] = useState({});

  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  useEffect(() => {
    if (!bookLoading) {
      const order = allBooks?.find(
        (order) => order?.listingId === selectedList
      );
      setViewOrder(order);
    }
  }, [allBooks, selectedList, bookLoading]);

  useEffect(() => {
    const confirmPayment = async (transitionId, transitionDate) => {
      if (
        viewOrder?.listingId?.length > 0 &&
        query.get('status') === 'VALID' &&
        transitionId?.length > 0 &&
        transitionDate?.length > 0
      ) {
        try {
          const bookingData = {
            paid: true,
            paidAt: new Date().toLocaleString('en-GB', {
              hour12: true,
            }),
            transitionId,
            transitionDate,
          };
          // update order status on database
          const bookingRef = doc(db, 'books', viewOrder?.listingId);
          await setDoc(bookingRef, bookingData, { merge: true });

          // create a payment transaction on database
          const payload = {
            transitionId,
            transitionDate,
            transitionAmount: 10,
            orderId: viewOrder?.listingId,
            customer: {
              name: viewOrder?.sellerName,
              email: viewOrder?.sellerEmail,
              photo: viewOrder?.sellerPhoto,
            },
            books: [
              {
                bookCover: viewOrder?.bookCover?.[0]?.thumbnail,
                name: viewOrder?.name,
                originalPrice: viewOrder?.originalPrice,
                listingId: viewOrder?.listingId,
                sellerDepartment: viewOrder?.sellerDepartment,
              },
            ],
            reason: 'Listed book',
          };
          const paymentRef = doc(db, 'payments', viewOrder?.listingId);
          await setDoc(paymentRef, payload, { merge: true });

          // send email to user
          axios
            .post(`${process.env.REACT_APP_API_URL}/mail/bookingRentPayment`, {
              name: viewOrder?.sellerName,
              email: viewOrder?.sellerEmail,
              amount: 10,
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
      viewOrder?.listingId?.length > 0 &&
      query.get('status') === 'VALID' &&
      query.get('tran_id')?.length > 0 &&
      query.get('tran_date')?.length > 0
    ) {
      confirmPayment(query.get('tran_id'), query.get('tran_date'));
    }
  }, [viewOrder?.listingId, query]);

  const handlePayment = async () => {
    const loading = toast.loading('Please wait a moment...');
    // send booking data to ssl commerz server for payment
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/makePayment`,
        {
          bookingId: viewOrder?.listingId,
          total_amount: parseInt(10, 10),
          product_name: `1 books listed from ${loggedInUser?.department} dept for ${loggedInUser?.displayName}`,
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
          navigate('/listing');
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
    <>
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

        {!viewOrder?.paid && (
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

        {bookLoading && (
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

        {!bookLoading && viewOrder?.listingId?.length > 0 && (
          <div className='border-b border-t border-gray-200 bg-white shadow-xl sm:rounded-lg sm:border mb-12'>
            <div className='flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-6 sm:gap-x-6 sm:p-6'>
              <div className='font-semibold text-gray-900'>
                <span className='font-bold'>Order</span> #
                {viewOrder?.listingId?.substring(0, 8)}
              </div>
              <dl className='grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-5'>
                <div>
                  <dt className='font-medium text-gray-900'>Tracking number</dt>
                  <dd className='mt-1 text-gray-600'>
                    #{Math.floor(Math.random() * 10000000) + 1}
                  </dd>
                </div>
                <div>
                  <dt className='font-medium text-gray-900'>Created At</dt>
                  <dd className='mt-1 text-gray-600'>
                    <span>
                      {new Date(
                        viewOrder?.timestamp?.seconds * 1000
                      )?.toLocaleDateString('en-US', options)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className='font-medium text-gray-900'>Charge</dt>
                  <dd className='font-medium text-gray-600'>
                    <span className='text-xl font-bold '>৳</span> 10
                  </dd>
                </div>
                <div>
                  <dt className='font-medium text-gray-900'>Payment Status</dt>
                  <dd className='mt-1 text-gray-600'>
                    {viewOrder?.paid ? 'Paid' : 'Unpaid'}
                  </dd>
                </div>
                {viewOrder?.paid && (
                  <div>
                    <dt className='font-medium text-gray-900'>Paid At</dt>
                    <dd className='mt-1 text-gray-600'>
                      {viewOrder?.transitionDate?.substring(0, 10)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Products */}
            <h4 className='sr-only'>Items</h4>
            <ul
              role='list'
              className='divide-y divide-gray-200 sm:grid sm:grid-cols-3 sm:gap-x-6'
            >
              <li className='p-4 sm:p-6 sm:border-l sm:border-t-0'>
                <div className='flex items-center sm:items-start '>
                  <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md bg-gray-200 sm:h-40 sm:w-32'>
                    <img
                      src={viewOrder?.bookCover?.[0]?.thumbnail}
                      alt=''
                      className='h-full w-full object-cover object-center'
                    />
                  </div>
                  <div className='ml-6 text-sm'>
                    <div className='font-medium text-gray-900 sm:flex sm:justify-between sm:flex-col'>
                      <h5>{viewOrder?.name}</h5>
                      <p className='text-gray-500 mt-3'>
                        {viewOrder?.sellerDepartment}
                      </p>
                      <p className='text-gray-500 mt-3'>
                        Quantity {viewOrder?.quantity}
                      </p>
                      <p className='mt-3 flex text-base'>
                        <span className='text-base mr-1 font-bold'>৳</span>{' '}
                        {viewOrder?.sellingPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            {/* Billing */}
            <div>
              <div className='bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8'>
                <dl className='mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0'>
                  <div className='flex items-center justify-between py-2'>
                    <dt className='text-gray-600'>Charge</dt>
                    <dd className='font-medium text-gray-900'>
                      <span className='text-xl font-bold'>৳</span> 10
                    </dd>
                  </div>
                  <div className='flex items-center justify-between pt-3'>
                    <dt className='font-medium text-gray-900'>Total amount</dt>
                    <dd className='font-medium text-indigo-600'>
                      <span className='text-xl font-bold'>৳</span> 10
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        <div className='flex items-end justify-end space-x-2 mt-6 pb-16'>
          <button className='mx-4 inline-flex items-center justify-center h-10 px-6 font-semibold text-sm tracking-wider text-white transition-colors duration-300 rounded shadow-md bg-yellow-600 hover:bg-yellow-700 focus:outline-none'>
            <Link to={`/listing/`}>Back</Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default BookList;
