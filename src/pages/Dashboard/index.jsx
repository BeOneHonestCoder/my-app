import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  UserOutlined, 
  ApiOutlined, 
  CheckCircleOutlined, 
  SyncOutlined 
} from '@ant-design/icons';
import styles from './dashboard.module.css';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <Title level={3} className={styles.pageTitle}>System Overview</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className={`${styles.statCard} ${styles.statActive}`}>
            <Statistic
              title="Active Users"
              value={1250}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className={`${styles.statCard} ${styles.statTotal}`}>
            <Statistic
              title="Total Stubs"
              value={48}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className={`${styles.statCard} ${styles.statHealth}`}>
            <Statistic
              title="System Status"
              value="Healthy"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className={`${styles.statCard} ${styles.statUptime}`}>
            <Statistic
              title="Uptime"
              value="99.9%"
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px' }}>
        <Card title="Quick Actions" variant="borderless">
          <p>Welcome to Enterprise Portal Control Plane. Select a module from the sidebar to begin.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;