import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/20/solid';
import { StoreContext } from '../components/Context/StoreContext';
import { useForm } from 'react-hook-form';
import { useAuth } from '../components/Auth/AuthContext';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Reviews = () => {
  const { orderLoading, orderBooks } = useContext(StoreContext);
  const [bookNeedReviews, setBookNeedReviews] = useState([]);
  const [point, setPoint] = useState(0);
  const [reviewBook, setReviewBook] = useState({});
  const [orderId, setOrderId] = useState('');
  const [currentHover, setCurrentHover] = useState(0);
  const { loggedInUser } = useAuth();

  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const bookNeedReviews = orderBooks?.filter(
      (item) => item?.status === 'Delivered' && item?.isReviewed === false
    );
    setBookNeedReviews(bookNeedReviews);
  }, [orderBooks]);

  useEffect(() => {
    setPoint(point);
  }, [point, setPoint]);

  const onSubmit = async (data) => {
    if (point === 0) {
      toast.error('Please select the review star');
      return;
    }

    const loading = toast.loading('Please wait...');
    const userEmail = loggedInUser?.email?.split('@');
    let reviewId =
      Math.floor(1000 + Math.random() * 1000000 + 1) + '-' + userEmail[0];
    try {
      // user review
      const reviewData = {
        reviewId: reviewId,
        userId: loggedInUser?.uid,
        userName: loggedInUser?.displayName,
        userEmail: loggedInUser?.email,
        userImage: loggedInUser?.photoURL,
        userReview: data?.review,
        userRating: point,
        bookId: reviewBook?.listingId,
        bookName: reviewBook?.bookName,
        bookCover: reviewBook?.bookCover,

        reviewDate: new Date().toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      // store review on database
      const docRef = doc(db, 'reviews', reviewId);
      await setDoc(docRef, reviewData, { merge: true });

      const orderDetails = bookNeedReviews?.find(
        (item) => item?.orderId === orderId
      );

      const bookData = {
        ...orderDetails,
        books: orderDetails?.books?.map((item) =>
          item?.listingId === reviewBook?.listingId
            ? { ...item, isReviewed: true }
            : item
        ),
        isReviewed:
          orderDetails?.books?.filter((item) => item?.isReviewed)?.length === 1
            ? true
            : false,
      };

      // update order status on database
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, bookData, { merge: true });

      setReviewBook({});
      setOrderId('');
      setPoint(0);
      reset();

      toast.dismiss(loading);
      toast.success('Review added successfully!');
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  return (
    <div className='bg-white'>
      <div className='pb-12 pt-6'>
        <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
          <div className='mx-auto px-4 lg:px-0'>
            <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
              My Reviews
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              My reviews offer insightful perspectives and valuable
              recommendations for your consideration.
            </p>
          </div>
        </div>

        {/* Favorites */}
        {orderLoading && (
          <div className='mt-16 mb-12'>
            <div className='flex items-center justify-center'>
              <img
                className='w-28'
                src='https://media.tenor.com/On7kvXhzml4AAAAj/orderLoading-gif.gif'
                alt=''
              />
            </div>
          </div>
        )}

        {!orderLoading &&
          bookNeedReviews?.filter(
            (item) => item?.customer?.email === loggedInUser?.email
          )?.length === 0 && (
            <div className='mt-16'>
              <div className='flex items-center justify-center'>
                <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                  No books found for review!
                </div>
              </div>
            </div>
          )}

        {!orderLoading && bookNeedReviews?.length > 0 && (
          <div className='mt-10'>
            <h2 className='sr-only'>Recent orders</h2>
            <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
              <div className='mx-auto space-y-8 sm:px-4 lg:px-0'>
                {bookNeedReviews
                  ?.filter(
                    (item) => item?.customer?.email === loggedInUser?.email
                  )
                  ?.map((item) =>
                    item?.books?.filter((book) => book?.isReviewed !== true)
                      ?.length ? (
                      <div
                        key={item?.orderId}
                        className='border-b border-t border-gray-200 bg-white shadow-xl sm:rounded-lg sm:border mb-12'
                      >
                        <div className='flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-6 sm:gap-x-6 sm:p-6'>
                          <div className='font-semibold text-gray-900'>
                            <span className='font-bold'>Order</span> #
                            {item?.orderId?.substring(0, 8)}
                          </div>
                          <dl className='grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-4'>
                            <div>
                              <dt className='font-medium text-gray-900'>
                                Order date
                              </dt>
                              <dd className='mt-1 text-gray-600'>
                                <span>
                                  {new Date(
                                    item?.timestamp?.seconds * 1000
                                  )?.toLocaleDateString('en-US', options)}
                                </span>
                              </dd>
                            </div>
                            {/* <div>
                          <dt className='font-medium text-gray-900'>
                            Delivery on
                          </dt>
                          <dd className='mt-1 text-gray-600'>
                            <span>
                              {new Date(
                                item?.deliveryOn?.seconds * 1000
                              )?.toLocaleDateString('en-US', options)}
                            </span>
                          </dd>
                        </div> */}
                            <div>
                              <dt className='font-medium text-gray-900'>
                                Total amount
                              </dt>
                              <dd className='font-medium text-gray-600'>
                                <span className='text-xl font-bold '>৳</span>{' '}
                                {item?.total}
                              </dd>
                            </div>
                            <div>
                              <dt className='font-medium text-gray-900'>
                                Payment Status
                              </dt>
                              <dd className='mt-1 text-gray-600'>
                                {item?.paid ? 'Paid' : 'Unpaid'}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Products */}
                        <h4 className='sr-only'>Items</h4>
                        <ul
                          role='list'
                          className='divide-y divide-gray-200 flex flex-col'
                        >
                          {item?.books
                            ?.filter((book) => book?.isReviewed !== true)
                            ?.map((book) => (
                              <li key={book?.listingId} className='p-4 sm:p-6'>
                                <div className='sm:grid grid-cols-1 sm:grid-cols-12 sm:gap-x-12 '>
                                  <div className='flex items-center sm:items-start sm:col-span-5'>
                                    <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md bg-gray-200 sm:h-40 sm:w-32'>
                                      <img
                                        src={book?.bookCover}
                                        alt=''
                                        className='h-full w-full object-cover object-center'
                                      />
                                    </div>
                                    <div className='ml-6 text-sm'>
                                      <div className='font-medium text-gray-900 sm:flex sm:justify-between sm:flex-col'>
                                        <h5 className='text-base'>
                                          {book?.name}
                                        </h5>
                                        <p className='text-gray-500 mt-3'>
                                          {book?.sellerDepartment}
                                        </p>
                                        <p className='text-gray-500 mt-3'>
                                          Quantity {book?.quantity}
                                        </p>
                                        <p className='mt-3 flex text-base'>
                                          <span className='text-base mr-1 font-bold'>
                                            ৳
                                          </span>
                                          {book?.sellingPrice}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Review */}
                                  {reviewBook?.listingId === book?.listingId ? (
                                    <div className='mt-4 sm:mt-0 sm:col-span-7'>
                                      <p className='text-gray-500 font-semibold mb-3'>
                                        Write a review
                                      </p>
                                      <div className='space-y-5'>
                                        <div className='flex items-start space-x-4'>
                                          <div className='flex-shrink-0'>
                                            <img
                                              className='inline-block h-10 w-10 rounded-full'
                                              src={loggedInUser?.photoURL}
                                              alt=''
                                            />
                                          </div>
                                          <div className='min-w-0 flex-1'>
                                            <form
                                              className='relative'
                                              onSubmit={handleSubmit(onSubmit)}
                                            >
                                              <div className='overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                                                <label
                                                  htmlFor='review'
                                                  className='sr-only'
                                                >
                                                  Add your review
                                                </label>
                                                <textarea
                                                  rows={3}
                                                  name='review'
                                                  id='review'
                                                  {...register('review', {
                                                    required:
                                                      'Review message is required!',
                                                    minLength: {
                                                      value: 10,
                                                      message:
                                                        'Review message minimum length 10 characters',
                                                    },
                                                  })}
                                                  className={`block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${
                                                    errors?.review
                                                      ? 'focus:border-red-300 focus:ring-red-200'
                                                      : 'focus:border-transparent focus:ring-blue-500'
                                                  }`}
                                                  placeholder='Add your review...'
                                                />
                                                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mb-12 ml-2'>
                                                  {errors?.review?.message}
                                                </span>
                                              </div>

                                              <div className='absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                                                <div className='flex items-center space-x-5'>
                                                  <div className='nc-FiveStartIconForRate flex items-center text-gray-400 space-x-0.5 cursor-pointer'>
                                                    {[1, 2, 3, 4, 5].map(
                                                      (item) => {
                                                        return (
                                                          <StarIcon
                                                            key={item}
                                                            className={`${
                                                              point >= item ||
                                                              currentHover >=
                                                                item
                                                                ? 'text-yellow-500'
                                                                : ''
                                                            } w-6 h-6`}
                                                            onMouseEnter={() =>
                                                              setCurrentHover(
                                                                () => item
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              setCurrentHover(
                                                                () => 0
                                                              )
                                                            }
                                                            onClick={() =>
                                                              setPoint(
                                                                () => item
                                                              )
                                                            }
                                                          />
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                </div>
                                                <div className='flex-shrink-0'>
                                                  <button
                                                    type='submit'
                                                    className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                  >
                                                    Post
                                                  </button>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className='mt-4 sm:mt-0 sm:col-span-7'>
                                      <button
                                        type='button'
                                        className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none'
                                        onClick={() => {
                                          setReviewBook({
                                            listingId: book?.listingId,
                                            bookName: book?.name,
                                            bookCover: book?.bookCover,
                                          });
                                          setOrderId(item?.orderId);
                                          setPoint(0);
                                          reset();
                                        }}
                                      >
                                        <svg
                                          className='mx-auto h-10 w-10 text-indigo-500'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          stroke='currentColor'
                                          aria-hidden='true'
                                        >
                                          <path
                                            vectorEffect='non-scaling-stroke'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
                                          />
                                        </svg>
                                        <h3 className='mt-1 text-base font-semibold text-indigo-700'>
                                          Write a review
                                        </h3>
                                        <p className='mt-2 text-sm text-gray-500'>
                                          Please write a review for this book.
                                          Share your experience with others.
                                          Your review will help others to make a
                                          better decision. Thank you!
                                        </p>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
