import { XCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';

const ForgotPassword = ({ setIsLostPasswordModalOpen }) => {
  const { forgotPassword } = useAuth();

  const {
    register: registerLostPassword,
    handleSubmit: handleLostPassword,
    formState: { errors },
  } = useForm();

  // handle lost password
  const onSubmit = (data) => {
    const loading = toast.loading('Please wait a moment...');
    const { email } = data;

    if (email) {
      forgotPassword(email)
        .then((res) => {
          toast.dismiss(loading);
          toast.success('A link sent to your email');
        })
        .catch((err) => {
          toast.dismiss(loading);
          let message = err.code.split('auth/')[1].replace(/-/g, ' ');
          toast.error(message.charAt(0).toUpperCase() + message.slice(1));
        });
    }
  };

  return (
    <div>
      <div className='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter saturate-150 backdrop-blur-sm'>
        <div className='relative my-20 sm:my-40 max-w-sm md:max-w-lg lg:max-w-4xl 2xl:max-w-5xl overflow-hidden mx-auto flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-xl mx-auto px-5 py-5 text-gray-800'>
            <div className='flex justify-end -mt-2'>
              <button
                className='absolute w-6 h-6 rounded-full text-red-400 hover:text-red-500 shadow-3xl flex justify-center items-center focus:bg-gray-50 focus:outline-none'
                onClick={() => setIsLostPasswordModalOpen(false)}
              >
                <XCircleIcon className='w-5 h-5' />
              </button>
            </div>
            <div className='mt-4'>
              <div className='flex flex-col justify-center'>
                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                  <h2 className='flex items-center text-3xl leading-[115%] sm:text-4xl sm:leading-[115%] font-semibold text-brand-accent-700 justify-center'>
                    Forgot your password?
                  </h2>
                  <p className='mt-6 text-center text-gray-600'>
                    Please enter your username or email address. You will
                    receive a link to create a new password via email.
                  </p>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                  <div className=' px-4 sm:rounded-lg sm:px-10'>
                    <form
                      className='space-y-6'
                      onSubmit={handleLostPassword(onSubmit)}
                    >
                      <div>
                        <label
                          htmlFor='email'
                          className='block font-medium text-gray-800'
                        >
                          Email address
                        </label>
                        <div className='mt-2'>
                          <input
                            {...registerLostPassword('email', {
                              required: 'Email is required',
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'Invalid email address',
                              },
                            })}
                            id='email'
                            name='email'
                            type='email'
                            placeholder='example@example.com'
                            className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-500 focus:outline-none leading-wide ${
                              errors.email
                                ? 'focus:border-red-500 focus:ring-red-500'
                                : 'focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                          />

                          <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                            {errors.email && errors.email.message}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          type='submit'
                          className='relative w-full h-auto inline-flex items-center justify-center rounded-full transition-colors text-base sm:text-lg font-semibold px-4 py-2 disabled:bg-opacity-70 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-white'
                        >
                          Submit
                        </button>
                      </div>
                    </form>

                    <div className='mt-6 mb-2'>
                      <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                          <div className='w-full border-t border-gray-300' />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                          <span className='px-2 bg-white text-gray-600'>
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <span
                        className='mt-2 block text-lg sm:text-xl text-center text-indigo-500 font-semibold hover:text-indigo-700 cursor-pointer'
                        onClick={() => setIsLostPasswordModalOpen(false)}
                      >
                        Login
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background Modal Opacity */}
      <div className='opacity-25 fixed inset-0 z-40 bg-gray-900' />
    </div>
  );
};

export default ForgotPassword;
