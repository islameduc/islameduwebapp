import React from 'react';
import styles from './blog-post-card.module.css';
import defaultImage from '../../../assets/images/default_post_image.jpeg'

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    _id: string;
  };
  image: {
    httpPath: string;
  };
  numberOfViews: number;
  createdAt: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className={styles.postContainer}>
      <h1 className={styles.title}>{post?.title}</h1>
      <h2 className={styles.category}>Category: {post?.category}</h2>
      {post?.image && <img src={post.image?.httpPath || defaultImage} alt={post.title} className={styles.image} crossOrigin='anonymous' />}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
    </div>
  );
};

export default BlogPostCard;
