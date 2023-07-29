import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';
import Navbar from '../components/Layout/Navbar';

const Registration = () => {
  const navigate = useNavigate();
  const { register, setJWTToken } = useAuth();
  const [typePass, setTypePass] = useState(false);

  const {
    register: registerSignUp,
    handleSubmit: handleSignUp,
    formState: { errors },
    watch,
  } = useForm();
  const passwordStrength = watch('password');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResponse = (res) => {
    setJWTToken();
    toast.success('Registration Successful');
    navigate('/verification');
  };

  // Sign In with Email and Password
  const onSubmit = (data) => {
    const { name, phone, email, password, department } = data;
    const userEmail = email?.split('@');

    if (
      userEmail?.[1] !== 'diu.edu.bd' &&
      userEmail?.[1] !== 'daffodilvarsity.edu.bd' &&
      userEmail?.[1] !== 's.diu.edu.bd'
    ) {
      toast.error('Please use your DIU email address');
      return;
    }

    if (department === '') {
      toast.error('Department is required');
      return;
    }

    // For Registration
    const loading = toast.loading('Please wait a moment...');
    if (name && phone && email && password && department) {
      register(name, phone, email.toLowerCase(), password, department)
        .then((res) => {
          toast.dismiss(loading);
          handleResponse(res);
        })
        .catch((err) => {
          toast.dismiss(loading);
          let message = err.code.split('auth/')[1].replace(/-/g, ' ');
          toast.error(message.charAt(0).toUpperCase() + message.slice(1));
        });
    }
  };

  return (
    <>
      <Navbar />{' '}
      <section className='bg-gray-50'>
        <div className='px-4 py-20 mx-auto max-w-7xl'>
          <Link
            to='/'
            className='flex items-center justify-start sm:justify-center'
          >
            <img
              className='mx-auto h-12 w-auto'
              src='https://i.ibb.co/YytpcVr/logo-image-removebg-preview.png'
              alt='Your Company'
            />
            <span className='sr-only'>Kutty</span>
          </Link>
          <div className='w-full px-0 pt-5 pb-6 mx-auto mt-4 mb-0 space-y-4 bg-transparent border-0 border-gray-200 rounded-lg md:bg-white md:border sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 md:px-6 sm:mt-8 sm:mb-5'>
            <h1 className='mb-5 text-xl font-semibold sm:text-2xl text-left text-gray-800 sm:text-center'>
              Create your account
            </h1>
            <form className='pb-1 space-y-4' onSubmit={handleSignUp(onSubmit)}>
              <label className='block'>
                <span className='block mb-1 text-sm font-medium text-gray-700'>
                  Full Name
                </span>
                <input
                  {...registerSignUp('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 6,
                      message: 'Name minimum 2 words',
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.name
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  type='text'
                  placeholder='Your full name'
                  name='name'
                />

                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.name?.message}
                </span>
              </label>
              <label className='block'>
                <span className='block mb-1 text-sm font-medium text-gray-700'>
                  Your DIU Email
                </span>
                <input
                  {...registerSignUp('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.email
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  type='email'
                  placeholder='Ex. james15-1234@diu.edu.bd'
                  name='email'
                />

                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.email?.message}
                </span>
              </label>
              <div>
                <label
                  htmlFor='department'
                  className='block text-sm font-medium text-gray-700'
                >
                  Select Department
                </label>
                <select
                  {...registerSignUp('department', {
                    required: 'Department is required',
                  })}
                  id='department'
                  name='department'
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.department
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  defaultValue=''
                >
                  <option selected disabled value=''>
                    Choose
                  </option>
                  <option value='CSE'>CSE</option>
                  <option value='EEE'>EEE</option>
                  <option value='CE'>CE</option>
                  <option value='SWE'>SWE</option>
                  <option value='TE'>TE</option>
                  <option value='AE'>AE</option>
                  <option value='ARCH'>ARCH</option>
                  <option value='URP'>URP</option>
                  <option value='ENG'>ENG</option>
                  <option value='NFE'>NFE</option>
                  <option value='BBA'>BBA</option>
                </select>
                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.department?.message}
                </span>
              </div>
              <label className='block'>
                <span className='block mb-1 text-sm font-medium text-gray-700'>
                  Your Phone Number
                </span>
                <input
                  {...registerSignUp('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(01[3-9])(\d{8})$/,
                      message:
                        'Phone number must be a valid 11 digit BD number',
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.phone
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  type='number'
                  placeholder='Ex. 01700000000'
                  name='phone'
                />

                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.phone?.message}
                </span>
              </label>
              <label className='relative block'>
                <span className='block mb-1 text-sm font-medium text-gray-700'>
                  Create a password
                </span>
                <input
                  {...registerSignUp('password', {
                    required: 'Password is required',
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&;:`"'%<,>./?~^-_=+])[A-Za-z\d@$!%*#?&;:`"'%<,>./?~^-_=+]{8,}$/i,
                      message:
                        'Minimum eight characters, at least one letter, one number and one special character',
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.password
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  type={typePass ? 'text' : 'password'}
                  name='password'
                  placeholder='••••••••'
                />
                <span className='absolute right-0 pr-4 top-8 flex items-center text-base leading-5 cursor-pointer'>
                  {typePass ? (
                    <EyeIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  )}
                </span>
                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.password?.message}
                </span>
              </label>
              <label className='relative block'>
                <span className='block mb-1 text-sm font-medium text-gray-700'>
                  Confirm password
                </span>
                <input
                  {...registerSignUp('confirmPassword', {
                    validate: (value) => value === passwordStrength,
                  })}
                  className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                    errors?.confirmPassword
                      ? 'focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  type={typePass ? 'text' : 'password'}
                  name='confirmPassword'
                  placeholder='••••••••'
                />
                <span className='absolute right-0 pr-4 top-8 flex items-center text-base leading-5 cursor-pointer'>
                  {typePass ? (
                    <EyeIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  )}
                </span>
                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.confirmPassword && `Passwords don't match!`}
                </span>
              </label>
              <div className='flex flex-col items-start justify-between sm:items-center sm:flex-row'>
                <label className='flex items-center'>
                  <input
                    {...registerSignUp('TermsCondition', {
                      required: true,
                    })}
                    type='checkbox'
                    aria-label='checkbox'
                    className={`form-checkbox rounded-sm border border-gray-400 ${
                      errors?.TermsCondition
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                  />
                  <span className='block ml-2 text-sm font-medium text-gray-700 cursor-pointer'>
                    Agree to Privacy Policy
                  </span>
                </label>
                <input
                  type='submit'
                  className='w-full mt-5 btn btn-primary sm:w-auto sm:mt-0 cursor-pointer'
                  value='Sign up'
                />
              </div>

              {errors.TermsCondition && (
                <span className=' font-medium tracking-wide text-red-500 text-sm ml-1'>
                  Please accept our Terms & Conditions
                </span>
              )}
            </form>
          </div>
          <p className='my-0 text-sm font-medium text-center text-gray-700 sm:my-5'>
            Already have an account?
            <Link
              to='/login'
              className='ml-2 text-purple-700 hover:text-purple-900'
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Registration;
