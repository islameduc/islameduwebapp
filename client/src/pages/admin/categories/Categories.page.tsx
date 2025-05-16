import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../../layouts/Admin.layout';
import AdminSection from '../../../components/admin/admin-section/AdminSection.component';
import styles from './categories.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { backendUrls } from '../../../api/urls';
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
import { getCategoriesAction } from '../../../store/features/slices/categories/categories.action';
import CategoryCard from '../category-card/CategoryCard.page';
import AddCategoryModal from '../../../components/admin/add-category-modal/AddCategoryModal';
import UpdateCategoryModal from '../../../components/admin/update-category-modal/UpdateCategoryModal';
import AddPostModal from '../../../components/admin/add-post-modal/AddPostModal';
import BlogPosts from '../../../components/shared/blog-posts/BlogPosts';
import Pagination from '../../pagenation/Pagination';

interface CategoryProps {
  _id: string;
  name: string;
  description: string;
  image?: {
    _id: string;
    httpPath: string;
  };
  isDeleted: boolean;
}

const Categories = () => {
  const { user } = useAppSelector((state) => state.auth);
  // const { categoryError, categories } = useAppSelector((state) => state.categories);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryImagePreview, setCategoryImagePreview] = useState('')
  const effectRef = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleLoading, setVisibleLoading] = useState<string>('');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getAllCategories = () => {
    dispatch(getCategoriesAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedCategories = payload;
        console.log(fetchedCategories);
        setAllCategories(fetchedCategories);
      }
    });
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleAddNavigate = () => {
    if (user?.user?.role !== 'superAdmin')
      return toast.error('You are not authorized to add a post');
    navigate(paths.ADMIN.ADD_POST);
  };

  const handleDeleteCategory = async (currentCategoryId: string) => {
    try {
      const response = await fetch(backendUrls.categories.DELETE_CATEGORY(currentCategoryId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        },
      });

      if (response.ok) {
        toast.success('Category deleted successfully')
        getAllCategories();
      } else {
        toast.error('Category deleted unsuccessfully')
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpenAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
    setIsUpdateCategoryModalOpen(false);
    setIsAddPostModalOpen(false)
  };

  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const handleAddCategorySubmit = () => {
    toast.success('Category added successfully')
    getAllCategories();
  };

  const handleOpenUpdateCategoryModal = (currentCategoryId: string) => {
    const selectedCategory = allCategories.find((category: CategoryProps) => category._id === currentCategoryId)
    if (selectedCategory) {
      setCategoryId(selectedCategory._id)
      setCategoryName(selectedCategory.name)
      setCategoryDescription(selectedCategory.description)
      setCategoryImagePreview(selectedCategory.image.httpPath)
      setIsUpdateCategoryModalOpen(true);
      setIsAddCategoryModalOpen(false);
      setIsAddPostModalOpen(false)
    }
  };

  const handleCloseUpdateCategoryModal = () => {
    setIsUpdateCategoryModalOpen(false);
  };

  const handleUpdateCategorySubmit = () => {
    toast.success('Category updated successfully')
    getAllCategories();
  };

  const handleAddBlog = (currentCategoryId: string) => {
    setCategoryId(currentCategoryId)
    const selectedCategory = allCategories.find((category: CategoryProps) => category._id === currentCategoryId)
    if (selectedCategory) {
      setCategoryName(selectedCategory.name)
      setIsAddPostModalOpen(true);
      setIsAddCategoryModalOpen(false)
      setIsUpdateCategoryModalOpen(false)
    }
  };

  const handleCloseAddPostModal = () => {
    setIsAddPostModalOpen(false);
  };

  const handleAddPostSubmit = () => {
    toast.success('Post added successfully')
  };

  return (
    <AdminLayout
      title='Post Categories'
      showBack={false}
      onClick={handleOpenAddCategoryModal}
      actionText='Add New Category'
    >
      <div>
        {allCategories?.length > 0 ? (
          <div className={styles.categoriesContainer}>
            {allCategories.map((category: CategoryProps) =>
            (<CategoryCard
              key={category._id}
              name={category.name}
              image={category.image?.httpPath}
              onAddBlog={() => handleAddBlog(category._id)}
              onEditCategory={() => handleOpenUpdateCategoryModal(category._id)}
              onDeleteCategory={() => handleDeleteCategory(category._id)}
            />))}
          </div>
        ) : (
          <NoData
            infoText='No Categories Yet'
            onClick={handleOpenAddCategoryModal}
            text='Add New Category'
          />
        )}
        <AddCategoryModal
          key={`${categoryId}-add-category-modal`}
          isOpen={isAddCategoryModalOpen}
          onClose={handleCloseAddCategoryModal}
          onSubmit={handleAddCategorySubmit}
          token={user?.accessToken}
        />
        <UpdateCategoryModal
          key={`${categoryId}-upgrade-category-modal`}
          categoryId={categoryId}
          categoryName={categoryName}
          categoryDescription={categoryDescription}
          categoryImagePreview={categoryImagePreview}
          isOpen={isUpdateCategoryModalOpen}
          onClose={handleCloseUpdateCategoryModal}
          onSubmit={handleUpdateCategorySubmit}
          token={user?.accessToken}
        />
        <AddPostModal
          key={`${categoryId}-add-post-modal`}
          isOpen={isAddPostModalOpen}
          onClose={handleCloseAddPostModal}
          onSubmit={handleAddPostSubmit}
          token={user?.accessToken}
          categoryId={categoryId}
          categoryName={categoryName}
        />
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='18px' />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Categories;
