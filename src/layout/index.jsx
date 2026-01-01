import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  ApiOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './layout.module.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Mapping path to English labels for Breadcrumbs
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

  return (
    <Layout className={styles.mainLayout}>
      <Sider 
        width={240} 
        theme="dark" 
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          {!collapsed && <span className={styles.logoText}>Portal-Demo</span>}
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
        {/* Simplified Header with shadow and border */}
        <Header className={styles.header}>
          <Breadcrumb 
            items={[
              { title: 'Home' },
              { title: breadcrumbNameMap[location.pathname] || 'Current' }
            ]} 
          />
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;