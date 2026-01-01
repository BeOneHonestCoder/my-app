import React from 'react';
import { Result, Button } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './wiremock.module.css';

const WiremockPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.resultWrapper}>
        <Result
          icon={<ApiOutlined className={styles.apiIcon} />}
          title="Wiremock Management"
          subTitle="This module is currently under construction. Stay tuned for advanced Mock API management."
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default WiremockPage;