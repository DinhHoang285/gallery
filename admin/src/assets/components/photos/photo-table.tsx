'use client';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Photo } from '@/assets/services/photo.service';
import styles from './style.module.scss';

interface PhotoTableProps {
  photos: Photo[];
  loading?: boolean;
  onEdit: (photo: Photo) => void;
  onDelete: (id: string) => void;
}

const PhotoTable = ({ photos, loading, onEdit, onDelete }: PhotoTableProps) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => text || '-',
      sorter: (a: Photo, b: Photo) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      },
    },
    {
      title: 'From Source',
      dataIndex: 'fromSource',
      key: 'fromSource',
      sorter: (a: Photo, b: Photo) => a.fromSource.localeCompare(b.fromSource),
    },
    {
      title: 'Categories',
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      render: (categoryIds: string[]) => {
        if (!categoryIds || categoryIds.length === 0) {
          return '-';
        }
        return <Tag>{categoryIds.length} category(ies)</Tag>;
      },
    },
    {
      title: 'Files',
      dataIndex: 'fileIds',
      key: 'fileIds',
      render: (fileIds: string[]) => {
        if (!fileIds || fileIds.length === 0) {
          return '-';
        }
        return <Tag>{fileIds.length} file(s)</Tag>;
      },
    },
    {
      title: 'For Sale',
      dataIndex: 'isSale',
      key: 'isSale',
      render: (isSale: boolean) => (
        <Tag color={isSale ? 'green' : 'default'}>
          {isSale ? 'Yes' : 'No'}
        </Tag>
      ),
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value: any, record: Photo) => record.isSale === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        if (!price || price === 0) {
          return '-';
        }
        return `$${price.toFixed(2)}`;
      },
      sorter: (a: Photo, b: Photo) => (a.price || 0) - (b.price || 0),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text ? new Date(text).toLocaleDateString() : '-',
      sorter: (a: Photo, b: Photo) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Photo) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this photo?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={photos}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} photos`,
        }}
      />
    </div>
  );
};

export default PhotoTable;

