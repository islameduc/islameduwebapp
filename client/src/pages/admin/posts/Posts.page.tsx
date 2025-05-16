import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminHeader from '../../../components/admin/admin-header/AdminHeader';
import ProjectCard from '../../../components/admin/project-card/ProjectCard';
import AdminLayout from '../../../layouts/Admin.layout';
import AdminSection from '../../../components/admin/admin-section/AdminSection.component';
import styles from './posts.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getProjectsAction,
  toggleProjectVisibilityAction,
} from '../../../store/features/slices/projects/projects.action';
import { contributors } from '../../../assets/data/contributors';
import Button from '../../../components/admin/button/Button.component';
import { paths } from '../../../routers/paths';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import NoData from '../../../components/admin/no-data/NoData.component';
import { getPostsAction } from '../../../store/features/slices/posts/posts.action';
import BlogPosts from '../../../components/shared/blog-posts/BlogPosts';
import Pagination from '../../pagenation/Pagination';

const Posts = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<any>([]);
  const { projectError, projects } = useAppSelector((state) => state.projects);
  const [value, setValue] = useState<string>('');
  const [allProjectsDashboard, setAllDashboardProjects] = useState<any>(projects?.data);
  const effectRef = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleLoading, setVisibleLoading] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);

  const getAllProjects = () => {
    const data = {
      role: user?.user?.role,
      token: user?.accessToken,
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      if (projectError) {
        setLoading(false);
        return toast.error(projectError);
      }
      const { payload } = res;
      setAllDashboardProjects(payload?.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      setLoading(true);
      getAllProjects();
    }
  }, []);

  useEffect(() => {
    if (value) {
      const filtered = allProjectsDashboard?.filter((project: any) =>
        project?.title?.toLowerCase().includes(value.toLowerCase()),
      );
      setAllDashboardProjects(filtered);
    } else {
      getAllProjects();
    }
  }, [value]);

  const handleMakeVisible = (projectId: string) => {
    if (user?.user?.role !== 'superAdmin')
      return toast.error('You are not authorized to change project visibility');
    setVisibleLoading(projectId);
    const data = {
      id: projectId,
      token: user?.accessToken,
    };
    const projectData = {
      role: user?.user?.role,
      token: user?.accessToken,
    };
    dispatch(toggleProjectVisibilityAction(data)).then(() => {
      dispatch(getProjectsAction(projectData)).then((res: any) => {
        const { payload } = res;
        setAllDashboardProjects(payload?.data);
        setLoading(false);
        toast.success('Project Visibility Changed!');
        setVisibleLoading('');
      });
    });
  };

  const handleAddNavigate = () => {
    if (user?.user?.role !== 'superAdmin')
      return toast.error('You are not authorized to add a post');
    navigate(paths.ADMIN.ADD_POST);
  };

  const handleViewProjectDetails = (projectId: string) => {
    navigate(`/admin/details/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/admin/edit/${projectId}`);
  };

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
    <AdminLayout
      title='I.P.E.S Posts'
      contributors={allProjectsDashboard?.contributors}
      searchValue={value}
      onChange={(e) => setValue(e.target.value)}
      showBack={false}
      onClick={handleAddNavigate}
      actionText='Add New Post'
    >
      <div>
        {posts?.length > 0 ? (<>
          <BlogPosts posts={currentPosts} />
          <Pagination totalPosts={posts.length} postsPerPage= {postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
</>
        ) : (
          <NoData
            infoText='No Posts Yet'
            onClick={() => navigate(paths.ADMIN.ADD_POST)}
            text='Add New Post'
          />
        )}
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='18px' />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Posts;
