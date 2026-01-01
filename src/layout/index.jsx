import React from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge, Breadcrumb, message } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  ApiOutlined, 
  BellOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './layout.module.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbNameMap = {
    '/': 'Dashboard',
    '/user': 'User Management',
    '/wiremock': 'Wiremock Management',
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/user', icon: <UserOutlined />, label: 'User Management' },
    { key: '/wiremock', icon: <ApiOutlined />, label: 'Wiremock Management' },
  ];

  const handleLogout = () => {
    message.success('Logged out successfully');
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider width={240} theme="dark" className={styles.sider}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          <span className={styles.logoText}>Portal-Demo</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Breadcrumb 
              items={[
                { title: 'Home' },
                { title: breadcrumbNameMap[location.pathname] || 'Current' }
              ]} 
            />
          </div>
          
          <div className={styles.headerRight}>
            <Space size={24}>
              <Badge count={3} dot>
                <BellOutlined className={styles.headerIcon} />
              </Badge>
              <Space className={styles.userInfo}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                {/* Fixed: Removed 'block' attribute to eliminate React warning */}
                <div className={styles.userText}>
                  <Text strong className={styles.userNameText}>Admin</Text>
                  <Text type="secondary" className={styles.userRoleText}>System Manager</Text>
                </div>
              </Space>
              <LogoutOutlined 
                className={styles.logoutIcon} 
                onClick={handleLogout} 
              />
            </Space>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;