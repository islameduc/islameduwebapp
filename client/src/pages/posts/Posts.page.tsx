import { useEffect, useState } from 'react';
import NavBar from '../../components/shared/navbar/NavBar';
import styles from './posts.module.css';
import { Logo } from '../../assets/svg';
import Button from '../../components/admin/button/Button.component';
import Input from '../../components/admin/input/Input.component';
import TextArea from '../../components/admin/input/TextArea.component';
import FacebookIcon from '../../assets/svg/FacebookIcon';
import LinkedInIcon from '../../assets/svg/LinkedInIcon';
import InstagramIcon from '../../assets/svg/InstagramIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import DonateProjectCard from '../../components/donate-project-card/DonateProjectCard.component';
import cover from '../../assets/images/money.png';
import Dropdown from '../../components/admin/dropdown/Dropdown.component';
import BlogPosts from '../../components/shared/blog-posts/BlogPosts';
import { projectList } from '../../assets/data/projectList';
import { donationAmounts } from '../../assets/data/donationAmounts';
import { useAppDispatch, useAppSelector } from '../../store';
import { createDonation } from '../../store/features/slices/donations/donations.action';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getPostsAction } from '../../store/features/slices/posts/posts.action';
import { toast } from 'react-toastify';
import { emailRegex } from '../../lib/utils/regex';
import { subscribeToNewsletterAction } from '../../store/features/slices/contacts/contacts.action';
import TikTokIcon from '../../assets/svg/TikTokIcon';
import Footer from '../../components/shared/footer/Footer';
import Pagination from '../pagenation/Pagination';

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);

  const [posts, setPosts] = useState<any>([]);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [purpose, setPurpose] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [donatedBy, setDonatedBy] = useState<string>('');
  const [payerNumber, setPayerNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const { loading } = useAppSelector((state) => state.loader);

  const dispatch = useAppDispatch();

  const getAllPosts = () => {
    dispatch(getPostsAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedPosts = payload?.data;
        console.log(fetchedPosts);
        setPosts(fetchedPosts);
      }
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      <NavBar />
      <div style={{ paddingTop: '30px' }}>

        <div className={styles.container}>
          <BlogPosts posts={currentPosts} />
          <Pagination totalPosts={posts.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Posts;
