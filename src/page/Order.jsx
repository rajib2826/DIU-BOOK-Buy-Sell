import React from 'react';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';

const products = [
  {
    id: 11,
    name: 'Python Programming',
    color: 'CSE',
    status: 'Sold',
    href: '/book-details',
    imageSrc: 'https://i.ibb.co/khFCjv5/41-Elp-Vy-Q9c-L.jpg',
    imageAlt:
      'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '290',
    quantity: 1,
  },
  {
    id: 2,
    name: 'C Programming',
    color: 'CSE',
    status: 'Unsold',
    href: '/book-details',
    imageSrc: 'https://i.ibb.co/3YtDsdY/download-1.jpg',
    imageAlt:
      'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '240',
    quantity: 1,
  },
];

const Order = () => {
  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
          <div className='max-w-xl'>
            <h1 className='text-lg font-medium text-indigo-600'>Thank you!</h1>
            <p className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-gray-800'>
              It's on the way!
            </p>
            <p className='mt-2 text-lg text-gray-500'>
              Your order #14034056 has shipped and will be with you soon.
            </p>

            <dl className='mt-12 text-base font-medium'>
              <dt className='text-gray-900'>Tracking number</dt>
              <dd className='mt-2 text-indigo-600'>51547878755545848512</dd>
            </dl>
          </div>

          <div className='mt-10 border-t border-gray-200'>
            <h2 className='sr-only'>Your order</h2>

            <h3 className='sr-only'>Items</h3>
            {products.map((product) => (
              <div
                key={product.id}
                className='flex space-x-6 border-b border-gray-200 py-10'
              >
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className='h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40'
                />
                <div className='flex flex-auto flex-col'>
                  <div>
                    <h4 className='font-medium text-gray-900 text-lg'>
                      <a href={product.href}>{product.name}</a>
                    </h4>
                    <p className='mt-2 text-base text-gray-600'>
                      {product.color}
                    </p>
                  </div>
                  <div className='mt-6 flex flex-1 items-end'>
                    <dl className='flex space-x-4 divide-x divide-gray-200 text-base sm:space-x-6'>
                      <div className='flex'>
                        <dt className='font-medium text-gray-700'>Quantity</dt>
                        <dd className='ml-2 text-gray-900 font-semibold'>
                          {product.quantity}
                        </dd>
                      </div>
                      <div className='flex pl-4 sm:pl-6'>
                        <dt className='font-medium text-gray-700'>Price</dt>
                        <dd className='ml-2 text-gray-900 font-semibold'>
                          <span className='text-base font-semibold'>৳</span>{' '}
                          {product.price}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}

            <div className='sm:ml-40 sm:pl-6'>
              <h3 className='sr-only'>Your information</h3>

              <h4 className='sr-only'>Addresses</h4>
              <dl className='grid grid-cols-2 gap-x-6 py-10 text-base'>
                <div>
                  <dt className='font-medium text-gray-900'>
                    Delivery address
                  </dt>
                  <dd className='mt-2 text-gray-700'>
                    <address className='not-italic'>
                      <span className='block'>Kristin Watson</span>
                      <span className='block'>7363 Cynthia Pass</span>
                      <span className='block'>Toronto, ON N3Y 4H8</span>
                    </address>
                  </dd>
                </div>
              </dl>

              <h4 className='sr-only'>Payment</h4>
              <dl className='grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-base'>
                <div>
                  <dt className='font-medium text-gray-900'>Payment method</dt>
                  <dd className='mt-2 text-gray-700'>
                    <p>Cash on delivery</p>
                    <p>
                      Delivery charge:{' '}
                      <span className='font-bold'>
                        <span className='text-base font-semibold'>৳</span> 0
                      </span>
                    </p>
                  </dd>
                </div>
              </dl>

              <h3 className='sr-only'>Summary</h3>

              <dl className='space-y-6 border-t border-gray-200 pt-10 text-base'>
                <div className='flex justify-between'>
                  <dt className='font-medium text-gray-900'>Subtotal</dt>
                  <dd className='text-gray-700'>
                    <span className='text-base font-semibold'>৳</span> 360
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt className='flex font-medium text-gray-900'>
                    Discount
                    <span className='ml-2 rounded-full bg-gray-200 py-0.5 px-2 text-xs text-gray-600'>
                      STUDENT50
                    </span>
                  </dt>
                  <dd className='text-gray-700'>
                    -<span className='text-base font-semibold'>৳</span> 180
                    (50%)
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt className='font-medium text-gray-900'>Shipping</dt>
                  <dd className='text-gray-700'>
                    <span className='text-base font-semibold'>৳</span> 0
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt className='font-medium text-gray-900'>Total</dt>
                  <dd className='text-gray-900'>
                    <span className='text-base font-semibold'>৳</span> 230
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Order;
