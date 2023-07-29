import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StoreContext } from '../components/Context/StoreContext';
import { useAuth } from '../components/Auth/AuthContext';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Books = () => {
  const navigate = useNavigate();
  const { allBooks, filteredBooks, setFilteredBooks, bookLoading } =
    useContext(StoreContext);
  const { loggedInUser } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // search books
  useEffect(() => {
    if (searchValue?.length !== 0) {
      setFilteredBooks(
        allBooks?.filter((book) =>
          book?.name?.toLowerCase()?.includes(searchValue?.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(allBooks);
    }
    return () => setFilteredBooks(allBooks);
  }, [searchValue, allBooks, setFilteredBooks]);

  const handleViewCount = (bookDetails) => {
    const docRef = doc(db, 'books', bookDetails?.listingId);
    const payload = {
      viewCount: (bookDetails?.viewCount || 0) + 1,
    };
    setDoc(docRef, payload, { merge: true });
    navigate(`/book-details/${bookDetails?.listingId}`);
  };

  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-900'>
            Books for sale in your department
          </h2>
          <form action='#' className='my-4 sm:flex sm:w-full sm:max-w-sm'>
            <div className='min-w-0 flex-1'>
              <label htmlFor='searchValue' className='sr-only'>
                Search books
              </label>
              <input
                id='searchValue'
                type='text'
                className='block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                placeholder='Enter books name'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className='mt-4 sm:mt-0 sm:ml-3'>
              <button
                type='button'
                className='block w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-6'
              >
                Search
              </button>
            </div>
          </form>

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

          {!bookLoading && filteredBooks?.length === 0 && (
            <div className='mt-6'>
              <div className='flex items-center justify-center'>
                <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                  No books found!
                </div>
              </div>
            </div>
          )}

          <div className='mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8'>
            {!bookLoading &&
              filteredBooks?.length > 0 &&
              filteredBooks
                ?.filter(
                  (item) =>
                    item?.paid && item?.sellerEmail !== loggedInUser?.email
                )
                ?.sort((a, b) => b?.viewCount - a?.viewCount)
                ?.map((item) => (
                  <div key={item?.listingId}>
                    <div onClick={() => handleViewCount(item)}>
                      <div className='relative cursor-pointer'>
                        <div className='relative h-72 w-full overflow-hidden rounded-lg shadow-xl'>
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
                        <div className='absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4'>
                          <div
                            aria-hidden='true'
                            className='absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black opacity-60'
                          />
                          <p className='relative text-lg font-semibold text-white'>
                            <span className='text-2xl font-bold'>৳</span>{' '}
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
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Books;
