import React from 'react';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import products from '../data/products';

const Listing = () => {
  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-10 pb-16 px-4 sm:px-6 lg:px-8'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='sm:flex sm:items-center'>
              <div className='sm:flex-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  Listing
                </h1>
                <p className='mt-2 text-sm text-gray-700'>
                  A list of all the users in your books including their name,
                  title, email and price.
                </p>
              </div>
              <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
                <button
                  type='button'
                  className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
                >
                  Add books
                </button>
              </div>
            </div>
            <div className='mt-8 flex flex-col'>
              <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-300'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                          >
                            Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Category
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Quantity
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Status
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Price
                          </th>
                          <th
                            scope='col'
                            className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                          >
                            <span className='sr-only'>Action</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {products?.map((item) => (
                          <tr key={item?.id}>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                              <div className='flex items-center'>
                                <div className='h-10 w-10 flex-shrink-0'>
                                  <img
                                    className='h-10 w-10 rounded-lg'
                                    src={item?.imageSrc}
                                    alt=''
                                  />
                                </div>
                                <div className='ml-4'>
                                  <div className='font-medium text-gray-900'>
                                    {item?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              <div className='text-gray-900'>
                                {item?.color?.substring(0, 15)}
                              </div>
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              <div className='text-gray-900'>1</div>
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  item?.status === 'Sold'
                                    ? 'text-green-800 bg-green-100'
                                    : 'text-red-600 bg-red-50'
                                } `}
                              >
                                Available
                              </span>
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                              {item?.price}
                            </td>
                            <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                              <a
                                href='#'
                                className='text-indigo-600 hover:text-indigo-900'
                              >
                                Edit
                              </a>
                              <a
                                href='#'
                                className='ml-6 text-red-800 hover:text-red-900'
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
