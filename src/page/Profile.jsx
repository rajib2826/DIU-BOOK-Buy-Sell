import React from 'react';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';

const Profile = () => {
  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-10 pb-16 px-4 sm:px-6 lg:px-8'>
          <form className='space-y-6'>
            <div className='bg-gray-50 px-4 py-5 shadow sm:rounded-lg sm:p-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Profile
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
                <div className='mt-5 space-y-6 md:col-span-2 md:mt-0'>
                  <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    <div className='sm:col-span-4'>
                      <label className='block text-sm font-medium text-gray-700'>
                        Photo
                      </label>
                      <div className='mt-1 flex items-center space-x-5'>
                        <span className='inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                        <button
                          type='button'
                          className='rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='username'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Name
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <input
                          type='text'
                          name='username'
                          id='username'
                          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium text-gray-700'
                      >
                        WhatsApp Number
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <input
                          type='number'
                          name='price'
                          id='price'
                          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='street-address'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Facebook URL
                      </label>
                      <input
                        type='text'
                        name='street-address'
                        id='street-address'
                        autoComplete='street-address'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 px-4 py-5 shadow sm:rounded-lg sm:p-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Account
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    This will be your account personal so your account will be
                    automatically created when you log in.
                  </p>
                </div>
                <div className='mt-5 md:col-span-2 md:mt-0'>
                  <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6 sm:col-span-4'>
                      <label
                        htmlFor='email-address'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Email address
                      </label>
                      <input
                        type='text'
                        name='email-address'
                        id='email-address'
                        autoComplete='email'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        New Password
                      </label>
                      <input
                        type='password'
                        name='first-name'
                        id='first-name'
                        autoComplete='given-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='last-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Confirm Password
                      </label>
                      <input
                        type='password'
                        name='last-name'
                        id='last-name'
                        autoComplete='family-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                type='button'
                className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
