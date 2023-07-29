import { useContext } from 'react';
import { StoreContext } from '../components/Context/StoreContext';

const PaymentHistory = () => {
  const { paymentsLoading, payments } = useContext(StoreContext);

  return (
    <>
      <div className='bg-white'>
        <div className='pb-12 pt-6'>
          <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
            <div className='mx-auto px-4 lg:px-0'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
                Payment History
              </h1>
              <p className='mt-2 text-sm text-gray-600'>
                Payment history provides a comprehensive record of financial
                transactions, reflecting an individual's or organization's
                reliability and creditworthiness.
              </p>
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
                            Payment Id
                          </th>
                          <th
                            scope='col'
                            className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                          >
                            Payment Date
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Payment Amount
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Payment For
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Purchase Id
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Book Item
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {paymentsLoading && (
                          <tr>
                            <td className='whitespace-nowrap py-4'>
                              <div className='flex items-center'>
                                <img
                                  className='w-16 ml-8'
                                  src='https://media.tenor.com/On7kvXhzml4AAAAj/paymentsLoading-gif.gif'
                                  alt=''
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                        {!paymentsLoading &&
                          payments?.length > 0 &&
                          payments?.map((item) => (
                            <tr key={item?.transitionId}>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.transitionId}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.transitionDate}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  <span className='text-base mr-1 font-bold'>
                                    ৳
                                  </span>{' '}
                                  {item?.transitionAmount}
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.reason}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.orderId}
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.books?.length}
                              </td>
                            </tr>
                          ))}

                        {!paymentsLoading && payments?.length === 0 && (
                          <tr>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3'>
                              <div className='flex items-center'>
                                <div className='font-medium text-md text-gray-900'>
                                  No payments found
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
    </>
  );
};

export default PaymentHistory;
