import React, { Fragment, useState } from 'react';
import { Dialog, Popover, Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import navigation from '../../data/navigation';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='bg-white'>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-40 lg:hidden' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 z-40 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
                <div className='flex px-4 pt-5 pb-2'>
                  <button
                    type='button'
                    className='-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
                    onClick={() => setOpen(false)}
                  >
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                <div className='space-y-6 border-t border-gray-200 py-6 px-4'>
                  {navigation.pages.map((page) => (
                    <div key={page.name} className='flow-root'>
                      <Link
                        to={page.href}
                        className='-m-2 block p-2 font-medium text-gray-900'
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className='space-y-6 border-t border-gray-200 py-6 px-4'>
                  <div className='flow-root'>
                    <Link
                      to='/login'
                      className='-m-2 block p-2 font-medium text-gray-900'
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className='flow-root'>
                    <Link
                      to='/signup'
                      className='-m-2 block p-2 font-medium text-gray-900'
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div>
        {/* Top navigation */}
        <nav
          aria-label='Top'
          className='relative z-20 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter'
        >
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center'>
              <button
                type='button'
                className='rounded-md bg-white p-2 text-gray-400 lg:hidden'
                onClick={() => setOpen(true)}
              >
                <span className='sr-only'>Open menu</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>

              {/* Logo */}
              <div className='ml-4 flex lg:ml-0'>
                <Link to='/'>
                  <span className='sr-only'>Your Company</span>
                  <img
                    className='h-8 w-auto'
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                    alt=''
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className='hidden lg:ml-8 lg:block lg:self-stretch'>
                <div className='flex h-full space-x-8'>
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-800'
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </Popover.Group>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  <Link
                    to='/login'
                    className='text-sm font-medium text-gray-700 hover:text-gray-800'
                  >
                    Sign in
                  </Link>
                  <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                  <Link
                    to='/signup'
                    className='text-sm font-medium text-gray-700 hover:text-gray-800'
                  >
                    Create account
                  </Link>
                </div>

                {/* Search */}
                <div className='flex lg:ml-6'>
                  <a href='#' className='p-2 text-gray-400 hover:text-gray-500'>
                    <span className='sr-only'>Search</span>
                    <MagnifyingGlassIcon
                      className='h-6 w-6'
                      aria-hidden='true'
                    />
                  </a>
                </div>

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-3'>
                  <div>
                    <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50'>
                      <img
                        className='h-8 w-8 rounded-full'
                        src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        alt=''
                      />
                      <span className='ml-3 hidden text-sm font-medium text-gray-700 lg:block'>
                        <span className='sr-only'>Open user menu for </span>
                        Emilia Birch
                      </span>
                      <ChevronDownIcon
                        className='ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block'
                        aria-hidden='true'
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/profile'
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/listing'
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Listing
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/'
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Logout
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
