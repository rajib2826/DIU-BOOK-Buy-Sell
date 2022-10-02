import React from 'react';
import { Link } from 'react-router-dom';

const Registration = () => {
  return (
    <section className='bg-gray-50'>
      <div className='px-4 py-20 mx-auto max-w-7xl'>
        <Link
          to='/'
          className='flex items-center justify-start sm:justify-center'
        >
          <img
            className='mx-auto h-12 w-auto'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            alt='Your Company'
          />
          <span className='sr-only'>Kutty</span>
        </Link>
        <div className='w-full px-0 pt-5 pb-6 mx-auto mt-4 mb-0 space-y-4 bg-transparent border-0 border-gray-200 rounded-lg md:bg-white md:border sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 md:px-6 sm:mt-8 sm:mb-5'>
          <h1 className='mb-5 text-xl sm:text-2xl text-left text-gray-800 sm:text-center'>
            Create your account
          </h1>
          <form className='pb-1 space-y-4'>
            <label className='block'>
              <span className='block mb-1 text-sm font-medium text-gray-700'>
                Full Name
              </span>
              <input
                className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                type='text'
                placeholder='Your full name'
                name='name'
                required
              />
            </label>
            <label className='block'>
              <span className='block mb-1 text-sm font-medium text-gray-700'>
                Your DIU Email
              </span>
              <input
                className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                type='email'
                placeholder='Ex. james15-1234@diu.edu.bd'
                name='email'
                required
              />
            </label>
            <div>
              <label
                htmlFor='department'
                className='block text-sm font-medium text-gray-700'
              >
                Select Department
              </label>
              <select
                id='department'
                name='department'
                className='mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                defaultValue=''
              >
                <option selected disabled>
                  Select
                </option>
                <option>CSE</option>
                <option>EEE</option>
                <option>CE</option>
                <option>SWE</option>
                <option>TE</option>
                <option>AE</option>
                <option>ARCH</option>
                <option>URP</option>
                <option>ENG</option>
                <option>NFE</option>
                <option>BBA</option>
              </select>
            </div>
            <label className='block'>
              <span className='block mb-1 text-sm font-medium text-gray-700'>
                Your Phone Number
              </span>
              <input
                className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                type='number'
                placeholder='Ex. 01700000000'
                name='phone'
                required
              />
            </label>
            <label className='block'>
              <span className='block mb-1 text-sm font-medium text-gray-700'>
                Create a password
              </span>
              <input
                className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                type='password'
                name='password'
                placeholder='••••••••'
                required
              />
            </label>
            <div className='flex flex-col items-start justify-between sm:items-center sm:flex-row'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  aria-label='checkbox'
                  className='form-checkbox rounded-sm border border-gray-400'
                />
                <span className='block ml-2 text-sm font-medium text-gray-700 cursor-pointer'>
                  Agree to Privacy Policy
                </span>
              </label>
              <input
                type='submit'
                className='w-full mt-5 btn btn-primary sm:w-auto sm:mt-0'
                value='Sign up'
              />
            </div>
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
  );
};

export default Registration;
