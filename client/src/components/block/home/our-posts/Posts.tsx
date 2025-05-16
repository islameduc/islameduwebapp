import React, { useEffect, useState } from 'react';
import ProjectCard from '../../../shared/our-projects-card/ProjectCard';
import SectionTitle from '../../../shared/section-title/SectionTitle';
import BlogPosts from '../../../shared/blog-posts/BlogPosts';
import { getPostsAction } from '../../../../store/features/slices/posts/posts.action';

// styles import
import { useAppDispatch, useAppSelector } from '../../../../store';
import { getProjectsAction } from '../../../../store/features/slices/projects/projects.action';
import styles from './posts.module.css';
import { getPartnersAction } from '../../../../store/features/slices/contacts/contacts.action';
import { getJWT, getLocalRole, getLocalUser } from '../../../../utils/localStorage';
import { partnersData } from '../../../../assets/data/partners';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../../assets/svg';
import { paths } from '../../../../routers/paths';
import { endpoint } from '../../../../api/config';

const Posts = () => {
  const [posts, setPosts] = useState<any>([]);
  const { partners } = useAppSelector((state) => state.contacts);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [projectList, setProjectList] = useState([]);
  const [donations, setDonations] = useState(0);
  const localUser = getLocalUser();
  const userRole = getLocalRole();
  const jwt = getJWT();
  const role = userRole ?? localUser?.role ?? user?.user?.role;
  const token = jwt ?? localUser?.token ?? user?.accessToken;
  const navigate = useNavigate();

  const getAllPosts = () => {
    dispatch(getPostsAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedPosts = payload?.data;
        console.log(fetchedPosts);
        setPosts(fetchedPosts.slice(0, 3));
      }
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(endpoint + '/donations/balance');
        const result = await response.json();
        setDonations(result.balance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchDonations();

    // Fetch data every minute
    const intervalId = setInterval(fetchDonations, 60000); // 60000 milliseconds = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <SectionTitle title='Our Posts' height='80px' />
      <div className={styles.wrapper}>
        <BlogPosts posts={posts} />
      </div>
      <div onClick={() => window.scrollTo(0, 0)}>
        <div className={styles.link}>
          <Button
            text='View All Posts'
            width='18%'
            margin='3rem 0 0'
            bgColor='#fff'
            color='#003136'
            iconAfter
            onClick={() => navigate(paths.POSTS)}
            padding='0px 12px 12px 12px'
            borderRadius='60px'
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;
