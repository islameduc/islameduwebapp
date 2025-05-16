import React, { useState, useEffect } from 'react';
import styles from './update-category-modal.module.css';

import { backendUrls } from '../../../api/urls';

interface UpdateCategoryModalProps {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryImagePreview: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    token: string;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
    categoryId,
    categoryName,
    categoryDescription,
    categoryImagePreview,
    isOpen,
    onClose,
    onSubmit,
    token
}) => {
    const [name, setName] = useState(categoryName);
    const [description, setDescription] = useState(categoryDescription);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(categoryImagePreview);

    useEffect(() => {
        if (!isOpen) {
            setName(categoryName);
            setDescription(categoryDescription);
            setImage(null);
            setImagePreview(categoryImagePreview);
        }
    }, [isOpen]);

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
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('categoryImage', image);
        }

        try {
            const response = await fetch(backendUrls.categories.UPDATE_CATEGORY(categoryId), {
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
                console.error('Failed to update category');
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
                <h2>Update Category</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className={styles.imagePreviewContainer}>{imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} crossOrigin='anonymous' />}</div>
                    <div className={styles.submitButtonContainer}><button type="submit" className={styles.submitButton}>Update Category</button></div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategoryModal;
