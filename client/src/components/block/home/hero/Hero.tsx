import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../../../../assets/svg';
import Logo from '../../../../icons/Logo';
import { flag } from '../../../../static/assets/images';
import hero from '../../../../static/assets/images/RT/monument.jpeg';
import Button from '../../../admin/button/Button.component';
import styles from './hero.module.css';

interface IProps {
  logoImage?: string;
  logoBgColor?: string;
  heroImage?: string;
  buttonColor?: string | any;
  headingWidth?: string;
}

const Hero = ({ logoBgColor = '', headingWidth }: IProps) => {
  // State to determine screen width
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 583);

  // Function to update the state based on window width
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 583);
  };

  // Add an event listener to handle window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Conditional button styles
  const buttonStyle = {
    marginRight: '15px',
    padding: '13px 20px',
    backgroundColor: isSmallScreen ? 'transparent' : '#003B33',
    color: '#FFFFFF',
    fontSize: '1em',
    border: isSmallScreen ? '2px solid #fff' : 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const iconStyle = {
    width: '14px',
    height: '12px',
    marginLeft: '5px',
  };

  return (
    <div
      className={styles.hero__container}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 38, 42,0.8), rgba(0, 38, 42,0.8)), url(${hero})`,
      }}
    >
      <div className={styles.logo} style={{ backgroundColor: logoBgColor }}>
        <Logo width='100%' height='100%' />
      </div>
      <h1 className={styles.hero__heading} style={{ width: headingWidth ?? '40%' }}>
        Welcome to I.P.E.S
      </h1>
      <p className={styles.hero__p}>
        The Islamic Private Education Secretariat with accronyn as (IPES) works to promote the
        rights to education of Muslim girls who have been relegated, internally displaced persons
        (IDPS) who are out of School and the economic empowerment of women and Minority groups.
      </p>
      <div className={styles.flag}>
        <img src={flag} alt='Flag' crossOrigin='anonymous' />
      </div>
      <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
        <Button
          text='Join Our Community'
          style={buttonStyle}
          renderIcon={() => (
            <ArrowRightIcon style={iconStyle} />
          )}
          iconAfter
        />
      </Link>
    </div>
  );
};

export default Hero;
