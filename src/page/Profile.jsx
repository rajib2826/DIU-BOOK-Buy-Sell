import React, { useState, useEffect } from 'react';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../components/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getBase64URL, resizeImg } from '../components/utils/imageFn';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';
import { db } from '../firebaseConfig';

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const { loggedInUser } = useAuth();
  const [fileUrl, setFileUrl] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfile,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const accountCreationDate = new Date(loggedInUser?.accountCreated);

  // update profile picture
  const onFileChange = async (e) => {
    try {
      const file = e.target.files[0];

      const base64URL = await getBase64URL(file);

      // image resize
      const blob = await resizeImg(base64URL, 800, false);

      // Create the file metadata
      const metadata = {
        contentType: 'image/jpeg',
      };

      const loading = toast.loading('Uploading photo...');

      let fileName = Math.floor(1000 + Math.random() * 9000) + '-' + file.name;

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(
        storage,
        `users/${loggedInUser?.email?.substring(
          0,
          loggedInUser?.email?.lastIndexOf('@')
        )}/` + fileName.replace(/ /g, '_')
      );
      await uploadBytes(storageRef, blob, metadata);

      // get the download url
      const downloadURL = await getDownloadURL(storageRef);
      setFileUrl(downloadURL);

      // update profile
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL || loggedInUser?.photoURL,
      });

      const docRef = doc(db, 'users', loggedInUser?.email);
      const payload = {
        photoURL: downloadURL || loggedInUser?.photoURL,
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });

      toast.dismiss(loading);
      toast.success('Photo upload successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // update user profile
  const onSubmit = async (data) => {
    data.email = loggedInUser?.email;
    data.photoURL = fileUrl || loggedInUser?.photoURL;

    const { displayName, email, photoURL, address, dob } = data;

    if (displayName && email && address) {
      const loading = toast.loading('Please wait...');

      try {
        // update profile
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: fileUrl || photoURL,
        });

        const docRef = doc(db, 'users', loggedInUser?.email);
        const payload = {
          displayName,
          email,
          photoURL: fileUrl || photoURL,
          address,
          dob,
          timestamp: serverTimestamp(),
        };

        await setDoc(docRef, payload, { merge: true });

        toast.dismiss(loading);
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.dismiss(loading);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-10 pb-16 px-4 sm:px-6 lg:px-8'>
          <form className='space-y-6' onSubmit={handleProfile(onSubmit)}>
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
                      <label
                        htmlFor='photo'
                        className='block text-sm sm:text-base font-medium text-blue-gray-900'
                      >
                        Photo
                      </label>
                      <div className='mt-2 flex items-center'>
                        <img
                          className='inline-block object-cover object-center w-20 h-20 rounded-full'
                          src={fileUrl || loggedInUser?.photoURL}
                          alt=''
                        />
                        <div className='ml-4 flex  cursor-pointer '>
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
                          defaultValue={loggedInUser?.displayName}
                          {...registerProfile('displayName', {
                            required: 'Name is required',
                            minLength: {
                              value: 6,
                              message: 'Name minimum 2 words',
                            },
                          })}
                          className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                            errors.displayName
                              ? 'focus:border-red-500 focus:ring-red-500'
                              : 'focus:border-indigo-500 focus:ring-indigo-500'
                          } `}
                        />
                        <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                          {errors?.displayName?.message}
                        </span>
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='address'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Address
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <input
                          type='text'
                          name='address'
                          id='address'
                          defaultValue={loggedInUser?.address}
                          {...registerProfile('address', {
                            required: 'Address is required',
                            minLength: {
                              value: 6,
                              message: 'Address minimum 2 words',
                            },
                          })}
                          className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                            errors.address
                              ? 'focus:border-red-500 focus:ring-red-500'
                              : 'focus:border-indigo-500 focus:ring-indigo-500'
                          } `}
                        />
                        <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                          {errors?.address?.message}
                        </span>
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
                        defaultValue={loggedInUser?.dob}
                        {...registerProfile('dob')}
                        className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                          errors.dob
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-indigo-500 focus:ring-indigo-500'
                        } `}
                      />
                      <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                        {errors?.dob?.message}
                      </span>
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
                        defaultValue={loggedInUser?.email}
                        disabled
                        type='email'
                        name='email-address'
                        id='email-address'
                        autoComplete='email'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <p className='text-sm text-gray-500 sm:col-span-6'>
                      This account was created on{' '}
                      <span>
                        {accountCreationDate?.toLocaleString('en-GB')}
                      </span>
                    </p>

                    {/* <div className='col-span-6 sm:col-span-3'>
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
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                type='button'
                onClick={() => navigate('/')}
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
