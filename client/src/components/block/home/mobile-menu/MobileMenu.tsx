import React, { useState } from 'react';
import './mobilemenu.css'; // Fixed import path to match the correct CSS file
import { Link } from 'react-router-dom';
import { Logo } from '../../../../assets/svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faDoorOpen,
  faEnvelope,
  faHamburger,
  faHome,
  faIdBadge,
  faShare,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
const menus = [
  {
    id: 1,
    title: 'Home',
    link: '/',
    icon: faHome,
  },
  {
    id: 2,
    title: 'Projects',
    link: '/projects',
    icon: faShare,
  },
  {
    id: 3,
    title: 'Members',
    link: '/members',
    icon: faIdBadge,
  },
  {
    id: 4, // Fixed id value to be unique
    title: 'Community', // Fixed title value to be unique
    link: '/auth?tab=signup',
    icon: faUsers,
  },
];

const MobileMenu = () => {
  const [menuActive, setMenuState] = useState(false);

  //   const scrollToSection = (sectionId: string) => {
  //     const element = document.getElementById(sectionId);
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   };

  return (
    <div>
      <div className={`mobileMenu ${menuActive ? 'show' : ''} px-10 flex flex-col space-y-20`}>
        <div className='flex flex-row justify-between mx-15 '>
          <div className='rounded p-0 bg-gray-200 overflow-hidden'>
            <Link to='/'>
              <Logo size='30' />
            </Link>
          </div>
          <div
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
            onClick={() => setMenuState(!menuActive)}
          >
            <FontAwesomeIcon icon={faTimes} size='3x' />
          </div>
        </div>

        <div className='flex flex-col mt-20 justify-between'>
          <ul className='flex flex-col space-y-10 mt-20'>
            {menus.map((item, mn) => {
              return (
                <Link
                  to={item.link}
                  key={mn}
                  className='flex flex-row space-x-5 hover:cursor-pointer'
                >
                  <div className='flex items-center '>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <a className='font-bold text-xl'>{item.title}</a>
                </Link>
              );
            })}
          </ul>
        </div>

        <div className=''>
          <div className='flex flex-row space-x-5 hover:cursor-pointer'>
            <FontAwesomeIcon icon={faDoorOpen} size='2x' />
            <a className='font-bold text-xl'>Logout</a>
          </div>
        </div>
      </div>

      <div className='showmenu' onClick={() => setMenuState(!menuActive)}>
        <button type='button' className='navbar-toggler open-btn mt-2'>
          <FontAwesomeIcon icon={faBars} size='2x' />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
