import { useState } from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import { useContext } from 'react';
import { StoreContext } from '../components/Context/StoreContext';

const DashboardHome = () => {
  const { loggedInUser } = useAuth();

  const { user, userFavoriteBooks, allBooks, orderBooks, reviews, userBooks } =
    useContext(StoreContext);

  const orders = orderBooks?.filter(
    (order) => order?.customer?.email === loggedInUser?.email
  );
  const userReview = reviews?.filter(
    (review) => review?.userEmail === loggedInUser?.email
  );

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl pt-6 pb-16 px-4 sm:px-6 lg:px-8'>
        <div>
          <div className='relative bg-indigo-50 p-4 sm:p-6 rounded-sm overflow-hidden mb-8 mt-2'>
            {/* Background illustration */}
            <div
              className='absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block'
              aria-hidden='true'
            >
              <svg
                width='319'
                height='198'
                xmlnsXlink='http://www.w3.org/1999/xlink'
              >
                <defs>
                  <path id='welcome-a' d='M64 0l64 128-64-20-64 20z' />
                  <path id='welcome-e' d='M40 0l40 80-40-12.5L0 80z' />
                  <path id='welcome-g' d='M40 0l40 80-40-12.5L0 80z' />
                  <linearGradient
                    x1='50%'
                    y1='0%'
                    x2='50%'
                    y2='100%'
                    id='welcome-b'
                  >
                    <stop stopColor='#5C6BC0' offset='0%' />
                    <stop stopColor='#475569' offset='100%' />
                  </linearGradient>
                  <linearGradient
                    x1='50%'
                    y1='24.537%'
                    x2='50%'
                    y2='100%'
                    id='welcome-c'
                  >
                    <stop stopColor='#94A3B8' offset='0%' />
                    <stop stopColor='#7986CB' stopOpacity='0' offset='100%' />
                  </linearGradient>
                </defs>
                <g fill='none' fillRule='evenodd'>
                  <g transform='rotate(64 36.592 105.604)'>
                    <mask id='welcome-d' fill='#fff'>
                      <use xlinkHref='#welcome-a' />
                    </mask>
                    <use fill='url(#welcome-b)' xlinkHref='#welcome-a' />
                    <path
                      fill='url(#welcome-c)'
                      mask='url(#welcome-d)'
                      d='M64-24h80v152H64z'
                    />
                  </g>
                  <g transform='rotate(-51 91.324 -105.372)'>
                    <mask id='welcome-f' fill='#fff'>
                      <use xlinkHref='#welcome-e' />
                    </mask>
                    <use fill='url(#welcome-b)' xlinkHref='#welcome-e' />
                    <path
                      fill='url(#welcome-c)'
                      mask='url(#welcome-f)'
                      d='M40.333-15.147h50v95h-50z'
                    />
                  </g>
                  <g transform='rotate(44 61.546 392.623)'>
                    <mask id='welcome-h' fill='#fff'>
                      <use xlinkHref='#welcome-g' />
                    </mask>
                    <use fill='url(#welcome-b)' xlinkHref='#welcome-g' />
                    <path
                      fill='url(#welcome-c)'
                      mask='url(#welcome-h)'
                      d='M40.333-15.147h50v95h-50z'
                    />
                  </g>
                </g>
              </svg>
            </div>

            {/* Content */}
            <div className='relative'>
              <h1 className='font-display text-2xl md:text-3xl text-brand-900 font-semibold mb-2 tracking-wide'>
                {new Date().getHours() > 12
                  ? 'Good Afternoon'
                  : new Date().getHours() > 21
                  ? 'Good Night'
                  : 'Good Morning'}
                , {loggedInUser?.displayName} <span className='wave'>👋</span>
              </h1>
              <p className='pt-2 font-body text-gray-800 w-full sm:w-7/12'>
                Welcome to your dashboard. Here you can manage your profile, add
                books to sell, buy books and see your orders. You can also see
                your profile and orders from the navigation bar.
              </p>
            </div>
          </div>
        </div>

        {/* Statics */}
        <section className='p-4 my-6 md:p-8 bg-indigo-50 text-gray-800'>
          <h2 className='font-display pb-2 tracking-normal text-xl sm:text-2xl mb-6 text-brand-800 text-center font-semibold'>
            Welcome to D-Book Shop (DIU Books Buy Sell Biggest Platform)
          </h2>
          <div className='container grid grid-cols-1 gap-6 m-4 mx-auto md:m-0 md:grid-cols-2 xl:grid-cols-3 font-body'>
            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <path d='M487.938,162.108l-224-128a16,16,0,0,0-15.876,0l-224,128a16,16,0,0,0,.382,28l224,120a16,16,0,0,0,15.112,0l224-120a16,16,0,0,0,.382-28ZM256,277.849,65.039,175.548,256,66.428l190.961,109.12Z'></path>
                  <path d='M263.711,394.02,480,275.061V238.539L256,361.74,32,238.539v36.522L248.289,394.02a16.005,16.005,0,0,0,15.422,0Z'></path>
                  <path d='M32,362.667,248.471,478.118a16,16,0,0,0,15.058,0L480,362.667V326.4L256,445.867,32,326.4Z'></path>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {allBooks?.length}+
                </p>
                <p className='font-body font-medium text-xl'>Books</p>
              </div>
            </div>

            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <path d='M462.541,316.3l-64.344-42.1,24.774-45.418A79.124,79.124,0,0,0,432.093,192V120A103.941,103.941,0,0,0,257.484,43.523L279.232,67a71.989,71.989,0,0,1,120.861,53v72a46.809,46.809,0,0,1-5.215,21.452L355.962,284.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421V432h-72v32h104V378.494A74.061,74.061,0,0,0,462.541,316.3Z'></path>
                  <path d='M318.541,348.3l-64.343-42.1,24.773-45.418A79.124,79.124,0,0,0,288.093,224V152A104.212,104.212,0,0,0,184.04,47.866C126.723,47.866,80.093,94.581,80.093,152v72a78,78,0,0,0,9.015,36.775l24.908,45.664L50.047,348.3A74.022,74.022,0,0,0,16.5,410.4L16,496H352.093V410.494A74.061,74.061,0,0,0,318.541,348.3ZM320.093,464H48.186l.31-53.506a42.158,42.158,0,0,1,19.073-35.421l88.682-58.029L117.2,245.452A46.838,46.838,0,0,1,112.093,224V152a72,72,0,1,1,144,0v72a46.809,46.809,0,0,1-5.215,21.452L211.962,316.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421Z'></path>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {user?.length}+
                </p>
                <p className='font-body font-medium text-xl'>Users</p>
              </div>
            </div>

            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <polygon points='328.375 384 332.073 458.999 256.211 406.28 179.924 459.049 183.625 384 151.586 384 146.064 496 182.756 496 256.169 445.22 329.242 496 365.936 496 360.414 384 328.375 384'></polygon>
                  <path d='M415.409,154.914l-2.194-48.054L372.7,80.933,346.768,40.414l-48.055-2.2L256,16.093,213.287,38.219l-48.055,2.2L139.3,80.933,98.785,106.86l-2.194,48.054L74.464,197.628l22.127,42.715,2.2,48.053L139.3,314.323l25.928,40.52,48.055,2.195L256,379.164l42.713-22.126,48.055-2.195,25.928-40.52L413.214,288.4l2.195-48.053,22.127-42.715Zm-31.646,76.949L382,270.377l-32.475,20.78-20.78,32.475-38.515,1.76L256,343.125l-34.234-17.733-38.515-1.76-20.78-32.475L130,270.377l-1.759-38.514L110.5,197.628,128.237,163.4,130,124.88,162.471,104.1l20.78-32.474,38.515-1.76L256,52.132l34.234,17.733,38.515,1.76,20.78,32.474L382,124.88l1.759,38.515L401.5,197.628Z'></path>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {userReview?.length}
                </p>
                <p className='font-body font-medium text-xl'>Reviews</p>
              </div>
            </div>

            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <path d='M256.25,16A240,240,0,0,0,88,84.977V16H56V144H184V112H106.287A208,208,0,0,1,256.25,48C370.8,48,464,141.2,464,255.75S370.8,463.5,256.25,463.5,48.5,370.3,48.5,255.75h-32A239.75,239.75,0,0,0,425.779,425.279,239.75,239.75,0,0,0,256.25,16Z'></path>
                  <polygon points='240 111.951 239.465 288 368 288 368 256 271.563 256 272 112.049 240 111.951'></polygon>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {orders?.length}
                </p>
                <p className='font-body font-medium text-xl'>Orders</p>
              </div>
            </div>

            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <path d='M415.313,358.7c36.453-36.452,55.906-85.231,54.779-137.353-1.112-51.375-21.964-99.908-58.715-136.66L388.75,107.314A166.816,166.816,0,0,1,438.1,222.039c.937,43.313-15.191,83.81-45.463,114.083l-48.617,49.051.044-89.165-32-.016L311.992,440H456.063V408H366.449Z'></path>
                  <path d='M47.937,112h89.614L88.687,161.3c-36.453,36.451-55.906,85.231-54.779,137.352a198.676,198.676,0,0,0,58.715,136.66l22.627-22.627A166.818,166.818,0,0,1,65.9,297.962c-.937-43.314,15.191-83.811,45.463-114.083l48.617-49.051-.044,89.165,32,.015L192.008,80H47.937Z'></path>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {userBooks?.length}
                </p>
                <p className='font-body font-medium text-xl'>Lists</p>
              </div>
            </div>

            <div className='flex overflow-hidden rounded-lg bg-indigo-100 text-gray-800'>
              <div className='flex items-center justify-center px-4 bg-indigo-600 text-indigo-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  fill='currentColor'
                  className='w-6 h-6 text-indigo-50'
                >
                  <path d='M416,180H320V340h96a20.023,20.023,0,0,0,20-20V200A20.023,20.023,0,0,0,416,180ZM404,308H352V212h52Z'></path>
                  <path d='M436.574,120H352V64H32V408a64.072,64.072,0,0,0,64,64H288a64.072,64.072,0,0,0,64-64v-8h84.574A59.493,59.493,0,0,0,496,340.574V179.426A59.493,59.493,0,0,0,436.574,120ZM464,340.574A27.457,27.457,0,0,1,436.574,368H320v40a32.036,32.036,0,0,1-32,32H96a32.036,32.036,0,0,1-32-32V96H320v56H436.574A27.457,27.457,0,0,1,464,179.426Z'></path>
                </svg>
              </div>
              <div className='flex items-center justify-around flex-1 p-3'>
                <p className='text-2xl font-semibold font-display'>
                  {userFavoriteBooks?.length}
                </p>
                <p className='font-body font-medium text-xl'>Favorites </p>
              </div>
            </div>
          </div>
        </section>

        {/* footer */}
        <footer>
          <div className='max-w-screen-lg xl:max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 text-indigo-500 pt-3'>
            <div className='pt-2 flex max-w-xs mx-auto items-center justify-between'>
              <a href='/'>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='text-xl hover:text-indigo-800  transition-colors duration-200'
                  viewBox='0 0 1792 1792'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z'></path>
                </svg>
              </a>

              <a href='/'>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='text-xl hover:text-indigo-800  transition-colors duration-200'
                  viewBox='0 0 1792 1792'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z'></path>
                </svg>
              </a>

              <a href='/'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='text-xl hover:text-indigo-800  transition-colors duration-200'
                  viewBox='0 0 1792 1792'
                >
                  <path d='M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z'></path>
                </svg>
              </a>

              <a href='/'>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='text-xl hover:text-indigo-800  transition-colors duration-200'
                  viewBox='0 0 1792 1792'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z'></path>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardHome;
