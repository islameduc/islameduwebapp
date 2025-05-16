import React, { useEffect, useState } from 'react';
import NavBar from '../../components/shared/navbar/NavBar';
import { ChevronIcon, FilterIcon } from '../../icons';
import Footer from '../../components/shared/footer/Footer';
import FilterDropdown from '../../components/shared/filter-dropdown/FilterDropdown';
import { useAppDispatch, useAppSelector } from '../../store';
import { getProjectsAction } from '../../store/features/slices/projects/projects.action';
import ProjectCard from '../../components/admin/project-card/ProjectCard';
import styles from './projects.module.css';
import NoData from '../../components/admin/no-data/NoData.component';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routers/paths';
import { getJWT, getLocalRole, getLocalUser } from '../../utils/localStorage';
import KanbanLoading from '../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../components/loaders/spinner/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    const updateTarget = (e: MediaQueryListEvent) => setTargetReached(e.matches);

    if (media.matches) {
      setTargetReached(true);
    }

    media.addEventListener('change', updateTarget);
    return () => media.removeEventListener('change', updateTarget);
  }, [width]);

  return targetReached;
};

const Projects = () => {
  const isSmallScreen = useMediaQuery(559);

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [chevronClicked, setChevronClicked] = useState(false);
  const [numberShown, setNumberShown] = useState(4); // Initially show 4 projects for small screens
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [projectList, setProjectList] = useState<any>([]);
  const localUser = getLocalUser();
  const userRole = getLocalRole();
  const jwt = getJWT();
  const role = userRole ?? localUser?.role ?? user?.user?.role;
  const token = jwt ?? localUser?.token ?? user?.accessToken;

  const getPublicProjects = () => {
    const data = { role: '', token: '' };
    setLoading(true);
    dispatch(getProjectsAction(data)).then((res: any) => {
      setProjectList(res.payload?.data || []);
      setLoading(false);
    });
  };

  const getAllProjects = () => {
    const data = { role, token };
    dispatch(getProjectsAction(data)).then((res: any) => {
      setProjectList(res.payload?.data || []);
    });
  };

  useEffect(() => {
    if ((role && role !== 'superAdmin' && role !== 'member') || localUser === null) {
      getPublicProjects();
    } else {
      getAllProjects();
    }
  }, []);

  const fetchMoreProjects = () => {
    if (numberShown < projectList.length) {
      setNumberShown(numberShown + 4); // Load 4 more projects when scrolling
    }
  };

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header__text}>
            <h1 className={styles.all__projects}>All Projects</h1>
            <p>Collective & Personal</p>
          </div>
          <span onClick={() => setShowFilter(!showFilter)} className={styles.icon}>
            <FilterIcon />
          </span>
          <span className={styles.filter__display}>
            {showFilter ? <FilterDropdown /> : ''}
          </span>
          <h3>Filter</h3> 
        </div>

        {isSmallScreen ? (
          <InfiniteScroll
            dataLength={numberShown}
            next={fetchMoreProjects}
            hasMore={numberShown < projectList.length}
            loader={<Spinner />}
          >
            <div className={styles.card__wrapper}>
              {projectList.length > 0 ? (
                projectList.slice(0, numberShown).map((project: any) => (
                  <ProjectCard
                    key={project?._id}
                    title={project?.title}
                    image={project?.projectImage?.httpPath}
                    contributors={project?.contributors}
                    percentage={project?.percentage}
                    date={project?.date}
                    fileNum={project?.attachments?.length}
                  />
                ))
              ) : (
                <NoData
                  infoText="No Projects Yet, Sign up, Get Approved, and go to Dashboard!"
                  onClick={() => navigate(paths.AUTH)}
                  text="Sign up"
                  height="50vh"
                />
              )}
            </div>
          </InfiniteScroll>
        ) : (
          <div className={styles.card__wrapper}>
            {projectList.length > 0 ? (
              projectList.map((project: any) => (
                <ProjectCard
                  key={project?._id}
                  title={project?.title}
                  image={project?.projectImage?.httpPath}
                  contributors={project?.contributors}
                  percentage={project?.percentage}
                  date={project?.date}
                  fileNum={project?.attachments?.length}
                />
              ))
            ) : (
              <NoData
                infoText="No Projects Yet, Sign up, Get Approved, and go to Dashboard!"
                onClick={() => navigate(paths.AUTH)}
                text="Sign up"
                height="50vh"
              />
            )}
          </div>
        )}

        {!isSmallScreen && (
          <div className={styles.see__all__projects}>
            <p>{numberShown === 6 ? 'See all Projects' : 'See less Projects'}</p>
            <span
              style={{ cursor: 'pointer', transition: '0.2s ease-in-out' }}
              onClick={() => {
                setChevronClicked(!chevronClicked);
                setNumberShown(numberShown === 6 ? projectList?.length : 6);
              }}
              className={chevronClicked && styles.chevron__down}
            >
              <ChevronIcon />
            </span>
          </div>
        )}

        <KanbanLoading kanbanLoading={loading}>
          <Spinner />
        </KanbanLoading>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
