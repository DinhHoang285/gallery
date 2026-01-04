'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Switch, InputNumber, Select, Upload, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Photo, CreatePhotoDto, UpdatePhotoDto } from '@/assets/services/photo.service';
import { Category } from '@/assets/services/category.service';
import { fileService } from '@/assets/services';
import { useUser } from '@/assets/providers/user.provider';
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
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async () => {
    try {
      // Set fromSource to current user ID before validation if creating new photo
      if (!photo) {
        if (!user?.id) {
          message.error('User information not available. Please refresh the page.');
          return;
        }
        // Set field value and trigger validation
        form.setFieldsValue({ fromSource: user.id });
        // Wait a bit for form to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const values = await form.validateFields();

      // Ensure fromSource is set (fallback)
      if (!values.fromSource && user?.id) {
        values.fromSource = user.id;
      }

      // Final check
      if (!values.fromSource) {
        message.error('From source is required');
        return;
      }

      // If creating new photo and has files, upload files first
      if (!photo && fileList.length > 0) {
        setUploading(true);
        const uploadedFileIds: string[] = [];

        // Get isSale and price from form values for file upload
        // Use explicit checks to handle false and 0 values
        const isSale = values.isSale === true || values.isSale === 'true';
        const price = values.price !== undefined && values.price !== null
          ? (typeof values.price === 'number' ? values.price : parseFloat(values.price) || 0)
          : 0;

        // Upload each file
        for (const fileItem of fileList) {
          try {
            const uploadResponse = await fileService.uploadFile(
              fileItem.originFileObj || fileItem,
              fileItem.name,
              fileItem.description,
              isSale,
              price
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

    // Limit to 10 files
    newFileList = newFileList.slice(-10);

    // Read response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const handleRemoveFile = (file: any) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
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
      // Don't show file upload for edit mode
      setFileList([]);
    } else {
      form.resetFields();
      // Set fromSource to current user ID when creating new photo
      if (user?.id) {
        form.setFieldsValue({
          fromSource: user.id,
          isSale: false,
          price: 0,
        });
      } else {
        form.setFieldsValue({
          isSale: false,
          price: 0,
        });
      }
      setFileList([]);
    }
  }, [photo, form, user]);

  return (
    <Modal
      title={photo ? 'Edit Photo' : 'Create Photo'}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading || uploading}>
          {photo ? 'Update' : uploading ? 'Uploading...' : 'Create'}
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
        {photo ? (
          <Form.Item
            label="From Source"
            name="fromSource"
            rules={[{ required: true, message: 'From source is required!' }]}
          >
            <Input placeholder="From source" />
          </Form.Item>
        ) : (
          <Form.Item
            name="fromSource"
            rules={[{ required: true, message: 'From source is required!' }]}
            hidden
            initialValue={user?.id}
          >
            <Input />
          </Form.Item>
        )}

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

        {!photo && (
          <Form.Item
            label="Upload Files"
            tooltip="Upload files for this photo. Files will be uploaded when you submit the form."
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              beforeUpload={() => false} // Prevent auto upload
              multiple
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
            {fileList.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                {fileList.length} file(s) selected. Files will be uploaded on submit.
              </div>
            )}
          </Form.Item>
        )}

        {photo && (
          <Form.Item
            label="File IDs"
            name="fileIds"
            tooltip="File IDs (read-only in edit mode)"
          >
            <Input
              value={photo.fileIds?.join(', ') || ''}
              disabled
              placeholder="No files"
            />
          </Form.Item>
        )}

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
            prefix="$"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhotoForm;

