// src/KnowledgeBaseView.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Button, Form, Input, List } from "antd";
import "../assets/styleSheets/KnowledgeBaseView.css";

const { TabPane } = Tabs;

const KnowledgeBaseView = () => {
  const { id } = useParams();
  const [detailsData, setDetailsData] = useState({
    name: "Sample KB",
    description: "Sample description",
    generationType: "Type 1",
    modalTopK: 5,
    chunkSize: 1024,
    embedding: "BGE-Dense",
    storageType: "Simple",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState([]);
  const [sites, setSites] = useState([]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = (values) => {
    setDetailsData(values);
    setIsEditing(false);
  };

  const handleAddFile = (values) => {
    setFiles([...files, { name: values.fileName, url: values.fileUrl }]);
  };

  const handleAddSite = (values) => {
    setSites([...sites, { name: values.siteName, url: values.siteUrl }]);
  };

  return (
    <div className="knowledge-base-view">
      <h2>Knowledge Base - {detailsData.name}</h2>
      <div style={{ overflowX: 'auto' }}>
        <Tabs defaultActiveKey="1" tabPosition="top" type="line">
          <TabPane tab="Details" key="1">
            <h3>Details</h3>
            {isEditing ? (
              <Form
                initialValues={detailsData}
                onFinish={handleSave}
                layout="vertical"
              >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="generationType" label="Generation Type">
                  <Input />
                </Form.Item>
                <Form.Item name="modalTopK" label="Modal TopK">
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="chunkSize" label="Chunk Size">
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="embedding" label="Embedding">
                  <Input />
                </Form.Item>
                <Form.Item name="storageType" label="Storage Type">
                  <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
                <Button onClick={handleEditToggle}>Cancel</Button>
              </Form>
            ) : (
              <div>
                <p>Name: {detailsData.name}</p>
                <p>Description: {detailsData.description}</p>
                <p>Generation Type: {detailsData.generationType}</p>
                <p>Modal TopK: {detailsData.modalTopK}</p>
                <p>Chunk Size: {detailsData.chunkSize}</p>
                <p>Embedding: {detailsData.embedding}</p>
                <p>Storage Type: {detailsData.storageType}</p>
                <Button type="primary" onClick={handleEditToggle}>Edit</Button>
              </div>
            )}
          </TabPane>
          <TabPane tab="Files" key="2">
            <h3>Files</h3>
            <List
              dataSource={files}
              renderItem={(file) => (
                <List.Item>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </List.Item>
              )}
            />
            <Form layout="inline" onFinish={handleAddFile}>
              <Form.Item
                name="fileName"
                rules={[{ required: true, message: 'Please enter file name' }]}
              >
                <Input placeholder="File Name" />
              </Form.Item>
              <Form.Item
                name="fileUrl"
                rules={[{ required: true, message: 'Please enter file URL' }]}
              >
                <Input placeholder="File URL" />
              </Form.Item>
              <Button type="primary" htmlType="submit">Add New File</Button>
            </Form>
          </TabPane>
          <TabPane tab="Sites" key="3">
            <h3>Sites</h3>
            <List
              dataSource={sites}
              renderItem={(site) => (
                <List.Item>
                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                    {site.name}
                  </a>
                  <Button type="link" href={site.url} target="_blank" rel="noopener noreferrer">
                    Go to Site
                  </Button>
                </List.Item>
              )}
            />
            <Form layout="inline" onFinish={handleAddSite}>
              <Form.Item
                name="siteName"
                rules={[{ required: true, message: 'Please enter site name' }]}
              >
                <Input placeholder="Site Name" />
              </Form.Item>
              <Form.Item
                name="siteUrl"
                rules={[{ required: true, message: 'Please enter site URL' }]}
              >
                <Input placeholder="Site URL" />
              </Form.Item>
              <Button type="primary" htmlType="submit">Add URL</Button>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default KnowledgeBaseView;
