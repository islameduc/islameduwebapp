import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './add-post-modal.module.css';
import { backendUrls } from '../../../api/urls';

interface Category {
    _id: string;
    name: string;
}

interface UpdatePostModalProps {
    postId: string;
    postTitle: string;
    postContent: string;
    postImagePreview: string | null;
    postCategoryId: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    token: string;
    categories: Category[];
}

const UpdatePostModal: React.FC<UpdatePostModalProps> = ({
    postId,
    postTitle,
    postContent,
    postImagePreview,
    postCategoryId,
    isOpen,
    onClose,
    onSubmit,
    token,
    categories
}) => {
    const [title, setTitle] = useState(postTitle);
    const [content, setContent] = useState(postContent);
    const [categoryId, setCategoryId] = useState(postCategoryId);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(postImagePreview);

    useEffect(() => {
        if (isOpen) {
            setTitle(postTitle);
            setContent(postContent);
            setImage(null);
            setImagePreview(postImagePreview);
            setCategoryId(postCategoryId);
        }
    }, [isOpen, postTitle, postContent, postImagePreview, postCategoryId]);

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
        formData.append('categoryId', categoryId);
        if (image) {
            formData.append('postImage', image);
        }

        try {
            const response = await fetch(backendUrls.posts.UPDATE_POST(postId), {
                method: 'PATCH',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                onSubmit();
                onClose();
            } else {
                console.error('Failed to update post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.title}>Update Post</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>Category</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
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
                        <button type="submit" className={styles.submitButton}>Update Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePostModal;
