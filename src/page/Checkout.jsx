import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
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
const deliveryMethods = [
  {
    id: 1,
    title: 'Cash on delivery',
    turnaround: '1-3 days',
  },
];
const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );

  return (
    <>
      <Navbar />

      <div>
        <div className='mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='sr-only'>Checkout</h2>

          <form className='lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'>
            <div>
              <div>
                <h2 className='text-lg font-medium text-gray-900'>
                  Contact information
                </h2>

                <div className='mt-4'>
                  <label
                    htmlFor='email-address'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email address
                  </label>
                  <div className='mt-1'>
                    <input
                      type='email'
                      id='email-address'
                      name='email-address'
                      autoComplete='email'
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-10 border-t border-gray-200 pt-10'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Shipping information
                </h2>

                <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='first-name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Full name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='first-name'
                        name='first-name'
                        autoComplete='given-name'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='address'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Address
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='address'
                        id='address'
                        autoComplete='street-address'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='apartment'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Apartment, suite, etc.
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='apartment'
                        id='apartment'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Phone
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='phone'
                        id='phone'
                        autoComplete='tel'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-10 border-t border-gray-200 pt-10'>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                >
                  <RadioGroup.Label className='text-lg font-medium text-gray-900'>
                    Delivery method
                  </RadioGroup.Label>

                  <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                    {deliveryMethods.map((deliveryMethod) => (
                      <RadioGroup.Option
                        key={deliveryMethod.id}
                        value={deliveryMethod}
                        className={({ checked, active }) =>
                          classNames(
                            checked ? 'border-transparent' : 'border-gray-300',
                            active ? 'ring-2 ring-indigo-500' : '',
                            'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                          )
                        }
                      >
                        {({ checked, active }) => (
                          <>
                            <span className='flex flex-1'>
                              <span className='flex flex-col'>
                                <RadioGroup.Label
                                  as='span'
                                  className='block text-sm font-medium text-gray-900'
                                >
                                  {deliveryMethod.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as='span'
                                  className='mt-1 flex items-center text-sm text-gray-500'
                                >
                                  {deliveryMethod.turnaround}
                                </RadioGroup.Description>
                              </span>
                            </span>
                            {checked ? (
                              <CheckCircleIcon
                                className='h-5 w-5 text-indigo-600'
                                aria-hidden='true'
                              />
                            ) : null}
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked
                                  ? 'border-indigo-500'
                                  : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg'
                              )}
                              aria-hidden='true'
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order summary */}
            <div className='mt-10 lg:mt-0'>
              <h2 className='text-lg font-medium text-gray-900'>
                Order summary
              </h2>

              <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
                <h3 className='sr-only'>Items in your cart</h3>
                <ul role='list' className='divide-y divide-gray-200'>
                  {products.map((product) => (
                    <li key={product.id} className='flex py-6 px-4 sm:px-6'>
                      <div className='flex-shrink-0'>
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className='w-20 rounded-md'
                        />
                      </div>

                      <div className='ml-6 flex flex-1 flex-col'>
                        <div className='flex'>
                          <div className='min-w-0 flex-1'>
                            <h4 className='text-sm'>
                              <a
                                href={product.href}
                                className='font-medium text-gray-700 hover:text-gray-800'
                              >
                                {product.name}
                              </a>
                            </h4>
                            <p className='mt-1 text-sm text-gray-500'>
                              {product.color}
                            </p>
                            <p className='mt-1 text-sm text-gray-500'>
                              {product.size}
                            </p>
                          </div>

                          <div className='ml-4 flow-root flex-shrink-0'>
                            <button
                              type='button'
                              className='-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500'
                            >
                              <span className='sr-only'>Remove</span>
                              <TrashIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </button>
                          </div>
                        </div>

                        <div className='flex flex-1 items-end justify-between pt-2'>
                          <p className='relative text-lg font-medium text-gray-900'>
                            <span className='text-xl font-semibold'>৳</span>{' '}
                            {product.price}
                          </p>

                          <div className='ml-4'>
                            <label
                              htmlFor='quantity'
                              className='text-gray-600 mr-2'
                            >
                              Quantity
                            </label>
                            <select
                              id='quantity'
                              name='quantity'
                              className='rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={6}>6</option>
                              <option value={7}>7</option>
                              <option value={8}>8</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className='space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6'>
                  <div className='flex items-center justify-between'>
                    <dt className='text-md'>Subtotal</dt>
                    <dd className='text-md font-medium text-gray-900'>
                      <span className='text-lg font-semibold'>৳</span> 640
                    </dd>
                  </div>
                  <div className='flex items-center justify-between'>
                    <dt className='text-md'>Shipping</dt>
                    <dd className='text-md font-medium text-gray-900'>
                      <span className='text-lg font-semibold'>৳</span> 0
                    </dd>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-200 pt-6'>
                    <dt className='text-md font-medium'>Total</dt>
                    <dd className='text-md font-medium text-gray-900'>
                      <span className='text-lg font-semibold'>৳</span> 640
                    </dd>
                  </div>
                </dl>

                <div className='border-t border-gray-200 py-6 px-4 sm:px-6'>
                  <button
                    type='button'
                    className='w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                    onClick={() => navigate('/order')}
                  >
                    Confirm order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
