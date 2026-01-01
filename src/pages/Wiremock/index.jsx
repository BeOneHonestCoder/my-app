import React, { useEffect, useState, useCallback } from 'react';
import { Tag, Input, Button, Space, Typography, Empty, Spin, Popconfirm, message, Modal } from 'antd';
import { 
  SearchOutlined, ReloadOutlined, 
  PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import { WiremockApi } from '../../api/wiremock';
import styles from './wiremock.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DEFAULT_TEMPLATE = {
  request: {
    method: "GET",
    urlPath: "/api/new-endpoint"
  },
  response: {
    status: 200,
    body: "{\"success\": true}",
    headers: { "Content-Type": "application/json" }
  }
};

const WiremockManager = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newValue, setNewValue] = useState(JSON.stringify(DEFAULT_TEMPLATE, null, 2));

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await WiremockApi.getAll();
      const validData = Array.isArray(data) ? data : [];
      setMappings(validData);
      // Auto-select the first item if none selected
      setSelectedId(prevId => prevId ?? (validData.length > 0 ? validData[0].id : null));
    } catch (err) {
      console.error("Fetch mappings failed:", err);
      setMappings([]);
      message.error("Failed to connect to WireMock server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const selectedMapping = mappings.find(m => m.id === selectedId);

  const handleCreateStub = async () => {
    try {
      const stubData = JSON.parse(newValue);
      await WiremockApi.create(stubData);
      message.success('New mapping created successfully');
      setIsModalOpen(false);
      fetchMappings();
      setNewValue(JSON.stringify(DEFAULT_TEMPLATE, null, 2));
    } catch (e) {
      message.error(e instanceof SyntaxError ? 'Invalid JSON format' : 'Create operation failed');
    }
  };

  const handleUpdateStub = async () => {
    try {
      const updatedData = JSON.parse(editValue);
      await WiremockApi.update(selectedId, updatedData);
      message.success('Mapping successfully updated');
      setIsEditing(false);
      fetchMappings();
    } catch (e) {
      message.error(e instanceof SyntaxError ? 'Invalid JSON format' : 'Update operation failed');
    }
  };

  const handleDeleteStub = async () => {
    try {
      await WiremockApi.delete(selectedId);
      message.success('Mapping removed from service');
      setSelectedId(null);
      fetchMappings();
    } catch (e) {
      message.error('Delete operation failed');
    }
  };

  const filteredMappings = mappings.filter(m => {
    const url = m.request?.urlPath || m.request?.url || m.request?.urlPattern || '';
    return url.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Title level={4} style={{ margin: 0 }}>Wiremock Control Plane</Title>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Sidebar */}
        <div className={styles.listSide}>
          <div className={styles.listToolbar}>
            <Input 
              placeholder="Filter URL..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
              style={{ flex: 1 }}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchMappings} loading={loading} />
          </div>
          
          <div className={styles.listContent}>
            {/* FIX: Using Nesting Pattern for Spin to resolve 'tip' warning and provide better UX */}
            <Spin spinning={loading} tip="Loading Mappings...">
              {filteredMappings.length > 0 ? (
                filteredMappings.map(item => (
                  <div 
                    key={item.id} 
                    className={`${styles.stubItem} ${selectedId === item.id ? styles.activeItem : ''}`} 
                    onClick={() => { setSelectedId(item.id); setIsEditing(false); }}
                  >
                    <Tag color="blue" className={styles.methodTag}>{item.request?.method || 'ANY'}</Tag>
                    <Text ellipsis className={styles.urlText}>{item.request?.urlPath || item.request?.url || '/'}</Text>
                  </div>
                ))
              ) : !loading && (
                <div className={styles.centered}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Stubs Found" />
                </div>
              )}
            </Spin>
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.detailSide}>
          {selectedMapping ? (
            <div className={styles.detailWrapper}>
              <div className={styles.detailToolbar}>
                <Space size="small" align="center">
                  <Title level={5} style={{ margin: 0, fontSize: '15px' }}>Mapping Detail</Title>
                  
                  <div className={styles.customDivider} />
                  
                  {isEditing ? (
                    <Space size="small">
                      <Button icon={<CheckOutlined />} type="primary" size="small" onClick={handleUpdateStub}>Save</Button>
                      <Button icon={<CloseOutlined />} size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </Space>
                  ) : (
                    <Space size="small">
                      <Button 
                        type="link" 
                        size="small"
                        icon={<EditOutlined />} 
                        onClick={() => {
                          setEditValue(JSON.stringify(selectedMapping, null, 2));
                          setIsEditing(true);
                        }}
                      >
                        Edit Stub
                      </Button>
                      
                      <Popconfirm
                        title="Delete this stub mapping?"
                        onConfirm={handleDeleteStub}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  )}
                </Space>
                <Text type="secondary" style={{ fontSize: '10px', opacity: 0.4 }}>ID: {selectedId}</Text>
              </div>

              <div className={styles.jsonBody}>
                {isEditing ? (
                  <TextArea 
                    value={editValue} 
                    onChange={e => setEditValue(e.target.value)} 
                    className={styles.editor}
                    spellCheck={false}
                  />
                ) : (
                  <pre className={styles.viewer}>
                    {JSON.stringify(selectedMapping, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.centered}>
              <Empty description="Select a stub to view configuration" />
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creation */}
      <Modal
        title="Create New Mapping"
        open={isModalOpen}
        onOk={handleCreateStub}
        onCancel={() => setIsModalOpen(false)}
        width={750}
        okText="Create"
        // FIX: Replaced deprecated destroyOnClose with destroyOnHidden
        destroyOnHidden={true}
      >
        <div style={{ marginBottom: '12px' }}>
          <Text type="secondary">Define your stub configuration in JSON format (Transient):</Text>
        </div>
        <TextArea 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)} 
          rows={16} 
          className={styles.modalEditor}
          spellCheck={false}
        />
      </Modal>
    </div>
  );
};

export default WiremockManager;