import { DashboardOutlined, UserOutlined, ApiOutlined } from '@ant-design/icons';

export const menuConfig = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    path: '/user',
    label: 'User Management',
    icon: <UserOutlined />,
  },
  {
    path: '/wiremock',
    label: 'Wiremock Management',
    icon: <ApiOutlined />,
  },
];