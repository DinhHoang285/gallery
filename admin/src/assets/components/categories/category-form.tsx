'use client';
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/assets/services/category.service';
import styles from './style.module.scss';

interface CategoryFormProps {
  open: boolean;
  category?: Category | null;
  onCancel: () => void;
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>;
  loading?: boolean;
}

const CategoryForm = ({ open, category, onCancel, onSubmit, loading }: CategoryFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Set form values when category changes
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  return (
    <Modal
      title={category ? 'Edit Category' : 'Create Category'}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          {category ? 'Update' : 'Create'}
        </Button>,
      ]}
      className={styles.modal}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please input category name!' },
            { min: 2, message: 'Category name must be at least 2 characters long' },
          ]}
        >
          <Input placeholder="Category name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            placeholder="Category description (optional)"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;

