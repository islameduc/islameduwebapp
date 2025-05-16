import React, { useEffect, useState } from 'react';

// styles import
import styles from './sectiontitle.module.css';

type PropsType = {
  title: string;
  height: string;
  customStyles?: React.CSSProperties;
  titlestyles?: React.CSSProperties;
};

const SectionTitle: React.FC<PropsType> = ({ title, height, customStyles, titlestyles }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize); // Check on window resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        background: '#003136',
        height,
        ...(isMobile ? customStyles : {}),
      }}
      className={styles.container}
    >
      <h1 className={styles.headline} style={isMobile ? titlestyles : {}}>
        {title}
      </h1>
    </div>
  );
};

export default SectionTitle;
