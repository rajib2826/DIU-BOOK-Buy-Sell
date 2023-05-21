import React, { useEffect, useState } from 'react';
import {
  deleteDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import Post from './Post';
import { useAuth } from '../components/Auth/AuthContext';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const { loggedInUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderBooks, setOrderBooks] = useState([]);

  // get users order books
  useEffect(() => {
    if (loggedInUser) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'orders'),
          where('sellerEmail', '==', loggedInUser?.email)
        ),
        (snapshot) => {
          const orderBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrderBooks(orderBooks);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  return (
    <>
      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-10 pb-16 px-4 sm:px-6 lg:px-8'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='sm:flex sm:items-center'>
              <div className='sm:flex-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>Orders</h1>
                <p className='mt-2 text-sm text-gray-700'>
                  All your orders are here. You can see your orders and cancel
                  them.
                </p>
              </div>
            </div>
            <div className='mt-8 flex flex-col'>
              <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-300'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                          >
                            Book Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Price
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Quantity
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Buyer Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Buyer Number
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Buyer Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {loading && (
                          <tr>
                            <td className='whitespace-nowrap py-4'>
                              <div className='flex items-center'>
                                <img
                                  className='w-16 ml-8'
                                  src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                                  alt=''
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                        {!loading &&
                          orderBooks?.length > 0 &&
                          orderBooks?.map((item) => (
                            <tr key={item?.orderId}>
                              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0'>
                                    <img
                                      className='h-10 w-10 rounded-lg'
                                      src={item?.bookCover}
                                      alt=''
                                    />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {item?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  {item?.sellingPrice}
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  {item?.quantity}
                                </div>
                              </td>
                              <td className='whitespace-nowrap py-4 pr-3 text-sm'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0'>
                                    <img
                                      className='h-10 w-10 rounded-lg'
                                      src={item?.buyerPhoto}
                                      alt=''
                                    />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {item?.buyerName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.buyerPhone}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.buyerAddress}
                              </td>
                            </tr>
                          ))}

                        {!loading && orderBooks?.length === 0 && (
                          <tr>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3'>
                              <div className='flex items-center'>
                                <div className='font-medium text-md text-gray-900'>
                                  No orders found
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
