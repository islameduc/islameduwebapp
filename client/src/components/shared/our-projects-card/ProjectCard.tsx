import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import placeholder from '../../../assets/images/placeholer.png';

// styles import
import Button from '../../admin/button/Button.component';
import styles from './projectscard.module.css';
import ProfileStack from '../../admin/profile-stack/ProfileStack.component';
import { ArrowRightIcon } from '../../../assets/svg';


const moreText = (<span className={styles.more__container}>More <ArrowRightIcon /></span>);

type ProjectCardTypes = {
  img?: string;
  title?: string;
  description?: string;
  contributors?: any;
  style?: object;
  isSmallScreen?: boolean; // Adding isSmallScreen to the interface and making it optional
};

const ProjectCard: React.FC<ProjectCardTypes> = ({ img, title, description, contributors, style, isSmallScreen }) => {
  const navigate = useNavigate();
  
  // Truncates the description to the first 120 characters
  const truncatedDescription = description && description.length > 200 
    ? `${description.substring(0, 120)}...`
    : description;

  return (
    <div className={styles.img__container}>
      <img
        className={styles.cover_image}
        src={img ?? placeholder}
        alt='project image'
        style={{
          backgroundImage: `url(${img})`,
          /* opacity: img ? 1 : 0.5, */
          position: 'absolute',
          objectFit: 'cover',
          objectPosition: 'center',

          // Conditional Styling for a responsive view
          /* borderTopRightRadius: isSmallScreen ? '10px':'25px',
          borderTopLeftRadius: isSmallScreen ? '10px':'25px',
          borderBottomLeftRadius: isSmallScreen ? '10px':'0px',
          borderBottomRightRadius: isSmallScreen ? '10px':'0px',  
          height: isSmallScreen ? '220px' : '260px', 
          width: isSmallScreen ? '326px' : '220px', */
        }}
        crossOrigin='anonymous'
      />
      <div className={styles.overlay}></div>
      <div className={styles.img__wrapper}>
        <div className={styles.images}>
          {contributors?.length > 0 && <ProfileStack size={32} contributors={contributors} />}
        </div>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.project__description}>{truncatedDescription}</div>
      </div>
      <div className={styles.button}>
        <button className={styles.more} style={{
          color: '#fff',
          /* opacity: 1, */
          marginRight: '-70px',

        }}>{moreText}</button>
        <Button
          text='Learn more..'
          onClick={() => navigate('/')}
          bgColor='transparent'
          style={{
            alignSelf: 'right',
            margin: '0',
            padding: '0',
            visibility: isSmallScreen ? 'hidden' : 'visible'
          }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
