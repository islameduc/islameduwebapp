import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './blog-posts.module.css';
import defaultImage from '../../../assets/images/default_post_image.jpeg';
import { useAppSelector } from '../../../store';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  image?: {
    httpPath: string;
  };
}

interface Props {
  posts: BlogPost[];
}

const BlogPosts: React.FC<Props> = ({ posts }) => {
  const { user } = useAppSelector((state) => state.auth);

  // console.log(posts);
  const navigate = useNavigate();
  const handleViewPostDetails = (postId: string) => {
    window.scrollTo(0, 0)

    if (user?.accessToken) {
      navigate(`/admin/post-details/${postId}`);
    }
    else {
      navigate(`/pages/post-details/${postId}`);
    }
  };
  return (
    <div className={styles.blogPosts}>
      {posts &&
        posts.map((post) => (
          <div
            key={post._id}
            className={styles.blogPostcard}
            onClick={() => handleViewPostDetails(post._id)}
          >
            <img
              src={post.image?.httpPath || defaultImage}
              crossOrigin='anonymous'
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              alt={post.title}
              className={styles.blogPostImage}
            />
            <div className={styles.blogPostContent}>
              <h3 className={styles.blogPostTitle}>{post.title}</h3>
              <p className={styles.blogPostCategory}>{post.category}</p>
              {/* <p className={styles.blogPostDescription}>{post.content}</p> */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default BlogPosts;
