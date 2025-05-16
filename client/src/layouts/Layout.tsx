import React from 'react';
import Sidebar from '../components/admin/sidebar/Sidebar';
import { LayoutTypes } from './Layout.type';
import { useAppSelector } from '../store';
import profileClass from '../components/admin/profiles/Profiles.module.css';
import Button from '../components/admin/button/Button.component';
import classes from './Layout.module.css';
import placeholder from '../assets/images/placeholer.png';
import ProfileStack from '../components/admin/profile-stack/ProfileStack.component';
import { ArrowLeftIcon } from '../assets/svg';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/shared/navbar/NavBar';
import Footer from '../components/shared/footer/Footer';

const Layout = ({
  children,
  title,
  showBack = true,
  size = '26px',
}: LayoutTypes) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <div className={classes.headerBack} onClick={() => (showBack ? navigate(-1) : null)} style={{ paddingTop: '80px', marginLeft: '50px' }}>
        {showBack && <ArrowLeftIcon />}
        {title && <h2 className={classes.title}>{title}</h2>}
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
