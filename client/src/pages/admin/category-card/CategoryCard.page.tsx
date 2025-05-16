import React from 'react';
import styles from './category-card.module.css';
import defaultImage from '../../../assets/images/default_post_image.jpeg';

interface CategoryCardProps {
  name: string;
  image?: string;
  onAddBlog: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, onAddBlog, onEditCategory, onDeleteCategory }) => {
  return (
    <div className={styles.categoryCard}>
      <button className={styles.deleteButton} onClick={onDeleteCategory}>x</button>
      {image && <img
        src={image || defaultImage}
        crossOrigin='anonymous'
        alt={name}
        className={styles.categoryImage} />}
      <h3 className={styles.categoryName}>{name}</h3>
      <div className={styles.categoryActions}>
        <button onClick={onAddBlog} className={styles.categoryButton}>Add Blog</button>
        <button onClick={onEditCategory} className={styles.categoryButton}>Edit Category</button>
      </div>
    </div>
  );
};

export default CategoryCard;
