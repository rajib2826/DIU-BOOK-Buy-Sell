import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onSnapshot, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  CheckIcon,
  StarIcon,
  HeartIcon as FilledHeartIcon,
} from '@heroicons/react/20/solid';
import { FlagIcon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import { BsFacebook, BsWhatsapp } from 'react-icons/bs';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StoreContext } from '../components/Context/StoreContext';

function classNames(...classes) {
  return classes?.filter(Boolean).join(' ');
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BookDetails = () => {
  const query = useQuery();
  const params = useParams();
  const navigate = useNavigate();
  const { listingId } = params;
  const { loggedInUser } = useAuth();
  const [bookDetails, setBookDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    cart,
    setCart,
    favoriteBooks,
    reviewLoading,
    reviews,
    bookLoading,
    allBooks,
  } = useContext(StoreContext);
  const from = query.get('from');

  const bookReviews = reviews?.filter((review) => review?.bookId === listingId);
  const totalReviews = bookReviews?.length;
  const totalRating = bookReviews?.reduce(
    (total, review) => total + review?.userRating,
    0
  );
  const averageRating = totalRating / totalReviews;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [listingId]);

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

  const handleAddToCart = ({ isCheckout = false }) => {
    const findBook = cart?.find(
      (book) => book?.listingId === bookDetails?.listingId
    );
    if (findBook) {
      toast.error('This book already added to the cart!');
      return;
    }

    const payload = {
      listingId: bookDetails?.listingId,
      name: bookDetails?.name,
      description: bookDetails?.description,
      bookCover: bookDetails?.bookCover?.[0]?.url,
      originalPrice: bookDetails?.originalPrice,
      sellingPrice: bookDetails?.sellingPrice,
      quantity: 1,
      sellerEmail: bookDetails?.sellerEmail,
      sellerName: bookDetails?.sellerName,
      sellerPhoto: bookDetails?.sellerPhoto,
      sellerDepartment: bookDetails?.sellerDepartment,
      sellerPhone: bookDetails?.sellerPhone,
      sellerAddress: bookDetails?.sellerAddress,
    };

    setCart([...cart, payload]);
    toast.success('Book added to the cart!');

    if (isCheckout) {
      navigate('/checkout');
    }
  };

  const handleAddToFavorite = async () => {
    const userEmail = loggedInUser?.email?.split('@');
    let favoriteId =
      loggedInUser?.department +
      '-' +
      Math.floor(1000 + Math.random() * 9000) +
      '-' +
      userEmail[0];

    const loading = toast.loading('Please wait...');
    try {
      const docRef = doc(db, 'favorite', favoriteId);
      const payload = {
        favoriteId,
        name: bookDetails?.name,
        listingId: bookDetails?.listingId,
        userEmail: loggedInUser?.email,
        bookCover: bookDetails?.bookCover?.[0]?.url,
        sellingPrice: bookDetails?.sellingPrice,
        sellerEmail: bookDetails?.sellerEmail,
        sellerDepartment: bookDetails?.sellerDepartment,
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });

      toast.dismiss(loading);
      toast.success(`Book added to favorite successfully! `);
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
        listingId: bookDetails?.listingId,
        name: bookDetails?.name,
        bookCover: bookDetails?.bookCover?.[0]?.url,
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
          <>
            {/* Product Section */}
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
                          to={`/book-details/${bookDetails?.listingId}`}
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

                    <div className='ml-4 border-l border-gray-300 pl-4'>
                      <h2 className='sr-only'>Reviews</h2>
                      <div className='flex items-center'>
                        <div>
                          <div className='flex items-center'>
                            {[0, 1, 2, 3, 4]?.map((rating) => (
                              <StarIcon
                                key={rating}
                                className={classNames(
                                  averageRating > rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300',
                                  'h-5 w-5 flex-shrink-0'
                                )}
                                aria-hidden='true'
                              />
                            ))}
                          </div>
                          <p className='sr-only'>
                            {averageRating} out of 5 stars
                          </p>
                        </div>
                        <p className='ml-2 text-base text-gray-500'>
                          {totalReviews} reviews
                        </p>
                      </div>
                    </div>

                    <div className='ml-4 border-l border-gray-300 pl-4'>
                      <h2 className='sr-only'>Favorites</h2>
                      <div className='flex items-center'>
                        <FilledHeartIcon
                          className='h-5 w-5 flex-shrink-0 text-red-500'
                          aria-hidden='true'
                        />
                        <p className='ml-1 text-base text-gray-500'>
                          {
                            favoriteBooks?.filter(
                              (item) =>
                                item?.listingId === bookDetails?.listingId
                            )?.length
                          }{' '}
                          favorites
                        </p>
                      </div>
                    </div>
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
                    <div className='ml-4 border-l border-gray-300 pl-4'>
                      <h2 className='sr-only'>Views</h2>
                      <div className='flex items-center'>
                        <EyeIcon
                          className='h-5 w-5 flex-shrink-0 text-gray-500'
                          aria-hidden='true'
                        />
                        <p className='ml-1 text-base text-gray-500'>
                          {bookDetails?.viewCount} views
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Product image */}
              <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
                <Carousel
                  images={
                    bookDetails?.bookCover?.length &&
                    bookDetails?.bookCover?.map((image) => ({
                      src: image?.url,
                    }))
                  }
                  isAutoPlaying={true}
                  autoPlayInterval={3000}
                  className='h-full w-full object-cover object-center'
                  style={{ height: 800, width: 600, borderRadius: 10 }}
                />
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

                    {from !== 'listing' && (
                      <>
                        {' '}
                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
                          <button
                            onClick={() =>
                              handleAddToCart({ isCheckout: true })
                            }
                            disabled={!bookDetails?.available}
                            type='button'
                            className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() =>
                              handleAddToCart({ isCheckout: false })
                            }
                            disabled={!bookDetails?.available}
                            type='button'
                            className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                          >
                            Add to cart
                          </button>
                        </div>
                        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
                          <button
                            onClick={() => handleAddToFavorite()}
                            type='button'
                            className='flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 text-base font-medium'
                          >
                            <HeartIcon
                              className='mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                              aria-hidden='true'
                            />
                            <span className='text-gray-500 hover:text-gray-700'>
                              Add to favorite
                            </span>
                          </button>

                          <button
                            onClick={() => handleReportSeller()}
                            type='button'
                            className='flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 text-base font-medium'
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
                      </>
                    )}
                  </form>
                </section>
              </div>
            </div>
            {/* Review Section */}
            <div className='mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
              {reviewLoading ? (
                <section className='lg:col-span-6'>
                  <div className='flex items-center justify-center'>
                    <img
                      className='w-16'
                      src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                      alt=''
                    />
                  </div>
                </section>
              ) : (
                <section className='lg:col-span-6'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    Reviews ({totalReviews})
                  </h2>
                  <div className='bg-white'>
                    <div>
                      <div className='-my-4'>
                        {bookReviews?.length > 0 ? (
                          bookReviews?.map((review, reviewIdx) => (
                            <div
                              key={review?.reviewId}
                              className='flex space-x-4 text-sm text-gray-500'
                            >
                              <div className='flex-none py-10'>
                                <img
                                  src={review?.userImage}
                                  alt=''
                                  className='h-10 w-10 rounded-full bg-gray-100'
                                />
                              </div>
                              <div
                                className={classNames(
                                  reviewIdx === 0
                                    ? ''
                                    : 'border-t border-gray-200',
                                  'flex-1 py-10'
                                )}
                              >
                                <h3 className='font-medium text-gray-900'>
                                  {review?.userName}
                                </h3>
                                <p>{review?.reviewDate}</p>

                                <div className='mt-2 flex items-center'>
                                  {[0, 1, 2, 3, 4]?.map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review?.userRating > rating
                                          ? 'text-yellow-400'
                                          : 'text-gray-300',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden='true'
                                    />
                                  ))}
                                </div>
                                <p className='sr-only'>
                                  {review?.userRating} out of 5 stars
                                </p>
                                <p className='text-base mt-2 max-w-none text-gray-500'>
                                  {review?.userReview}{' '}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='flex items-center'>
                            <div className='font-medium text-sm sm:text-base mt-6 text-gray-600'>
                              No reviews found!
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {bookLoading ? (
                <section className='lg:col-span-6'>
                  <div className='flex items-center justify-center'>
                    <img
                      className='w-16'
                      src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                      alt=''
                    />
                  </div>
                </section>
              ) : (
                <section className='lg:col-span-6'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    You may also like
                  </h2>
                  <div className='mx-auto space-y-8'>
                    <div className='mt-6 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10'>
                      {allBooks?.length > 0 ? (
                        allBooks
                          ?.filter((item) => item?.listingId !== listingId)
                          ?.slice(0, 4)
                          ?.map((item) => (
                            <div key={item?.listingId}>
                              <Link to={`/book-details/${item?.listingId}`}>
                                <div className='relative'>
                                  <div className='relative h-60 w-full overflow-hidden rounded-lg shadow-xl'>
                                    <img
                                      src={item?.bookCover?.[0]?.thumbnail}
                                      alt=''
                                      className='h-full w-full object-cover object-center'
                                    />
                                  </div>
                                  <div className='relative mt-4'>
                                    <h3 className='text-md font-medium text-gray-900'>
                                      {item?.name}
                                    </h3>
                                    <p className='mt-1 text-base font-semibold text-gray-500'>
                                      {item?.sellerDepartment}
                                    </p>
                                  </div>
                                  <div className='absolute inset-x-0 top-0 flex h-60 items-end justify-end overflow-hidden rounded-lg p-4'>
                                    <div
                                      aria-hidden='true'
                                      className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black opacity-60'
                                    />
                                    <p className='relative text-lg font-semibold text-white'>
                                      <span className='text-2xl font-bold'>
                                        ৳
                                      </span>{' '}
                                      {item?.sellingPrice}
                                    </p>
                                  </div>
                                </div>

                                <div className='mt-4'>
                                  <button className='relative w-full flex items-center justify-center rounded-md border border-transparent bg-gray-100 py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-200'>
                                    <EyeIcon className='w-5 h-5 text-gray-500 mr-2' />{' '}
                                    View Details
                                  </button>
                                </div>
                              </Link>
                            </div>
                          ))
                      ) : (
                        <div className='flex items-center'>
                          <div className='font-medium text-sm sm:text-base mt-6 text-gray-600'>
                            No suggested books found!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookDetails;
