import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AttachFileIcon } from '../../../assets/svg';
import Input from '../../../components/admin/input/Input.component';
import AdminLayout from '../../../layouts/Admin.layout';
import TextArea from '../../../components/admin/input/TextArea.component';
import Dropdown from '../../../components/admin/input/Dropdown.component';
import { blogCategories } from '../../../assets/data/blogCategories';
import Button from '../../../components/admin/button/Button.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getMembersAction } from '../../../store/features/slices/members/members.action';
import styles from './add-post.module.css';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import { toast } from 'react-toastify';
import { stopLoading } from '../../../store/features/slices/loader/loader.slice';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';
import { getCategoriesAction } from '../../../store/features/slices/categories/categories.action';
import { backendUrls } from '../../../api/urls';

interface Category {
  _id: string;
  name: string;
}

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  token: string;
  categories: Category[];
}

const AddProject = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<any>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?._id || '');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const getAllCategories = () => {
    dispatch(getCategoriesAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedCategories = payload;
        console.log(fetchedCategories);
        setCategories(fetchedCategories);
        setSelectedCategory(fetchedCategories[0]._id);
      }
    });
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', selectedCategory);
    if (image) {
      formData.append('postImage', image);
    }

    try {
      const response = await fetch(backendUrls.posts.ADD_POST, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        },
      });
      if (response.ok) {
        toast.success('Post added successfully')
        navigate(paths.ADMIN.POSTS);
      } else {
        console.error('Failed to add post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Add New Post</h2>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map((category: Category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>Content</label>
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className={styles.imagePreviewContainer}>
              {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} crossOrigin='anonymous' />}
            </div>
            <div className={styles.submitButtonContainer}>
              <button type="submit" className={styles.submitButton}>Add Post</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProject;
