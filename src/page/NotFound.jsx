import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className='flex items-center h-full pt-28'>
      <div className='container flex flex-col items-center justify-center px-5 mx-auto my-8'>
        <div className='max-w-md text-center'>
          <h2 className='mb-8 font-extrabold text-9xl text-gray-800'>
            <span className='sr-only'>Error</span>404
          </h2>
          <p className='text-2xl font-semibold md:text-3xl text-gray-800'>
            Sorry, we couldn't find this page!
          </p>
          <p className='mt-4 mb-8'>
            But don't worry, you can find plenty of other things on our
            homepage.
          </p>
          <Link
            to='/'
            className='px-8 py-3 font-semibold rounded bg-indigo-500 hover:bg-indigo-600 text-gray-50'
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
