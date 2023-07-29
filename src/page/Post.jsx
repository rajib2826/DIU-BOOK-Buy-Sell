import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { useAuth } from '../components/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getBase64URL, resizeImg } from '../components/utils/imageFn';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Post = ({
  open,
  setOpen,
  bookDetails = {},
  setBookDetails = () => {},
}) => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [dragEnter, setDragEnter] = useState(false);
  const [bookCover, setBookCover] = useState([]);

  const {
    register: registerPost,
    handleSubmit: handlePost,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (bookDetails?.bookCover) {
      setBookCover(bookDetails?.bookCover);
    }
  }, [bookDetails]);

  useEffect(() => {
    if (Object.keys(bookDetails).length > 0) {
      setValue('name', bookDetails?.name || '');
      setValue('description', bookDetails?.description || '');
      setValue('originalPrice', bookDetails?.originalPrice || '');
      setValue('sellingPrice', bookDetails?.sellingPrice || '');
      setValue('quantity', bookDetails?.quantity || '');
    }
  }, [bookDetails, setValue]);

  // upload multiple images
  const onFiles = async (files) => {
    for (let file of files) {
      const loading = toast.loading('Photos uploading...');
      try {
        const base64URL = await getBase64URL(file);

        // image resize
        const blob = await resizeImg(base64URL, 1600, false);

        let fileName =
          Math.floor(1000 + Math.random() * 9000) + '-' + file.name;

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
        const imageId = res.data.data.id;
        const imageURL = res.data.data.url;
        const displayURL = res.data.data.display_url;

        // update state
        setBookCover((bookCover) => [
          ...bookCover,
          { id: imageId, url: imageURL, thumbnail: displayURL },
        ]);

        toast.dismiss(loading);
      } catch (err) {
        toast.dismiss(loading);
        toast.error(err.message);
      }
    }
  };

  const handleRemoveImage = async (image, id) => {
    // Delete the file
    const newImages = bookCover?.filter((image, index) => index !== id);
    setBookCover(newImages);

    // get listing cover image
    const docRef = doc(db, 'books', bookDetails?.listingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // remove image from gallery
      const newBookImages = docSnap
        ?.data()
        ?.bookCover.filter((bookImage) => bookImage?.id !== image?.id);

      const payload = {
        bookCover: newBookImages,
      };
      // store user info on database
      await setDoc(docRef, payload, { merge: true });
    }
  };

  const handleFiles = (e) => {
    onFiles(e.target.files);
  };

  const handleDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDragEnter(true);
  };
  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDragEnter(true);
  };
  const handleDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDragEnter(false);
  };
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onFiles(e.dataTransfer.files);
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
          paid: false,
          timestamp: serverTimestamp(),
        };

        await setDoc(docRef, payload, { merge: true });

        if (!bookDetails?.listingId) {
          const loading = toast.loading('Please wait a moment...');
          // send booking data to ssl commerz server for payment
          axios
            .post(
              `${process.env.REACT_APP_API_URL}/makePayment`,
              {
                bookingId: listingId,
                total_amount: parseInt(10, 10),
                product_name: `1 book listed from ${loggedInUser?.department} dept for ${loggedInUser?.displayName}`,
                product_category: `${loggedInUser?.department} department`,
                cus_name: loggedInUser?.displayName,
                cus_email: loggedInUser?.email,
                cus_add1: loggedInUser?.address,
                cus_phone: loggedInUser?.phone,
                ship_name: loggedInUser?.displayName,
                ship_add1: 'Dhaka',
              },
              {
                headers: { 'Content-Type': 'application/json' },
              }
            )
            .then((res) => {
              toast.dismiss(loading);
              console.log(res);
              if (res?.data?.status === 'SUCCESS') {
                window.open(res?.data?.url, '_blank');
                navigate('/listing');
              } else {
                toast.error('Session timeout! Please try again.');
              }
            })
            .catch((err) => {
              toast.dismiss(loading);
              toast.error(err?.message);
            });
        }

        toast.dismiss(loading);
        toast.success(
          `Book ${bookDetails?.listingId ? 'updated' : 'posted'} successfully!`
        );
        setOpen(false);
        setBookDetails({});
        navigate('/listing');
      } catch (error) {
        toast.dismiss(loading);
        toast.error(error.message);
      }
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-40'
        onClose={() => {
          setOpen(false);
          setBookDetails({});
        }}
      >
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
                            <h3 className='text-xl font-semibold leading-6 text-gray-900'>
                              Create a post for book sell
                            </h3>
                            <p className='mt-1 text-sm text-gray-500'>
                              This information will be displayed publicly so be
                              careful what you share.
                            </p>
                            {!bookDetails?.listingId && (
                              <p className='mt-1 text-sm text-indigo-600'>
                                Per post 10 taka service charge will be applied.
                              </p>
                            )}
                          </div>
                          <div className='mx-4'>
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

                              {/* Book Photo */}
                              <div className='sm:col-span-6'>
                                <span className='text-gray-900 text-lg font-medium'>
                                  Pictures of the Book
                                </span>
                                <div className='mt-5'>
                                  <label
                                    className={`mt-1 flex justify-center px-6 py-20 border-2 ${
                                      dragEnter
                                        ? 'border-blue-500'
                                        : 'border-gray-300'
                                    } border-dashed rounded-md`}
                                    htmlFor='images-upload'
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                  >
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
                                          strokeWidth='2'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        ></path>
                                      </svg>
                                      <div className='flex text-sm text-gray-700'>
                                        <label
                                          htmlFor='images-upload'
                                          className='relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'
                                        >
                                          <span>Upload multiple photos</span>
                                          <input
                                            onChange={handleFiles}
                                            type='file'
                                            multiple
                                            name='images-upload'
                                            id='images-upload'
                                            className='sr-only'
                                          />
                                        </label>
                                        <p className='pl-1 font-semibold'>
                                          or drag and drop
                                        </p>
                                      </div>
                                      <p className='text-xs text-gray-600'>
                                        Each pictures size minimum 10KB
                                      </p>
                                      <p className='text-xs text-gray-600'>
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              {/* Preview multiple images */}
                              {bookCover?.length > 0 && (
                                <div className='sm:col-span-6 mx-auto mb-2'>
                                  <div className='space-y-2 sm:space-y-0 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3'>
                                    {bookCover?.map((image, index) => (
                                      <div key={index}>
                                        <div className='relative rounded overflow-hidden'>
                                          <img
                                            alt=''
                                            className='object-cover object-center w-full h-full shadow-3xl hover:opacity-95'
                                            src={image?.thumbnail}
                                          />

                                          {/* Remove photo */}
                                          <span
                                            className='absolute top-0 cursor-pointer right-0 bg-white bg-opacity-50 text-red-400 transition-colors duration-300 p-1 rounded hover:bg-gray-300 m-1'
                                            onClick={() =>
                                              handleRemoveImage(image, index)
                                            }
                                          >
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              className='h-6 w-6'
                                              fill='none'
                                              viewBox='0 0 24 24'
                                              stroke='currentColor'
                                            >
                                              <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                                              />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

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
                          </div>
                        </div>
                      </div>

                      <div className='pt-5'>
                        <div className='flex justify-end'>
                          <button
                            type='button'
                            onClick={() => {
                              setOpen(false);
                              setBookDetails({});
                            }}
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
