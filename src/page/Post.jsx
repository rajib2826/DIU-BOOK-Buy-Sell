import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { useAuth } from '../components/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getBase64URL, resizeImg } from '../components/utils/imageFn';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Post = ({ open, setOpen, bookDetails = {} }) => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [bookCover, setBookCover] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (bookDetails?.bookCover) {
      setBookCover(bookDetails?.bookCover);
    }
  }, [bookDetails]);

  const {
    register: registerPost,
    handleSubmit: handlePost,
    formState: { errors },
  } = useForm();

  // upload book cover
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const loading = toast.loading('Photos uploading...');

    try {
      const base64URL = await getBase64URL(file);

      // image resize
      const blob = await resizeImg(base64URL, 1600, false);

      let fileName = Math.floor(1000 + Math.random() * 9000) + '-' + file.name;

      // create image file
      const downloadURL = new File([blob], fileName, {
        type: blob.type,
      });

      // upload images to imgBB
      const imageData = new FormData();
      imageData.set('key', `${process.env.REACT_APP_IMGBB_API}`);
      imageData.append('image', downloadURL);

      const res = await axios.post(
        'https://api.imgbb.com/1/upload',
        imageData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      );
      const imageURL = res.data.data.display_url;
      setBookCover(imageURL);

      toast.dismiss(loading);
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  // handle post
  const onSubmit = async (data) => {
    const { name, description, originalPrice, sellingPrice, quantity } = data;
    const userEmail = loggedInUser?.email?.split('@');
    let listingId = '';
    if (bookDetails?.listingId) {
      listingId = bookDetails.listingId;
    } else {
      listingId =
        loggedInUser?.department +
        '-' +
        Math.floor(1000 + Math.random() * 9000) +
        '-' +
        userEmail[0];
    }

    if (!bookCover) {
      toast.error('Please upload a book cover!');
      return;
    }

    if (
      name &&
      description &&
      originalPrice &&
      sellingPrice &&
      bookCover &&
      quantity
    ) {
      const loading = toast.loading('Please wait...');

      try {
        const docRef = doc(db, 'books', listingId);
        const payload = {
          listingId,
          name,
          description,
          bookCover,
          originalPrice,
          sellingPrice,
          quantity,
          sellerEmail: loggedInUser?.email,
          sellerName: loggedInUser?.displayName,
          sellerPhoto: loggedInUser?.photoURL,
          sellerDepartment: loggedInUser?.department,
          sellerPhone: loggedInUser?.phone,
          sellerAddress: loggedInUser?.address,
          sellerDob: loggedInUser?.dob,
          available: quantity > 0 ? true : false,
          timestamp: serverTimestamp(),
        };

        await setDoc(docRef, payload, { merge: true });

        toast.dismiss(loading);
        toast.success(
          `Book ${bookDetails?.listingId ? 'updated' : 'posted'} successfully!`
        );
        setOpen(false);
        navigate('/listing');
      } catch (error) {
        toast.dismiss(loading);
        toast.error(error.message);
      }
    }
  };

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
                    <form
                      className='space-y-8 divide-y divide-gray-200'
                      onSubmit={handlePost(onSubmit)}
                    >
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
                                    defaultValue={bookDetails?.name}
                                    {...registerPost('name', {
                                      required: 'Book name is required',
                                      minLength: {
                                        value: 6,
                                        message: 'Book name minimum 2 words',
                                      },
                                    })}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                                      errors.name
                                        ? 'focus:border-red-500 focus:ring-red-500'
                                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                                    } `}
                                  />
                                </div>
                                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                                  {errors?.name?.message}
                                </span>
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
                                    defaultValue={bookDetails?.description}
                                    {...registerPost('description', {
                                      required: 'Book description is required',
                                      minLength: {
                                        value: 10,
                                        message:
                                          'Book description minimum 3 words',
                                      },
                                    })}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                                      errors.description
                                        ? 'focus:border-red-500 focus:ring-red-500'
                                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                                    } `}
                                  />
                                  <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                                    {errors?.description?.message}
                                  </span>
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

                                {bookCover ? (
                                  <div className='mt-2 flex items-center'>
                                    <img
                                      className='inline-block object-cover object-center w-48 h-48 rounded-sm'
                                      src={bookCover}
                                      alt=''
                                    />
                                    <div className='ml-8 flex  cursor-pointer '>
                                      <div className='relative cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                        <label
                                          htmlFor='user-photo'
                                          className='relative pointer-events-none'
                                        >
                                          <span className='text-sm font-semibold text-gray-100 tracking-wide cursor-pointer'>
                                            Change
                                          </span>
                                        </label>
                                        <input
                                          id='user-photo'
                                          name='user-photo'
                                          type='file'
                                          onChange={onFileChange}
                                          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
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
                                          className='relative mx-auto cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                                        >
                                          <span>Upload a file</span>
                                          <input
                                            id='file-upload'
                                            name='file-upload'
                                            type='file'
                                            className='sr-only'
                                            onChange={onFileChange}
                                          />
                                        </label>
                                      </div>
                                      <p className='text-xs text-gray-500'>
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className='sm:col-span-2'>
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
                                    defaultValue={bookDetails?.quantity}
                                    {...registerPost('quantity', {
                                      required: 'Book quantity is required',
                                    })}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                                      errors.quantity
                                        ? 'focus:border-red-500 focus:ring-red-500'
                                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                                    } `}
                                  />
                                </div>
                                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                                  {errors?.quantity?.message}
                                </span>
                              </div>
                              <div className='sm:col-span-2'>
                                <label
                                  htmlFor='price'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  Book Original Price
                                </label>
                                <div className='mt-1 flex rounded-md shadow-sm'>
                                  <input
                                    type='number'
                                    name='price'
                                    id='price'
                                    defaultValue={bookDetails?.originalPrice}
                                    {...registerPost('originalPrice', {
                                      required:
                                        'Book original price is required',
                                    })}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                                      errors.originalPrice
                                        ? 'focus:border-red-500 focus:ring-red-500'
                                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                                    } `}
                                  />
                                </div>
                                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                                  {errors?.originalPrice?.message}
                                </span>
                              </div>
                              <div className='sm:col-span-2'>
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
                                    defaultValue={bookDetails?.sellingPrice}
                                    {...registerPost('sellingPrice', {
                                      required:
                                        'Book selling price is required',
                                    })}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                                      errors.sellingPrice
                                        ? 'focus:border-red-500 focus:ring-red-500'
                                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                                    } `}
                                  />
                                </div>
                                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                                  {errors?.sellingPrice?.message}
                                </span>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      <div className='pt-5'>
                        <div className='flex justify-end'>
                          <button
                            type='button'
                            onClick={() => setOpen(false)}
                            className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                          >
                            Cancel
                          </button>
                          <button
                            type='submit'
                            className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                          >
                            {bookDetails?.listingId ? 'Update' : 'Submit'}
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
