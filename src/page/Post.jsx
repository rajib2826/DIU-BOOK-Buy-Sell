import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const Post = ({ open, setOpen }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-40' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6'>
                <div>
                  <div className='text-left'>
                    <form className='space-y-8 divide-y divide-gray-200'>
                      <div className='space-y-8 divide-y divide-gray-200'>
                        <div>
                          <div>
                            <h3 className='text-lg font-medium leading-6 text-gray-900'>
                              Create a post for book sell
                            </h3>
                            <p className='mt-1 text-sm text-gray-500'>
                              This information will be displayed publicly so be
                              careful what you share.
                            </p>
                          </div>
                          <form className='mx-4'>
                            <div className='mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6'>
                              <div className='sm:col-span-6'>
                                <label
                                  htmlFor='username'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book Name
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

                              <div className='sm:col-span-6'>
                                <label
                                  htmlFor='about'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book Description
                                </label>
                                <div className='mt-1'>
                                  <textarea
                                    id='about'
                                    name='about'
                                    rows={3}
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                    defaultValue={''}
                                  />
                                </div>
                                <p className='mt-2 text-sm text-gray-500'>
                                  Write a few sentences about the book.
                                </p>
                              </div>

                              <div className='sm:col-span-6'>
                                <label
                                  htmlFor='cover-photo'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book photo
                                </label>
                                <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'>
                                  <div className='space-y-1 text-center'>
                                    <svg
                                      className='mx-auto h-12 w-12 text-gray-400'
                                      stroke='currentColor'
                                      fill='none'
                                      viewBox='0 0 48 48'
                                      aria-hidden='true'
                                    >
                                      <path
                                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                                        strokeWidth={2}
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                    </svg>
                                    <div className='flex text-sm text-gray-600'>
                                      <label
                                        htmlFor='file-upload'
                                        className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id='file-upload'
                                          name='file-upload'
                                          type='file'
                                          className='sr-only'
                                        />
                                      </label>
                                      <p className='pl-1'>or drag and drop</p>
                                    </div>
                                    <p className='text-xs text-gray-500'>
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='sm:col-span-2 mt-2'>
                                <label
                                  htmlFor='quantity'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Quantity
                                </label>
                                <div className='mt-1 flex rounded-md shadow-sm'>
                                  <input
                                    type='number'
                                    name='quantity'
                                    id='quantity'
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                  />
                                </div>
                              </div>
                              <div className='sm:col-span-2 mt-2'>
                                <label
                                  htmlFor='price'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book Orginal Price
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
                              <div className='sm:col-span-2 mt-2'>
                                <label
                                  htmlFor='price'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book selling Price
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
                            </div>
                          </form>
                        </div>
                      </div>

                      <div className='pt-5'>
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
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Post;
