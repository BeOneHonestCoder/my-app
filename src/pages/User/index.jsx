import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Typography, Modal, Form, Input, DatePicker, message } from 'antd';
// Removed 'SearchOutlined' to fix the ESLint warning
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { UserApi } from '../../api/user';
import styles from './user.module.css';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await UserApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredUsers = useMemo(() => {
    if (!searchText) return users;
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id?.toString().includes(searchText)
    );
  }, [users, searchText]);

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 80,
      render: (id) => <span className={styles.idTag}>#{id}</span>
    },
    { 
      title: 'User Name', 
      dataIndex: 'name', 
      key: 'name',
      width: 200,
      render: (text) => (
        <Space>
          <UserOutlined className={styles.iconGray} />
          <span className={styles.userName}>{text}</span>
        </Space>
      )
    },
    { 
      title: 'Birthday', 
      dataIndex: 'birthday', 
      key: 'birthday',
      width: 150,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
    },
    { 
      title: 'Created At', 
      dataIndex: 'createts', 
      key: 'createts',
      width: 200,
      render: (date) => (
        <span className={styles.timeText}>
          {date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </span>
      )
    },
    {
      title: 'Operations',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} className={styles.editBtn} onClick={() => {
            setEditingUser(record);
            form.setFieldsValue({ ...record, birthday: record.birthday ? dayjs(record.birthday) : null });
            setIsModalOpen(true);
          }}>Edit</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
            Modal.confirm({
              title: 'Confirm Delete',
              content: `Are you sure you want to delete user: ${record.name}?`,
              okText: 'Delete',
              cancelText: 'Cancel',
              okType: 'danger',
              onOk: async () => {
                try {
                  await UserApi.delete(record.id);
                  message.success('User deleted successfully');
                  loadData();
                } catch (e) {
                  message.error('Delete operation failed');
                }
              }
            });
          }}>Delete</Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values) => {
    try {
      const payload = { 
        ...values, 
        birthday: values.birthday ? values.birthday.toISOString() : null 
      };
      
      if (editingUser) {
        await UserApi.update(editingUser.id, payload);
        message.success('User updated successfully');
      } else {
        await UserApi.create(payload);
        message.success('User created successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      message.error('Operation failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleDecoration} />
            <Title level={4} className={styles.title}>Users</Title>
          </div>
          
          <Space size="middle">
            <Search
              placeholder="Search by name or ID"
              allowClear
              onSearch={value => setSearchText(value)}
              onChange={e => setSearchText(e.target.value)}
              className={styles.searchInput}
            />
            <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>Create User</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id" 
          loading={loading}
          size="middle"
          tableLayout="fixed"
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} items` }}
        />
      </div>

      <Modal 
        title={editingUser ? "Update Profile" : "Create User"} 
        open={isModalOpen} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalOpen(false)}
        key={isModalOpen ? 'open' : 'closed'}
        width={400}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          className={styles.formWrapper}
        >
          <Form.Item 
            name="name" 
            label="Name" 
            rules={[{ required: true, message: 'Please input user name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item 
            name="birthday" 
            label="Birthday" 
            rules={[{ required: true, message: 'Please select birthday' }]}
          >
            <DatePicker className={styles.fullWidth} placeholder="Select date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;