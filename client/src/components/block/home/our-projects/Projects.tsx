import React, { useEffect, useState, useRef } from 'react';
import ProjectCard from '../../../shared/our-projects-card/ProjectCard';
import SectionTitle from '../../../shared/section-title/SectionTitle';

// styles import
import { useAppDispatch, useAppSelector } from '../../../../store';
import { getProjectsAction } from '../../../../store/features/slices/projects/projects.action';
import styles from './projects.module.css';
import { getPartnersAction } from '../../../../store/features/slices/contacts/contacts.action';
import { getJWT, getLocalRole, getLocalUser } from '../../../../utils/localStorage';
import { partnersData } from '../../../../assets/data/partners';
import { useNavigate } from 'react-router-dom';
import Button from '../../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../../assets/svg';
import { paths } from '../../../../routers/paths';
import { endpoint } from '../../../../api/config';

// Define the Project interface
interface Project {
  _id: string;
  title: string;
  description: string;
  contributors: string[];
  ongoing: boolean;
  projectImage: {
    httpPath: string;
  };
}

const Projects = () => {
  const { partners } = useAppSelector((state) => state.contacts);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [projectList, setProjectList] = useState<Project[]>([]);
  const [donations, setDonations] = useState(0);
  const localUser = getLocalUser();
  const userRole = getLocalRole();
  const jwt = getJWT();
  const role = userRole ?? localUser?.role ?? user?.user?.role;
  const token = jwt ?? localUser?.token ?? user?.accessToken;
  const navigate = useNavigate();

  // const [showAllCards, setShowAllCards] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);

  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 450);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* const handleSeeAll = () => {
    setIsSmallScreen(true);
  }; */


  const handleIsSmallScreen = () => {
    setIsSmallScreen(true);
  }; //
   const seeAllText = (<span className ={styles.see_all_container}>See All <ArrowRightIcon color='#fff' /></span>)

  const getPublicProjects = () => {
    const data = {
      role: '',
      token: '',
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      const { payload } = res;
      console.log(res);
      setProjectList(payload?.data);
    });
  };

  const getAllProjects = () => {
    const data = {
      role,
      token,
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      if (res.payload.data) {
        const copiedData: any = [...res.payload.data];
        setProjectList(copiedData);
      }
      return;
    });
  };

  useEffect(() => {
    if (role !== 'superAdmin' || !user?.user?.isMember) {
      getPublicProjects();
    } else {
      getAllProjects();
    }
    dispatch(getPartnersAction());
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
    <div className={styles.projects_container}>
      <span className={styles.section_title}><SectionTitle title='Our Projects' height='80px' /></span>
      <div className={styles.mobile_headline}>Ongoing Projects</div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.partners}>
            <h3>Partners</h3>
            {partners?.data > 0 ? (
              <div className={styles.logos}>
                {partners?.data.map((item: any) => (
                  <img
                    key={item.id}
                    alt='pic'
                    src={item.image}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.logos} style={{ display: 'flex' }}>
                {partnersData.map((item) => (
                  <img
                    key={item.id}
                    alt='pic'
                    id='link'
                    src={item.logo}
                    onClick={() => window?.open(item.url, '_blank')}
                    style={{ margin: '-12px' }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.headline}>
            <h3>Ongoing Projects</h3>
          </div>

          <div className={styles.content__wrapper} ref={contentWrapperRef}>
            {projectList
              ?.slice(0, isSmallScreen ? 3 : projectList.length)
              ?.map(
                (project) =>
                  project?.ongoing && (
                    <ProjectCard
                      key={project._id}
                      img={project.projectImage?.httpPath}
                      description={project.description}
                      title={project.title}
                      contributors={project?.contributors}
                      isSmallScreen={isSmallScreen} // Passing isSmallScreen prop to ProjectCard
                      style={ // Conditionally applying style to ProjectCard
                        isSmallScreen
                          ? { marginBottom: '10px', flex: '0 0 auto', position: 'relative',/* width: '326px', height: '220px' */ }
                          : { marginBottom: '10px', flex: '0 0 auto', position: 'relative' } // Default style
                      }
                      // style={ // Conditionally applying style to ProjectCard
                    //   isSmallScreen
                    //     ? { marginBottom: '10px', flex: '0 0 auto', position: 'relative', width: 'auto', height: '220px' }
                    //     : { marginBottom: '10px', flex: '0 0 auto', position: 'relative' } // Default style
                    // }
                      />
                  ),
              )}
            {isSmallScreen && (
              <button className={styles.see_all_button} onClick={handleIsSmallScreen}>
                {seeAllText}
              </button>
            )}
          </div>

          <div className={styles.donations__wrapper}>
            <button
              className={styles.donate_button}
              onClick={() => navigate(paths.DONATIONS)}
            >
              Donate Now!<ArrowRightIcon color='#003136' />
            </button>

            <div className={styles.donations__text_div}>
              <h1>Donations:</h1>
              <h2>{donations} FCFA</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
