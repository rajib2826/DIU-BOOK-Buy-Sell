import React from 'react';

const Community = () => {
  return (
    <>
      <div className='bg-white'>
        <div className='pb-12 pt-6'>
          <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
            <div className='mx-auto px-4 lg:px-0'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
                Community
              </h1>
              <p className='mt-2 text-sm text-gray-600'>
                Community messaging facilitates effective communication and
                collaboration within a group, fostering unity and enhancing
                engagement.
              </p>
            </div>
          </div>

          {/* Message */}
          <div className='my-32'>
            <div className='flex items-center justify-center'>
              <div className='font-semibold text-lg sm:text-xl text-gray-900'>
                This features is coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
