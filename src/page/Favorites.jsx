import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StoreContext } from '../components/Context/StoreContext';

const Favorites = () => {
  const { favoriteBooksLoading, userFavoriteBooks } = useContext(StoreContext);
  return (
    <div className='bg-white'>
      <div className='pb-12 pt-6'>
        <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
          <div className='mx-auto px-4 lg:px-0'>
            <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
              My Favorites
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              My favorite book is a timeless classic that takes me on a journey
              of imagination and introspection.
            </p>
          </div>
        </div>

        {/* Favorites */}
        {favoriteBooksLoading && (
          <div className='mt-16 mb-12'>
            <div className='flex items-center justify-center'>
              <img
                className='w-28'
                src='https://media.tenor.com/On7kvXhzml4AAAAj/favoriteBooksLoading-gif.gif'
                alt=''
              />
            </div>
          </div>
        )}

        {!favoriteBooksLoading && userFavoriteBooks?.length === 0 && (
          <div className='mt-16'>
            <div className='flex items-center justify-center'>
              <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                No favorites books found!
              </div>
            </div>
          </div>
        )}

        <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
          <div className='mx-auto space-y-8 sm:px-4 lg:px-0'>
            <div className='mt-6 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8'>
              {!favoriteBooksLoading &&
                userFavoriteBooks?.length > 0 &&
                userFavoriteBooks?.map((item) => (
                  <div key={item?.listingId}>
                    <Link to={`/book-details/${item?.listingId}`}>
                      <div className='relative'>
                        <div className='relative h-72 w-full overflow-hidden rounded-lg shadow-xl'>
                          <img
                            src={item?.bookCover}
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
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
