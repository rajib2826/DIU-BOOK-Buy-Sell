import { useState, Fragment, useContext, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronUpIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { StoreContext } from '../components/Context/StoreContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../components/Auth/AuthContext';
import { RadioGroup } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const deliveryMethods = [
  { id: 1, title: 'COD', turnaround: 'Cash On Delivery' },
  { id: 2, title: 'PAY', turnaround: 'Online Payment' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Checkout = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  const { cart, setCart } = useContext(StoreContext);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register: registerOrder,
    handleSubmit: handleOrder,
    formState: { errors },
  } = useForm();

  const subtotal =
    cart?.length > 0 &&
    cart?.reduce((acc, book) => acc + Number(book?.sellingPrice), 0);
  const total = subtotal + 10;

  const onSubmit = async (data) => {
    data.email = loggedInUser?.email;
    data.photoURL = loggedInUser?.photoURL;
    data.dob = loggedInUser?.dob;

    const { displayName, email, photoURL, phone, address, dob, landmark } =
      data;

    const userEmail = loggedInUser?.email?.split('@');
    let orderId =
      loggedInUser?.department +
      '-' +
      Math.floor(1000 + Math.random() * 9000) +
      '-' +
      userEmail[0];

    const loading = toast.loading('Please wait...');
    try {
      const payload = {
        orderId,
        books: cart,
        customer: {
          email: email,
          name: displayName,
          photo: photoURL,
          url: dob,
          phone: phone,
        },
        delivery: {
          phone: phone,
          landmark: landmark,
          address: address,
          method: selectedDeliveryMethod?.title,
        },
        subtotal: Number(subtotal),
        total: total,
        paid: false,
        isReviewed: false,
        status: 'Order placed',
        timestamp: serverTimestamp(),
      };

      const docRef = doc(db, 'orders', orderId);
      await setDoc(docRef, payload, { merge: true });
      setCart([]);

      toast.dismiss(loading);

      // send email to user
      axios
        .post(`${process.env.REACT_APP_API_URL}/mail/bookingRentPlaced`, {
          orderId: orderId,
          name: displayName,
          email: email,
          orderTitle: `${cart?.length} book${
            cart?.length > 1 ? 's' : ''
          } from ${loggedInUser?.department} dept`,
          orderDate: new Date().toLocaleString('en-GB'),
          orderAmount: total,
          buyerEmail: cart?.[0]?.sellerEmail,
        })
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(err.data.message);
        });

      if (selectedDeliveryMethod?.title === 'PAY') {
        toast.success(`Book order placed. Please pay ${total} BDT`);
        const loading = toast.loading('Please wait a moment...');

        // send booking data to ssl commerz server for payment
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/sslcommerz`,
            {
              bookingId: orderId,
              total_amount: parseInt(total, 10),
              product_name: `${cart?.length} books ordered from ${loggedInUser?.department} dept for ${loggedInUser?.displayName}`,
              product_category: `${loggedInUser?.department} department`,
              cus_name: displayName,
              cus_email: email,
              cus_add1: address,
              cus_phone: phone,
              ship_name: displayName,
              ship_add1: landmark,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
          .then((res) => {
            toast.dismiss(loading);
            console.log(res);
            if (res?.data?.status === 'SUCCESS') {
              window.open(res?.data?.url, '_blank');
              navigate('/order-history');
            } else {
              toast.error('Session timeout! Please try again.');
            }
          })
          .catch((err) => {
            toast.dismiss(loading);
            toast.error(err?.message);
          });
      } else {
        toast.success(`Book order placed successfully!`);
        navigate('/order-history');
      }
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48'>
          <h1 className='sr-only'>Order information</h1>

          <section
            aria-labelledby='summary-heading'
            className='bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16'
          >
            <div className='mx-auto max-w-lg lg:max-w-none'>
              <h2
                id='summary-heading'
                className='text-lg font-medium text-gray-900 mb-4'
              >
                Order summary
              </h2>

              <ul
                role='list'
                className='divide-y divide-gray-200 text-sm font-medium text-gray-900'
              >
                {cart?.length > 0 &&
                  cart?.map((book) => (
                    <li
                      key={book?.listingId}
                      className='flex items-start space-x-4 py-6'
                    >
                      <img
                        src={book?.bookCover}
                        alt=''
                        className='h-20 w-20 flex-none rounded-md object-cover object-center'
                      />
                      <div className='flex-auto space-y-1'>
                        <h3>{book?.name}</h3>
                        <p className='text-gray-500'>
                          {book?.sellerDepartment}
                        </p>
                        <p className='text-gray-500'>Qty {book?.quantity}</p>
                      </div>
                      <p className='flex-none text-base font-medium'>
                        <span className='text-xl font-bold'>৳</span>{' '}
                        {book?.sellingPrice}
                      </p>
                    </li>
                  ))}
              </ul>

              <dl className='hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block'>
                <div className='flex items-center justify-between'>
                  <dt className='text-gray-600 font-semibold'>Subtotal</dt>
                  <dd>
                    <span className='text-2xl font-bold'>৳</span> {subtotal}
                  </dd>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-gray-600'>Delivery</dt>
                  <dd>
                    <span className='text-xl font-bold'>৳</span> 10
                  </dd>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-gray-600'>Charge</dt>
                  <dd>
                    <span className='text-xl font-bold'>৳</span> 0
                  </dd>
                </div>

                <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-lg'>
                  <dt className='text-lg'>Total</dt>
                  <dd>
                    <span className='text-2xl font-bold'>৳</span> {total}
                  </dd>
                </div>
              </dl>

              <Popover className='fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden'>
                <div className='relative z-40 border-t border-gray-200 bg-white px-4 sm:px-6'>
                  <div className='mx-auto max-w-lg'>
                    <Popover.Button className='flex w-full items-center py-6 font-medium'>
                      <span className='mr-auto text-base'>Total</span>
                      <span className='mr-2 text-base'>
                        <span className='text-xl font-bold'>৳</span> {total}
                      </span>
                      <ChevronUpIcon
                        className='h-5 w-5 text-gray-500'
                        aria-hidden='true'
                      />
                    </Popover.Button>
                  </div>
                </div>

                <Transition.Root as={Fragment}>
                  <div>
                    <Transition.Child
                      as={Fragment}
                      enter='transition-opacity ease-linear duration-300'
                      enterFrom='opacity-0'
                      enterTo='opacity-100'
                      leave='transition-opacity ease-linear duration-300'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Popover.Overlay className='fixed inset-0 bg-black bg-opacity-25' />
                    </Transition.Child>

                    <Transition.Child
                      as={Fragment}
                      enter='transition ease-in-out duration-300 transform'
                      enterFrom='translate-y-full'
                      enterTo='translate-y-0'
                      leave='transition ease-in-out duration-300 transform'
                      leaveFrom='translate-y-0'
                      leaveTo='translate-y-full'
                    >
                      <Popover.Panel className='relative bg-white px-4 py-6 sm:px-6'>
                        <dl className='mx-auto max-w-lg space-y-6'>
                          <div className='flex items-center justify-between'>
                            <dt className='text-gray-600'>Subtotal</dt>
                            <dd>
                              <span className='text-xl font-bold'>৳</span>{' '}
                              {subtotal}
                            </dd>
                          </div>

                          <div className='flex items-center justify-between'>
                            <dt className='text-gray-600'>Delivery</dt>
                            <dd>
                              <span className='text-xl font-bold'>৳</span> 10
                            </dd>
                          </div>

                          <div className='flex items-center justify-between'>
                            <dt className='text-gray-600'>Taxes</dt>
                            <dd>
                              <span className='text-xl font-bold'>৳</span> 0
                            </dd>
                          </div>
                        </dl>
                      </Popover.Panel>
                    </Transition.Child>
                  </div>
                </Transition.Root>
              </Popover>
            </div>
          </section>

          <form
            className='px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16'
            onSubmit={handleOrder(onSubmit)}
          >
            <div className='mx-auto max-w-lg lg:max-w-none'>
              <section aria-labelledby='contact-info-heading'>
                <h2
                  id='contact-info-heading'
                  className='text-lg font-medium text-gray-900'
                >
                  Contact information
                </h2>
                <div className='mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6'>
                  <div className='sm:col-span-6'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        defaultValue={loggedInUser?.displayName}
                        {...registerOrder('displayName', {
                          required: 'Name is required',
                          minLength: {
                            value: 6,
                            message: 'Name minimum 2 words',
                          },
                        })}
                        className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                          errors.displayName
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-indigo-500 focus:ring-indigo-500'
                        } `}
                      />
                      <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                        {errors?.displayName?.message}
                      </span>
                    </div>
                  </div>

                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='email-address'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Email address
                    </label>
                    <div className='mt-1'>
                      <input
                        value={loggedInUser?.email}
                        disabled
                        type='email'
                        id='email-address'
                        name='email-address'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Phone
                    </label>
                    <div className='mt-1'>
                      <input
                        defaultValue={loggedInUser?.phone}
                        {...registerOrder('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^(01[3-9])(\d{8})$/,
                            message:
                              'Phone number must be a valid 11 digit BD number',
                          },
                        })}
                        type='number'
                        placeholder='Ex. 01700000000'
                        id='phone'
                        name='phone'
                        className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                          errors.phone
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-indigo-500 focus:ring-indigo-500'
                        } `}
                      />
                      <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                        {errors?.phone?.message}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby='shipping-heading' className='mt-10'>
                <h2
                  id='shipping-heading'
                  className='text-lg font-medium text-gray-900'
                >
                  Delivery address
                </h2>

                <div className='mt-6 grid grid-cols-1 gap-x-4 gap-y-6'>
                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='landmark'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Flat no, Road no, Landmark etc.
                    </label>
                    <div className='mt-1'>
                      <input
                        {...registerOrder('landmark', {
                          required: 'Landmark is required',
                          minLength: {
                            value: 6,
                            message: 'Landmark minimum 2 words',
                          },
                        })}
                        type='text'
                        id='landmark'
                        name='landmark'
                        className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                          errors.landmark
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-indigo-500 focus:ring-indigo-500'
                        } `}
                      />
                      <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                        {errors?.landmark?.message}
                      </span>
                    </div>
                  </div>

                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='address'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Address
                    </label>
                    <div className='mt-1'>
                      <input
                        defaultValue={loggedInUser?.address}
                        {...registerOrder('address', {
                          required: 'Address is required',
                          minLength: {
                            value: 6,
                            message: 'Address minimum 2 words',
                          },
                        })}
                        type='text'
                        id='address'
                        name='address'
                        className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm${
                          errors.address
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-indigo-500 focus:ring-indigo-500'
                        } `}
                      />
                      <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                        {errors?.address?.message}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className='mt-10 border-t border-gray-200 pt-10'>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                >
                  <RadioGroup.Label className='text-lg font-medium text-gray-900'>
                    Delivery method
                  </RadioGroup.Label>

                  <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                    {deliveryMethods?.map((deliveryMethod) => (
                      <RadioGroup.Option
                        key={deliveryMethod?.id}
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
                                  className='block text-sm font-medium text-gray-500'
                                >
                                  {deliveryMethod?.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as='span'
                                  className='mt-1 flex items-center text-base text-gray-900'
                                >
                                  {deliveryMethod?.turnaround}
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

              <div className='mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between'>
                <button
                  type='submit'
                  className='w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
                >
                  Confirm Order
                </button>
                <p className='mt-4 text-center text-sm text-gray-500 sm:mt-0'>
                  I agree to the terms and conditions.
                </p>
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
