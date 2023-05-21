import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../components/Auth/AuthContext';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';

const Books = () => {
  const { loggedInUser } = useAuth();
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get all books
  useEffect(() => {
    if (loggedInUser) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'books'),
          where('sellerDepartment', '==', loggedInUser?.department)
        ),
        (snapshot) => {
          const allBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllBooks(allBooks);
          setFilteredBooks(allBooks);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

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
  }, [searchValue, allBooks]);

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

          {loading && (
            <div className='mt-12 mb-8'>
              <div className='flex items-center justify-center'>
                <img
                  className='w-28'
                  src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                  alt=''
                />
              </div>
            </div>
          )}

          {!loading && filteredBooks?.length === 0 && (
            <div className='mt-6'>
              <div className='flex items-center justify-center'>
                <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                  No books found!
                </div>
              </div>
            </div>
          )}

          <div className='mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8'>
            {!loading &&
              filteredBooks?.length > 0 &&
              filteredBooks?.map((item) => (
                <div key={item?.listingId}>
                  <div className='relative'>
                    <div className='relative h-72 w-full overflow-hidden rounded-lg'>
                      <img
                        src={item?.bookCover}
                        alt=''
                        className='h-full w-full object-cover object-center'
                      />
                    </div>
                    <div className='relative mt-4'>
                      <h3 className='text-sm font-medium text-gray-900'>
                        {item?.name}
                      </h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        {item?.sellerDepartment}
                      </p>
                    </div>
                    <div className='absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4'>
                      <div
                        aria-hidden='true'
                        className='absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50'
                      />
                      <p className='relative text-lg font-semibold text-white'>
                        <span className='text-2xl font-bold'>৳</span>{' '}
                        {item?.sellingPrice}
                      </p>
                    </div>
                  </div>
                  <div className='mt-6'>
                    <Link
                      to={`/book-details/${item?.listingId}`}
                      className='relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-200'
                    >
                      View Details
                    </Link>
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
