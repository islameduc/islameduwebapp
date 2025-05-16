import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Arrow from '../../../icons/Arrow';

import Logo from '../../../icons/Logo';
import { UseScrollPosition } from '../../../lib/hooks/ScrollView';
import { navlinks, paths } from '../../../routers/paths';
// import Button from '../button/Button';

import { useAppDispatch, useAppSelector } from '../../../store';
import Avatar from '../../admin/avatar/Avatar.component';
import placeholder from '../../../assets/images/placeholer.png';
import styles from './navbar.module.css';
import Button from '../../admin/button/Button.component';
import { ArrowRightIcon, ChevronRightIcon } from '../../../assets/svg';
import { persistor } from '../../..';
import { toast } from 'react-toastify';
import MobileMenu from '../../block/home/mobile-menu/MobileMenu';
// import './modern.css';
// import './navbar.module.css'; // Import the correct CSS file

const NavBar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);

  const ref = useRef(toast);
  const pos = UseScrollPosition();
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate(paths.AUTH);
  };
  const handleDashboardNavigate = () => {
    if (user?.user?.isMember === false) {
      ref.current.warning('Not a Member 🚫, Get Approved by Admin first');

      // todo: run check to get fresh token
      return;
    }
    navigate(paths.ADMIN.DASHBOARD);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className='bg-white border-gray-200 '>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-10 md:mx-auto p-4'>
        <Link to='/'>
          <Logo width={'50'} height={'50'} />
        </Link>
        <div className='inline-flex items-center p-2 w-30 h-30 justify-center items-center text-lg text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'>
          <MobileMenu />
        </div>

        <div
          className='hidden w-full  md:w-auto md:flex flex-row flex-no-wrap lg:flex-wrap items-center'
          id='navbar-default'
        >
          <ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
            {navlinks.map((link, mn) => {
              return (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.nav_links} ${styles.activeLink}` : `${styles.nav_links}`
                  }
                  key={link.path}
                  to={link.path}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </ul>

          <div>
            {user?.accessToken ? (
              <div className={styles.user__profile}>
                <Avatar
                  size='32px'
                  src={profile?.profileImage?.httpPath ?? placeholder}
                  onClick={handleDashboardNavigate}
                  border='1px solid #005259'
                />
              </div>
            ) : (
              <div className='flex flex-row'>
                <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
                  <Button
                    text='Join Our Community'
                    style={{ marginRight: '15px', border: '1px solid #005259' }}
                    renderIcon={() => (
                      <ArrowRightIcon style={{ width: '14', height: '12', marginLeft: '5px' }} />
                    )}
                    iconAfter
                    padding='13px 20px'
                  />
                </Link>
                <Button
                  text='Sign In'
                  onClick={handleAuth}
                  padding='13px 20px'
                  style={{ border: '1px solid #005259' }}
                  bgColor='transparent'
                  color='#005259'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    // <div className={`${styles.main__container} ${pos > 100 ? styles.shadow : ''}`}>
    //   <div>
    //     <Link to='/'>
    //       <Logo width={'40'} height={'40'} />
    //     </Link>
    //   </div>
    //   <div className={styles.nav__content}>
    //     <div className={styles.navlinks}>
    // {navlinks.map((link) => (
    //         <NavLink
    //           className={({ isActive }) =>
    //             isActive ? `${styles.nav_links} ${styles.activeLink}` : `${styles.nav_links}`
    //           }
    //           key={link.path}
    //           to={link.path}
    //         >
    //           {link.label}
    //         </NavLink>
    //       ))}
    //     </div>
    // {user?.accessToken ? (
    //   <div className={styles.user__profile}>
    //     <Avatar
    //       size='32px'
    //       src={profile?.profileImage?.httpPath ?? placeholder}
    //       onClick={handleDashboardNavigate}
    //       border='1px solid #005259'
    //     />
    //   </div>
    // ) : (
    //   <>
    //     <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
    //       <Button
    //         text='Join Our Community'
    //         style={{ marginRight: '15px', border: '1px solid #005259' }}
    //         renderIcon={() => (
    //           <ArrowRightIcon style={{ width: '14', height: '12', marginLeft: '5px' }} />
    //         )}
    //         iconAfter
    //         padding='13px 20px'
    //       />
    //     </Link>
    //     <Button
    //       text='Sign In'
    //       onClick={handleAuth}
    //       padding='13px 20px'
    //       style={{ border: '1px solid #005259' }}
    //       bgColor='transparent'
    //       color='#005259'
    //     />
    //   </>
    // )}
    //   </div>
    // </div>
  );
};

export default NavBar;
