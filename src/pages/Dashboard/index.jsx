import React from 'react';
import { Typography } from 'antd';
import { 
  UserOutlined, 
  ApiOutlined, 
  ThunderboltOutlined,
  SafetyCertificateOutlined 
} from '@ant-design/icons';
import styles from './dashboard.module.css';

const { Title } = Typography;

const Dashboard = () => {
  // Statistics configuration array for future extensibility (e.g., adding FF4J)
  const stats = [
    {
      label: 'Total Users',
      value: '128',
      icon: <UserOutlined />,
      type: 'iconBlue'
    },
    {
      label: 'Active Stubs',
      value: '0',
      icon: <ApiOutlined />,
      type: 'iconGreen'
    },
    {
      label: 'System Status',
      value: 'Online',
      icon: <ThunderboltOutlined />,
      type: 'iconOrange'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Main Header Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.titleGap}>
          <Title level={2} className={styles.welcomeTitle}>
            Portal Control Plane
          </Title>
          <SafetyCertificateOutlined className={styles.verifiedIcon} />
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className={styles.statGrid}>
        {stats.map((item, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles[item.type]}`}>
              {item.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{item.label}</span>
              <span className={styles.statValue}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;