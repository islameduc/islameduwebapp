import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store'
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosConfig';
import { backendUrls } from '../../../../api/urls';
import { footerLinks } from '../../../../assets/data/footerLinks'
import { Link } from 'react-router-dom'
import Footer from '../../../shared/footer/Footer'
import NavBar from '../../../shared/navbar/NavBar'
import styles from './about-us.module.css'

interface Detail {
  _id: string;
  title: string;
  content: string;
  author: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getDetailsAction = createAsyncThunk('details/get-details', async (args, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await axiosInstance.get(backendUrls.users.ABOUT_US);
    return res?.data?.result;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue(error);
    }
  }
});

const AboutUs = () => {

  const [details, setDetails] = useState<Detail[]>([])

  const dispatch = useAppDispatch();

  const fetchDetails = () => {
    dispatch(getDetailsAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedDetails = payload;
        console.log(fetchedDetails);
        setDetails(fetchedDetails)
      }
    });
  };

  const getDetailByTitle = (title: string) => {
    return details.find(detail => detail.title === title);
  };

  useEffect(() => {
    fetchDetails();
  }, []);


  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>About Us</h1>
        </header>

        <section className={styles.whoWeAre}>
          <h2>Who We Are</h2>
          <div dangerouslySetInnerHTML={{ __html: getDetailByTitle('whoWeAre')?.content || '' }} />
        </section>

        <section className={styles.vision}>
          <h2>Vision</h2>
          <div dangerouslySetInnerHTML={{ __html: getDetailByTitle('vision')?.content || '' }} />
        </section>

        <section className={styles.mission}>
          <h2>Mission</h2>
          <div dangerouslySetInnerHTML={{ __html: getDetailByTitle('mission')?.content || '' }} />
        </section>

        <section className={styles.whatWeDo}>
          <h2>What We Do</h2>
          <div dangerouslySetInnerHTML={{ __html: getDetailByTitle('whatWeDo')?.content || '' }} />
        </section>
      </div>
      <Footer />
    </div>
  )
}
export default AboutUs