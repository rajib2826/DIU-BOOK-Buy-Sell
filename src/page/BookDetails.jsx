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
import { BsFacebook, BsWhatsapp, BsLinkedin } from 'react-icons/bs';


const product = {
  name: 'C Programming',
  href: '/books',
  price: '200',
  description:
    "C is a general-purpose programming language that is extremely popular, simple, and flexible. It is machine-independent, structured programming language which is used extensively in various applications.",

  imageSrc:
    'https://i.ibb.co/8Km7Rq0/download-1.jpg',
  imageAlt:
    'Model wearing light green backpack with black canvas straps and front zipper pouch.',
  breadcrumbs: [
    { id: 1, name: 'Books', href: '/' },
    { id: 2, name: 'Learn C Programming', href: '/' },
  ],
  person: {
    name: 'Md Rajib Hossain',
    role: 'CSE Student',
    imageUrl:
      'https://i.ibb.co/5cS6NJG/IMG-20220723-WA0010-01.jpg',
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
                  <span className='text-2xl font-bold'>৳</span> {product.price}
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
                  In stock and ready to buy
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
                                <span className='sr-only'>Facebook</span>
                                <BsFacebook className='w-6 h-6' />


                              </a>
                            </li>
                            <li>
                              <a
                                href={product.person.linkedinUrl}
                                className='text-gray-400 hover:text-gray-500'
                              >
                                <span className='sr-only'>Whatsapp</span>
                                <BsWhatsapp className='w-6 h-6' />
                              </a>
                            </li>
                            <li>
                              <a
                                href={product.person.linkedinUrl}
                                className='text-gray-400 hover:text-gray-500'
                              >
                                <span className='sr-only'>Linkedin</span>
                                <BsLinkedin className='w-6 h-6' />
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
                      Varified seller
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
