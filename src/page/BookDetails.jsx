import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onSnapshot, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CheckIcon } from '@heroicons/react/20/solid';
import { FlagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import { BsFacebook, BsWhatsapp } from 'react-icons/bs';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';

const BookDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { listingId } = params;
  const { loggedInUser } = useAuth();
  const [bookDetails, setBookDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get the book details
  useEffect(() => {
    if (listingId) {
      setLoading(true);
      const unsubscribe = onSnapshot(doc(db, 'books', listingId), (doc) => {
        if (doc.exists()) {
          setBookDetails(doc.data());
          setLoading(false);
        } else {
          toast.error('No book details found!');
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [listingId]);

  const handleBuyBook = async () => {
    if (!window.confirm('Are you want to buy this book?')) return;

    const userEmail = loggedInUser?.email?.split('@');
    let orderId =
      loggedInUser?.department +
      '-' +
      Math.floor(1000 + Math.random() * 9000) +
      '-' +
      userEmail[0];

    const loading = toast.loading('Please wait...');
    try {
      const docRef = doc(db, 'orders', orderId);
      const payload = {
        orderId,
        name: bookDetails?.name,
        description: bookDetails?.description,
        bookCover: bookDetails?.bookCover,
        originalPrice: bookDetails?.originalPrice,
        sellingPrice: bookDetails?.sellingPrice,
        sellerEmail: bookDetails?.sellerEmail,
        quantity: 1,
        buyerEmail: loggedInUser?.email,
        sellerName: bookDetails?.sellerName,
        sellerPhoto: bookDetails?.sellerPhoto,
        sellerDepartment: bookDetails?.sellerDepartment,
        sellerPhone: bookDetails?.sellerPhone,
        sellerAddress: bookDetails?.sellerAddress,
        buyerName: loggedInUser?.displayName,
        buyerPhoto: loggedInUser?.photoURL,
        buyerDepartment: loggedInUser?.department,
        buyerPhone: loggedInUser?.phone,
        buyerAddress: loggedInUser?.address,
        buyerDob: loggedInUser?.dob,
        paid: false,
        status: 'pending',
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });

      toast.dismiss(loading);
      toast.success(`Book order placed successfully!`);
      navigate('/books');
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  const handleReportSeller = async () => {
    const report = prompt(
      'Are you want to report this seller?\nPlease write the reason: ',
      ''
    );
    if (report == null || report == '') {
      toast.error('Please write the reason!');
      return;
    }

    const userEmail = loggedInUser?.email?.split('@');
    let reportId =
      loggedInUser?.department +
      '-' +
      Math.floor(1000 + Math.random() * 9000) +
      '-' +
      userEmail[0];

    const loading = toast.loading('Please wait...');
    try {
      const docRef = doc(db, 'report', reportId);
      const payload = {
        reportId,
        report,
        name: bookDetails?.name,
        bookCover: bookDetails?.bookCover,
        originalPrice: bookDetails?.originalPrice,
        sellingPrice: bookDetails?.sellingPrice,
        sellerEmail: bookDetails?.sellerEmail,
        sellerName: bookDetails?.sellerName,
        sellerPhoto: bookDetails?.sellerPhoto,
        sellerDepartment: bookDetails?.sellerDepartment,
        sellerPhone: bookDetails?.sellerPhone,
        sellerAddress: bookDetails?.sellerAddress,
        reporterName: loggedInUser?.displayName,
        reporterEmail: loggedInUser?.email,
        reporterPhoto: loggedInUser?.photoURL,
        reporterPhone: loggedInUser?.phone,
        reporterAddress: loggedInUser?.address,
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });

      toast.dismiss(loading);
      toast.success(
        `Seller reported successfully! We will take action as soon as possible.`
      );
      navigate('/books');
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className='bg-white'>
        {loading && (
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

        {!loading && Object.keys(bookDetails)?.length === 0 && (
          <div className='my-32'>
            <div className='flex items-center justify-center'>
              <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                No books details found!
              </div>
            </div>
          </div>
        )}

        {!loading && Object.keys(bookDetails)?.length > 0 && (
          <div className='mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
            {/* Product details */}
            <div className='lg:max-w-lg lg:self-end'>
              <nav aria-label='Breadcrumb'>
                <ol role='list' className='flex items-center space-x-2'>
                  <li>
                    <div className='flex items-center text-sm'>
                      <Link
                        to='/books'
                        className='font-medium text-gray-500 hover:text-gray-900'
                      >
                        Books
                      </Link>
                      <svg
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'
                      >
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    </div>
                  </li>
                  <li>
                    <div className='flex items-center text-sm'>
                      <Link
                        to={`/books/${bookDetails?.listingId}`}
                        className='font-medium text-gray-500 hover:text-gray-900'
                      >
                        {bookDetails?.name}
                      </Link>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className='mt-4'>
                <h1 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
                  {bookDetails?.name}
                </h1>
              </div>

              <section aria-labelledby='information-heading' className='mt-4'>
                <h2 id='information-heading' className='sr-only'>
                  Product information
                </h2>

                <div className='flex items-center'>
                  <p className='text-base text-gray-500 sm:text-xl mr-2'>
                    <span className='text-xl font-bold'>৳</span>{' '}
                    <span className='line-through'>
                      {bookDetails?.originalPrice}
                    </span>
                  </p>
                  <p className='text-lg text-gray-900 sm:text-2xl'>
                    <span className='text-2xl font-bold'>৳</span>{' '}
                    {bookDetails?.sellingPrice}
                  </p>
                </div>

                <div className='mt-4 space-y-6'>
                  <p className='text-md text-gray-500'>
                    {bookDetails?.description}
                  </p>
                </div>

                <div className='mt-6 flex items-center'>
                  {bookDetails?.available ? (
                    <>
                      <CheckIcon
                        className='h-5 w-5 flex-shrink-0 text-green-500'
                        aria-hidden='true'
                      />
                      <p className='ml-2 text-md font-semibold text-gray-500'>
                        In stock and ready to buy
                      </p>
                    </>
                  ) : (
                    <>
                      <XMarkIcon
                        className='h-5 w-5 flex-shrink-0 text-red-500'
                        aria-hidden='true'
                      />
                      <p className='ml-2 text-md font-semibold text-gray-500'>
                        Out of stock
                      </p>
                    </>
                  )}
                </div>
              </section>
            </div>

            {/* Product image */}
            <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
              <div className='aspect-w-1 aspect-h-1 overflow-hidden rounded-lg'>
                <img
                  src={bookDetails?.bookCover}
                  alt=''
                  className='h-full w-full object-cover object-center'
                />
              </div>
            </div>

            {/* Product form */}
            <div className='mt-10 lg:max-w-lg self-start'>
              <section aria-labelledby='options-heading'>
                <h2 className='text-lg text-gray-900 sm:text-xl mb-4'>
                  Contact Information
                </h2>

                <form>
                  <div className='sm:flex sm:justify-between'>
                    <ul
                      role='list'
                      className='space-y-16 sm:space-y-0 lg:max-w-5xl'
                    >
                      <li key={bookDetails?.sellerName}>
                        <div className='space-y-4'>
                          <img
                            className='mx-auto h-20 w-20 rounded-full xl:w-24 xl:h-24'
                            src={bookDetails?.sellerPhoto}
                            alt=''
                          />
                          <div className='space-y-3'>
                            <div className='space-y-1 text-xl font-medium leading-6'>
                              <h3>{bookDetails?.sellerName}</h3>
                              <p className='text-base text-indigo-600'>
                                {bookDetails?.sellerDepartment} Student
                              </p>
                              <p className='text-base text-gray-700'>
                                Phone: {bookDetails?.sellerPhone}
                              </p>
                            </div>
                            <ul role='list' className='flex space-x-5'>
                              <li>
                                <a
                                  href={bookDetails?.sellerDob}
                                  target='_blank'
                                  className='text-gray-400 hover:text-gray-500'
                                >
                                  <span className='sr-only'>Facebook</span>
                                  <BsFacebook className='w-6 h-6' />
                                </a>
                              </li>
                              <li>
                                <a
                                  href={`https://web.whatsapp.com/send?phone=${bookDetails?.sellerPhone}`}
                                  target='_blank'
                                  className='text-gray-400 hover:text-gray-500'
                                >
                                  <span className='sr-only'>Whatsapp</span>
                                  <BsWhatsapp className='w-6 h-6' />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className='mt-10'>
                    <button
                      onClick={() => handleBuyBook()}
                      disabled={!bookDetails?.available}
                      type='button'
                      className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                    >
                      Buy Book
                    </button>
                  </div>
                  <div className='mt-6 text-center'>
                    <button
                      onClick={() => handleReportSeller()}
                      type='button'
                      className='group inline-flex text-base font-medium'
                    >
                      <FlagIcon
                        className='mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                        aria-hidden='true'
                      />
                      <span className='text-gray-500 hover:text-gray-700'>
                        Report this seller
                      </span>
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookDetails;
