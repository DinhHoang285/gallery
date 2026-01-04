'use client';
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Switch, InputNumber, Select } from 'antd';
import { Photo, CreatePhotoDto, UpdatePhotoDto } from '@/assets/services/photo.service';
import { Category } from '@/assets/services/category.service';
import styles from './style.module.scss';

interface PhotoFormProps {
  open: boolean;
  photo?: Photo | null;
  categories: Category[];
  onCancel: () => void;
  onSubmit: (data: CreatePhotoDto | UpdatePhotoDto) => Promise<void>;
  loading?: boolean;
}

const PhotoForm = ({ open, photo, categories, onCancel, onSubmit, loading }: PhotoFormProps) => {
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

  // Set form values when photo changes
  useEffect(() => {
    if (photo) {
      form.setFieldsValue({
        fromSource: photo.fromSource,
        categoryIds: photo.categoryIds || [],
        fileIds: photo.fileIds || [],
        title: photo.title,
        description: photo.description,
        isSale: photo.isSale || false,
        price: photo.price || 0,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isSale: false,
        price: 0,
      });
    }
  }, [photo, form]);

  return (
    <Modal
      title={photo ? 'Edit Photo' : 'Create Photo'}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          {photo ? 'Update' : 'Create'}
        </Button>,
      ]}
      className={styles.modal}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item
          label="From Source"
          name="fromSource"
          rules={[{ required: true, message: 'Please input from source!' }]}
        >
          <Input placeholder="From source (e.g., URL or source name)" />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
        >
          <Input placeholder="Photo title (optional)" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            placeholder="Photo description (optional)"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Categories"
          name="categoryIds"
        >
          <Select
            mode="multiple"
            placeholder="Select categories (optional)"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map(cat => ({
              value: cat._id,
              label: cat.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="File IDs"
          name="fileIds"
          tooltip="Enter file IDs separated by commas or leave empty"
        >
          <Select
            mode="tags"
            placeholder="Enter file IDs (optional)"
            tokenSeparators={[',']}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="For Sale"
          name="isSale"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ type: 'number', min: 0, message: 'Price must be greater than or equal to 0' }]}
        >
          <InputNumber
            placeholder="Price"
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhotoForm;

