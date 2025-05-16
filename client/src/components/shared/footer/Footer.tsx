import React from 'react';
import NewsLetter from './NewsLetter';
import { Link, useNavigate } from 'react-router-dom';

// styles import
import {
  FaceBookBlue,
  InstagramIcon,
  LinkedinBlueIcon,
  TwitterBlue,
  YoutubeIcon,
} from '../../../icons';
import ArrowUpIcon from '../../../icons/ArrowUpIcon';
import useWindowSize from '../../../lib/hooks/useWindowSize';
import { footerLinks } from '../../../assets/data/footerLinks';
import styles from './footer.module.css';
import { paths } from '../../../routers/paths';

const Footer = () => {
  const { width } = useWindowSize();
  const navigate = useNavigate();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  return (
    <div className={styles.container}>
      <div className={styles.icons__wrapper}>
      <div className={styles.icon_header}>
          <h3>Follow Us</h3>
        </div>
        <div className={styles.left__icons}>
          <div className={styles.active_icon}>
            <FaceBookBlue />
          </div>
          <div className={styles.inactive_icon}>
            <InstagramIcon />
          </div>
          <div className={styles.inactive_icon}>
            <YoutubeIcon />
          </div>
          <div className={styles.inactive_icon}>
            <TwitterBlue />
          </div>
          <div className={styles.inactive_icon}>
            <LinkedinBlueIcon />
          </div>
        </div>
        <div className={styles.icon__right} onClick={() => window.scrollTo(0, 0)}>
          <ArrowUpIcon width={width < 700 ? '40' : '101'} />
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.linksWrapper}>
          <div
            style={{
              display: 'flex',
            }}
            className={styles.www}
          >
            <div className={styles.newsletter}>
              <NewsLetter />
            </div>
            <div className={styles.content__wrapper}>
              <h3>Help</h3>
              {footerLinks.resources.map((link) => (
                link.label === 'Contact Us' ? (
                  <a key={link.id} href="/" onClick={(e) => handleScroll(e, paths.CONTACT)}>
                    {link.label}
                  </a>
                ) : (
                  <div key={link.id} onClick={() => window.scrollTo(0, 0)}>
                    <Link to={link.path}>
                      {link.label}
                    </Link>
                  </div>
                )
              ))}
            </div>
          </div>
          <div className={styles.content__wrapper}>
            <h3>Company</h3>
            {footerLinks.company.map((link) => (
              link.label === 'Members' ? (
                <a key={link.id} href="/" onClick={(e) => handleScroll(e, paths.MembersSection)}>
                  {link.label}
                </a>
              ) : (
                <div key={link.id} onClick={() => window.scrollTo(0, 0)}>
                  <Link to={link.path}>
                    {link.label}
                  </Link>
                </div>
              )
            ))}
          </div>
          <div className={styles.content__wrapper}>
        
            <h3>Socials</h3>
            {footerLinks.socials.map((link) => (
              <div key={link.id} onClick={() => window.scrollTo(0, 0)}>
                <Link to={link.path} target={link.target}
                  rel={link.rel}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
          <div className={styles.newsletter2}>
              <NewsLetter />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
