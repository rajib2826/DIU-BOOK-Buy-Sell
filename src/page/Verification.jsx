import React from 'react';

const Verification = () => {
  return (
    <div>
      <div className='bg-white px-6 py-24 sm:py-32 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <p className='text-base font-semibold leading-7 text-indigo-600'>
            Email Verification Needed!
          </p>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Your Email is Not Verified!
          </h2>
          <p className='mt-6 text-xl leading-8 text-gray-600'>
            Please go to your email inbox and verify your email address to click
            the verification link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
