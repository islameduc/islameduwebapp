import React, { useEffect, useState } from 'react';
import { LargeMailIcon, LocationIcon, PhoneIcon } from '../../../../icons';
import SectionTitle from '../../../shared/section-title/SectionTitle';
import ContactForm from '../contact-form/ContactForm';
import MapContainer from './MapContainer';
import styles from './contactlocation.module.css';
import Button from '../../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../../assets/svg';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../routers/paths';

const ContactLocation = () => {
  const navigate = useNavigate();  
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  
  return (
    <div>
      <section id={paths.CONTACT}> 
        <SectionTitle title='Contact/Location' height='80px' customStyles={{background: 'white'}} titlestyles={{ color: ' #003136'}}  />
        <p className={styles.contact__description}>
          Reach out to us for any enquiries
        </p>
        <div className={styles.contact__location__wrapper}>
          <div className={styles.contact__location}>
            <div className={styles.contact__form}>
              <ContactForm />
            </div>
            <div>
              <MapContainer />
            </div>
          </div>
          <div className={styles.icons}>
            <div className={styles.icon__detailes}>
              <div>
                <LocationIcon />
              </div>
              <div>
                <h2>Location</h2>
                <p>Bongo Square beside Regional Delegation of Agriculture</p>
              </div>
            </div>
            <div className={styles.icon__detailes}>
              <div>
                <LargeMailIcon />
              </div>
              <div>
                <h2>Email:</h2>
                <p>Islameducsec@gmail.com</p>
                <p>hamzanash@yahoo.com</p>
              </div>
            </div>
            <div className={styles.icon__detailes}>
              <div>
                <PhoneIcon />
              </div>
              <div>
                <h2>Phone</h2>
                <p>+237 677 361 731</p>
                <p>+237 655 849 365</p>
                <p>+237 654 702 441</p>
              </div>
            </div>
            <div className={styles.contact__form2}>
              <ContactForm />
            </div>
          </div>
            <Button
              text='Donate Now!'
              width='170px'
              margin='3rem 0 0'
              bgColor='#003136'
              color='#fff'
              iconAfter
              renderIcon={() => <ArrowRightIcon color='#fff' style={{ marginLeft: '4px' }} />}
              onClick={() => navigate(paths.DONATIONS)}
              padding='13px'
              borderRadius='60px'
            />
        </div>
      </section>
    </div>
  );
};

export default ContactLocation;
