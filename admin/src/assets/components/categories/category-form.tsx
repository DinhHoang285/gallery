'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/assets/services/category.service';
import { fileService } from '@/assets/services';
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
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // If creating new category and has files, upload files first
      if (!category && fileList.length > 0) {
        setUploading(true);
        const uploadedFileIds: string[] = [];

        // Upload each file with fileType = 'category'
        for (const fileItem of fileList) {
          try {
            const uploadResponse = await fileService.uploadFile(
              fileItem.originFileObj || fileItem,
              fileItem.name,
              fileItem.description,
              false, // isSale
              0, // price
              'category' // fileType
            );
            uploadedFileIds.push(uploadResponse.file.id);
          } catch (error: any) {
            message.error(`Failed to upload file: ${error.message || 'Unknown error'}`);
            setUploading(false);
            return;
          }
        }

        // Add uploaded file IDs to form values
        values.fileIds = uploadedFileIds;
        setUploading(false);
      }

      await onSubmit(values);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Form validation error:', error);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    // Limit to 1 file for category
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const handleRemoveFile = (file: any) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  // Set form values when category changes
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        fileIds: category.fileIds || [],
      });
      // Don't show file upload for edit mode
      setFileList([]);
    } else {
      form.resetFields();
      setFileList([]);
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
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading || uploading}>
          {category ? 'Update' : uploading ? 'Uploading...' : 'Create'}
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

        {!category && (
          <Form.Item
            label="Upload Image"
            tooltip="Upload an image for this category. Image will be uploaded when you submit the form."
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {fileList.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                1 image selected. Image will be uploaded on submit.
              </div>
            )}
          </Form.Item>
        )}

        {category && (
          <Form.Item
            label="File IDs"
            name="fileIds"
            tooltip="File IDs (read-only in edit mode)"
          >
            <Input
              value={category.fileIds?.join(', ') || ''}
              disabled
              placeholder="No files"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CategoryForm;

