import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../../layouts/Admin.layout';
import { useAppDispatch, useAppSelector } from '../../../store';
import { paths } from '../../../routers/paths';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostDetailsAction } from '../../../store/features/slices/posts/posts.action';
import { getCategoriesAction } from '../../../store/features/slices/categories/categories.action';
import BlogPostCard from '../../../components/shared/blog-post-card/BlogPostCard';
import UpdatePostModal from '../../../components/admin/update-post-modal/UpdatePostModal';
import { backendUrls } from '../../../api/urls';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import DeleteModal from '../../../components/admin/delete-modal/DeleteModal.component';

const PostDetails = () => {
  const { user } = useAppSelector((state) => state.auth);
  const effectRef = useRef<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [kanbanLoading, setKanbanLoading] = useState<boolean>(false);
  const [shouldDelete, setShouldDelete] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [preview, setPreview] = useState<string | null>('');
  const [categoryId, setCategoryId] = useState<string>('');
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
      if (res?.payload) {
        const tempPost = res?.payload
        setPost(tempPost);
        setTitle(tempPost.title)
        setContent(tempPost.content)
        setPreview(tempPost.image ? tempPost.image.httpPath : null)
        setCategoryId(tempPost.categoryId)
      }

      setKanbanLoading(false);
    });
  };

  const getAllCategories = () => {
    dispatch(getCategoriesAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        setAllCategories(payload);
      }
    });
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(backendUrls.posts.DELETE_POST(id as string), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        },
      });

      if (response.ok) {
        toast.success('Post deleted successfully')
        navigate(paths.ADMIN.POSTS);
      } else {
        toast.error('Post deletion unsuccessful')
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    toast.success('Post updated successfully')
    getPostDetails()
  };

  return (
    <AdminLayout
      title={post?.title}
      padding='50px 20px 0'
      actionText='Edit Post'
      onClick={handleOpenAddModal}
      onDeleteProject={handleDeletePost}
      deleteText='Delete Post'
      showDelete
    >
      <BlogPostCard post={post} />
      <UpdatePostModal
        postId={id as string}
        postTitle={title}
        postContent={content}
        postImagePreview={preview}
        postCategoryId={categoryId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        token={user?.accessToken}
        categories={allCategories}
      />
      <KanbanLoading kanbanLoading={kanbanLoading}>
        <Spinner size='20px' />
      </KanbanLoading>
      <KanbanLoading kanbanLoading={shouldDelete}>
        <DeleteModal
          onDelete={handleDeletePost}
          onCancel={() => setShouldDelete(false)}
          loading={loading}
        />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default PostDetails;
