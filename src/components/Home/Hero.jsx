import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className='pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48'>
        <div className='relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8'>
          <div className='sm:max-w-lg'>
            <h1 className='text-4xl font-semibold sm:leading-tight tracking-normal text-indigo-800 sm:text-5xl'>
              Largest book buy-sell platform in DIU
            </h1>
            <p className='mt-8 text-xl text-gray-500'>
              This year, our new summer collection will shelter you from the
              harsh elements of a world that doesn't care if you live or die.
            </p>
          </div>
          <div>
            <div className='mt-10'>
              {/* Decorative image grid */}
              <div
                aria-hidden='true'
                className='pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl'
              >
                <div className='absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8'>
                  <div className='flex items-center space-x-6 lg:space-x-8'>
                    <div className='grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8'>
                      <div className='h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100'>
                        <img
                          src='https://i.ibb.co/LNzjLqP/41-SNoh5-Zh-OL-SX440-BO1-204-203-200.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/r5cNmLf/61x-Ip-TM0-r-L.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8'>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/GxnwdpM/41-Aql-YKPfp-L-SL500.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/HtZmmpR/images.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/4W6SKmb/download.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8'>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/YNXc6Jt/EE6604-Design-of-Electrical-Machines.webp'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                      <div className='h-64 w-44 overflow-hidden rounded-lg'>
                        <img
                          src='https://i.ibb.co/3YtDsdY/download-1.jpg'
                          alt=''
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/books')}
                className='inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700'
              >
                View Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
