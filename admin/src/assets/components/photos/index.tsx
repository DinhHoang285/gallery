'use client';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { photoService, Photo, CreatePhotoDto, UpdatePhotoDto } from '@/assets/services';
import { categoryService, Category } from '@/assets/services';
import { showError, showSuccess } from '@/assets/lib/message';
import PhotoTable from './photo-table';
import PhotoForm from './photo-form';
import styles from './style.module.scss';

const PhotosComponent = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await photoService.getAll();
      setPhotos(data);
    } catch (error: any) {
      showError(error?.message || 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingPhoto(null);
    setIsFormOpen(true);
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await photoService.delete(id);
      showSuccess('Photo deleted successfully');
      fetchPhotos();
    } catch (error: any) {
      showError(error?.message || 'Failed to delete photo');
    }
  };

  const handleSubmit = async (data: CreatePhotoDto | UpdatePhotoDto) => {
    setFormLoading(true);
    try {
      if (editingPhoto) {
        await photoService.update(editingPhoto._id, data as UpdatePhotoDto);
        showSuccess('Photo updated successfully');
      } else {
        console.log('data', data);
        await photoService.create(data as CreatePhotoDto);
        showSuccess('Photo created successfully');
      }
      setIsFormOpen(false);
      setEditingPhoto(null);
      fetchPhotos();
    } catch (error: any) {
      showError(error?.message || `Failed to ${editingPhoto ? 'update' : 'create'} photo`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPhoto(null);
  };

  return (
    <div className={styles.photosPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Photos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Add New Photo
        </Button>
      </div>

      <PhotoTable
        photos={photos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PhotoForm
        open={isFormOpen}
        photo={editingPhoto}
        categories={categories}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default PhotosComponent;

