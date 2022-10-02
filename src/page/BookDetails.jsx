import React from 'react';
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';

const product = {
  name: 'Everyday Ruck Snack',
  href: '/books',
  price: '$220',
  description:
    "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
  imageSrc:
    'https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
  imageAlt:
    'Model wearing light green backpack with black canvas straps and front zipper pouch.',
  breadcrumbs: [
    { id: 1, name: 'Books', href: '/' },
    { id: 2, name: 'Learn C Programming', href: '/' },
  ],
  person: {
    name: 'Whitney Francis',
    role: 'Copywriter',
    imageUrl:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const BookDetails = () => {
  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          {/* Product details */}
          <div className='lg:max-w-lg lg:self-end'>
            <nav aria-label='Breadcrumb'>
              <ol role='list' className='flex items-center space-x-2'>
                {product.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                  <li key={breadcrumb.id}>
                    <div className='flex items-center text-sm'>
                      <Link
                        to={breadcrumb.href}
                        className='font-medium text-gray-500 hover:text-gray-900'
                      >
                        {breadcrumb.name}
                      </Link>
                      {breadcrumbIdx !== product.breadcrumbs.length - 1 ? (
                        <svg
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          aria-hidden='true'
                          className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'
                        >
                          <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                        </svg>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>

            <div className='mt-4'>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {product.name}
              </h1>
            </div>

            <section aria-labelledby='information-heading' className='mt-4'>
              <h2 id='information-heading' className='sr-only'>
                Product information
              </h2>

              <div className='flex items-center'>
                <p className='text-lg text-gray-900 sm:text-xl'>
                  {product.price}
                </p>
              </div>

              <div className='mt-4 space-y-6'>
                <p className='text-base text-gray-500'>{product.description}</p>
              </div>

              <div className='mt-6 flex items-center'>
                <CheckIcon
                  className='h-5 w-5 flex-shrink-0 text-green-500'
                  aria-hidden='true'
                />
                <p className='ml-2 text-sm text-gray-500'>
                  In stock and ready to ship
                </p>
              </div>
            </section>
          </div>

          {/* Product image */}
          <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
            <div className='aspect-w-1 aspect-h-1 overflow-hidden rounded-lg'>
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className='h-full w-full object-cover object-center'
              />
            </div>
          </div>

          {/* Product form */}
          <div className='mt-10 lg:max-w-lg self-start'>
            <section aria-labelledby='options-heading'>
              <h2 className='text-lg text-gray-900 sm:text-xl mb-4'>
                Contact Information
              </h2>

              <form>
                <div className='sm:flex sm:justify-between'>
                  <ul
                    role='list'
                    className='space-y-16 sm:space-y-0 lg:max-w-5xl'
                  >
                    <li key={product.person.name}>
                      <div className='space-y-6'>
                        <img
                          className='mx-auto h-20 w-20 rounded-full xl:h-28 xl:w-28'
                          src={product.person.imageUrl}
                          alt=''
                        />
                        <div className='space-y-2'>
                          <div className='space-y-1 text-lg font-medium leading-6'>
                            <h3>{product.person.name}</h3>
                            <p className='text-sm text-indigo-600'>
                              {product.person.role}
                            </p>
                          </div>
                          <ul role='list' className='flex space-x-5'>
                            <li>
                              <a
                                href={product.person.twitterUrl}
                                className='text-gray-400 hover:text-gray-500'
                              >
                                <span className='sr-only'>Twitter</span>
                                <svg
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
                                </svg>
                              </a>
                            </li>
                            <li>
                              <a
                                href={product.person.linkedinUrl}
                                className='text-gray-400 hover:text-gray-500'
                              >
                                <span className='sr-only'>LinkedIn</span>
                                <svg
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='mt-4'>
                  <a
                    href='#'
                    className='group inline-flex text-sm text-gray-500 hover:text-gray-700'
                  >
                    <span>What size should I buy?</span>
                    <QuestionMarkCircleIcon
                      className='ml-2 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
                  </a>
                </div>
                <div className='mt-10'>
                  <button
                    type='submit'
                    className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                  >
                    Buy Book
                  </button>
                </div>
                <div className='mt-6 text-center'>
                  <a
                    href='#'
                    className='group inline-flex text-base font-medium'
                  >
                    <ShieldCheckIcon
                      className='mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='text-gray-500 hover:text-gray-700'>
                      Lifetime Guarantee
                    </span>
                  </a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookDetails;
