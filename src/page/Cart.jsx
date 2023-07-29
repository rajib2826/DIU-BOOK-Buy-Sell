import { Fragment, useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StoreContext } from '../components/Context/StoreContext';
import { Link } from 'react-router-dom';

const Cart = ({ open, setOpen }) => {
  const { cart, setCart } = useContext(StoreContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveBook = (bookId) => {
    const newCart = cart?.filter((book) => book?.listingId !== bookId);
    setCart(newCart);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                    <div className='flex-1 overflow-y-auto px-4 py-6 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-xl font-medium text-indigo-700'>
                          Shopping cart
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='-m-2 p-2 text-gray-400 hover:text-gray-500'
                            onClick={() => setOpen(false)}
                          >
                            <span className='sr-only'>Close panel</span>
                            <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>

                      <div className='mt-8'>
                        <div className='flow-root'>
                          <ul
                            role='list'
                            className='-my-6 divide-y divide-gray-200'
                          >
                            {cart?.length > 0 &&
                              cart?.map((book) => (
                                <li key={book?.listingId} className='flex py-6'>
                                  <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                    <img
                                      src={book?.bookCover}
                                      alt=''
                                      className='h-full w-full object-cover object-center'
                                    />
                                  </div>

                                  <div className='ml-4 flex flex-1 flex-col'>
                                    <div>
                                      <div className='flex justify-between text-base font-medium text-gray-900'>
                                        <h3>
                                          <Link
                                            to={`/book-details/${book?.listingId}`}
                                          >
                                            {book?.name}
                                          </Link>
                                        </h3>
                                        <p className='ml-4 flex'>
                                          <span className='text-base mr-1 font-bold'>
                                            ৳
                                          </span>{' '}
                                          {book?.sellingPrice}
                                        </p>
                                      </div>
                                      <p className='mt-1 text-sm text-gray-500'>
                                        {book?.sellerDepartment}
                                      </p>
                                    </div>
                                    <div className='flex flex-1 items-end justify-between text-sm'>
                                      <p className='text-gray-500'>
                                        Qty {book?.quantity}
                                      </p>

                                      <div className='flex'>
                                        <button
                                          onClick={() =>
                                            handleRemoveBook(book?.listingId)
                                          }
                                          type='button'
                                          className='font-medium text-indigo-600 hover:text-indigo-500'
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {cart?.length === 0 && (
                          <div className='mt-4'>
                            <div className='flex flex-col items-center justify-center'>
                              <ShoppingBagIcon
                                className='h-12 w-12 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mb-2'
                                aria-hidden='true'
                              />
                              <p className='font-semibold text-lg sm:text-xl text-gray-800'>
                                Your cart is empty!
                              </p>
                              <p className='mt-1.5 text-sm text-gray-600 mb-6'>
                                Add books to your cart to see them here.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                      <div className='flex justify-between text-lg font-medium text-gray-900'>
                        <p>Subtotal</p>
                        <p className='font-semibold'>
                          <span className='text-2xl font-bold'>৳</span>{' '}
                          {cart?.reduce(
                            (acc, book) => acc + Number(book?.sellingPrice),
                            0
                          )}
                        </p>
                      </div>
                      <p className='mt-0.5 text-sm text-gray-600 mb-6'>
                        Delivery charges are calculated at checkout.
                      </p>
                      <Link to={cart?.length === 0 ? '/books' : '/checkout'}>
                        <div
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                            cart?.length === 0
                              ? 'bg-indigo-300  hover:bg-indigo-300 cursor-not-allowed'
                              : 'bg-indigo-600  hover:bg-indigo-700 cursor-pointer'
                          }`}
                        >
                          Checkout
                        </div>
                      </Link>
                      <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                        <p>
                          or{' '}
                          <button
                            type='button'
                            className='font-medium text-indigo-600 hover:text-indigo-500'
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden='true'> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Cart;
