import React, { useState, useEffect } from 'react';
import CustomInputField from '../auth/input/CustomInput';
import Button from '../button/Button';

// Import action and other utility functions
import { subscribeToNewsletterAction } from '../../../store/features/slices/contacts/contacts.action';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../store';
import { emailRegex } from '../../../lib/utils/regex';
import styles from './news-letter.module.css';

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);

  const handleSubscription = async () => {
    const validateEmail = emailRegex.test(email.trim());
    if (validateEmail) {
      try {
        const res = await dispatch(subscribeToNewsletterAction(email));
        toast.success(res?.payload?.message || 'Subscription successful');
        setEmail('');
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message || 'Subscription failed');
        } else {
          toast.error('Subscription failed');
        }
      }
    } else {
      setError('Invalid Email Address');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Subscribe to our Newsletter</h1>
      <div className={styles.input__wrapper}>
        <CustomInputField
          border='2px solid #00262A'
          height= ' 36px'
          placeholder='Enter your Email'
          containsBorder={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
      </div>
      <Button
        btnText='Submit'
        className={styles.btn}
        onClick={handleSubscription}
        loading={loading}
      />
     
    </div>
  );
};

export default NewsLetter;
