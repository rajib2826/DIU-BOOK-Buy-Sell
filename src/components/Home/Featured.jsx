import React from 'react';

const Featured = () => {
  return (
    <section
      aria-labelledby='sale-heading'
      className='relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 text-center sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-2xl lg:max-w-none'>
        <h2
          id='sale-heading'
          className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl'
        >
          Get 25% off during our one-time sale
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-xl text-gray-600'>
          Most of our products are limited releases that won't come back. Get
          your favorite items while they're in stock.
        </p>
        <a
          href='#'
          className='mt-6 inline-block w-full rounded-md border border-transparent bg-gray-900 py-3 px-8 font-medium text-white hover:bg-gray-800 sm:w-auto'
        >
          Get access to our one-time sale
        </a>
      </div>
    </section>
  );
};

export default Featured;
