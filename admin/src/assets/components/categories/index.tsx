'use client';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { categoryService, Category, CreateCategoryDto, UpdateCategoryDto } from '@/assets/services';
import { showError, showSuccess } from '@/assets/lib/message';
import CategoryTable from './category-table';
import CategoryForm from './category-form';
import styles from './style.module.scss';

const CategoriesComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error: any) {
      showError(error?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id);
      showSuccess('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      showError(error?.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    setFormLoading(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, data as UpdateCategoryDto);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.create(data as CreateCategoryDto);
        showSuccess('Category created successfully');
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      showError(error?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Add New Category
        </Button>
      </div>

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryForm
        open={isFormOpen}
        category={editingCategory}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default CategoriesComponent;

