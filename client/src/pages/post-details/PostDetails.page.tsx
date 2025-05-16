import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import 'react-phone-input-2/lib/style.css';
import { getPostDetailsAction, getPostsAction } from '../../store/features/slices/posts/posts.action';
import BlogPostCard from '../../components/shared/blog-post-card/BlogPostCard';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/shared/navbar/NavBar';
import Footer from '../../components/shared/footer/Footer';
import KanbanLoading from '../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../components/loaders/spinner/Spinner';
import styles from './post-details.module.css';
import Layout from '../../layouts/Layout';

const PostDetails = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { taskDetail, taskError } = useAppSelector((state) => state.tasks);
  const effectRef = useRef<boolean>(true);
  const dispatch = useAppDispatch();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string>('');
  const [post, setPost] = useState<any>([]);
  const [contributors, setContributors] = useState<any>([]);
  const [columnLoading, setColumnLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [kanbanLoading, setKanbanLoading] = useState<boolean>(false);
  const [shouldDelete, setShouldDelete] = useState<boolean>(false);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState<boolean>(false);
  const [taskDetailLoading, setTaskDetailsLoading] = useState<boolean>(false);
  const [updateTaskDetailLoading, setUpdateTaskDetailLoading] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>('');
  const [taskDeleteLoading, setTaskDeleteLoading] = useState<boolean>(false);
  const { id } = useParams();

  const postData = { id, token: user?.accessToken }; // general data for project

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      setKanbanLoading(true);
      getPostDetails();
    }
  }, [id]);

  const getPostDetails = () => {
    dispatch(getPostDetailsAction(postData)).then((res: any) => {
      setPost(res?.payload);
      setKanbanLoading(false);
    });
  };


  return (
    <Layout
      title={post?.title}
    >
      <div className={styles.container}>
        <BlogPostCard post={post} />
        <KanbanLoading kanbanLoading={kanbanLoading}>
          <Spinner size='20px' />
          {/* <Loader size='40px' /> */}
        </KanbanLoading>
      </div>
    </Layout>
  );
};

export default PostDetails;
