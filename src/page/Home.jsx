import React from 'react';
import Category from '../components/Home/Category';
import Delivery from '../components/Home/Delivery';
import Featured from '../components/Home/Featured';
import Hero from '../components/Home/Hero';
import Testimonials from '../components/Home/Testimonials';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';

const Home = () => {
  return (
    <>
      <heder className='relative overflow-hidden'>
        <Navbar />
        <Hero />
      </heder>
      <main>
        <Category />
        <div className='relative overflow-hidden'>
          {/* Decorative background image and gradient */}
          <div aria-hidden='true' className='absolute inset-0'>
            <div className='absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8'>
              <img
                src='https://i.ibb.co/pv3SbtK/144617968-10158266113482203-6061941687031999879-o.webp'
                alt=''
                className='h-full w-full object-cover object-center'
              />
            </div>
            <div className='absolute inset-0 bg-white bg-opacity-75' />
            <div className='absolute inset-0 bg-gradient-to-t from-white via-white' />
          </div>
          <Featured />
          <Testimonials />
        </div>
        <Delivery />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Home;
