// src/KnowledgeBase.js
import React, { useState } from "react";
import GenericModal from "../components/GenericModal";
import GenericTable from "../components/GenericTable";
import { Button } from "antd";
import "../assets/styleSheets/KnowledgeBase.css";
import { useNavigate } from "react-router-dom";

const initialData = [
  {
    userId: "1",
    name: "Sample KB",
    description: "Sample description",
    generationType: "Type 1",
    modalTopK: 5,
    chunkSize: 1024,
    embedding: "BGE-Dense",
    storageType: "Simple",
  },
];

const KnowledgeBase = () => {
    const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [editingRecord, setEditingRecord] = useState(null);
  const [knowledgeBaseData, setKnowledgeBaseData] = useState(initialData);
  const [formData, setFormData] = useState({}); // To track form values

  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setEditingRecord(record);
    setFormData(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleCreateOrEdit = (values) => {
    if (modalMode === "create") {
      const newEntry = {
        ...values,
        userId: (knowledgeBaseData.length + 1).toString(),
      };
      setKnowledgeBaseData([...knowledgeBaseData, newEntry]);
    } else if (modalMode === "edit" && editingRecord) {
      const updatedData = knowledgeBaseData.map((item) =>
        item.userId === editingRecord.userId ? { ...item, ...values } : item
      );
      setKnowledgeBaseData(updatedData);
    }
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    openModal("edit", record);
  };

  // Prepare inputs with conditional visibility based on storageType
  const getModalInputs = () => {
    return [
      { label: "Name", name: "name", type: "text", require: true, disabled: modalMode === "edit" },
      { label: "Description", name: "description", type: "text", require: true },
      { label: "No Of Iteration", name: "noofiteration", type: "text", require: true },
      { label: "Bucket Name", name: "bucketName", type: "text", require: true },
      { label: "Generation Type", name: "generationType", type: "text", require: true },
      { label: "Modal TopK", name: "modalTopK", type: "number", require: true, hidden: modalMode === "edit" },
      { label: "Chunk Size", name: "chunkSize", type: "number", require: true, hidden: modalMode === "edit" },
      {
        label: "Embedding",
        name: "embedding",
        type: "select",
        options: [
          { label: "BGE-Dense", value: "BGE-Dense" },
          { label: "BGE-Sparse", value: "BGE-Sparse" },
          { label: "BGE-cobart", value: "BGE-cobart" },
          { label: "openAI", value: "openAI" },
        ],
        require: true,
        hidden: modalMode === "edit",
      },
      {
        label: "Storage Type",
        name: "storageType",
        type: "select",
        options: [
          { label: "Simple", value: "Simple" },
          { label: "Full Content", value: "Full Content" },
          { label: "Summary", value: "Summary" },
        ],
        require: true,
      },
      // Show these fields only if storageType is 'Full Content'
      {
        label: "L2 TopK",
        name: "l2TopK",
        type: "number",
        hidden: (formData) => formData.storageType !== "Full Content",
      },
      {
        label: "L2 Chunk Size",
        name: "l2ChunkSize",
        type: "number",
        hidden: (formData) => formData.storageType !== "Full Content",
      },
      // Show this field only if storageType is 'Summary'
      {
        label: "Content",
        name: "content",
        type: "select",
        options: [
          { label: "Summary", value: "Summary" },
          { label: "Context", value: "Context" },
          { label: "Both", value: "Both" },
        ],
        hidden: (formData) => formData.storageType !== "Summary",
      },
    ];
  };

  const handleView = (record) => {
    navigate(`/knowledge-base/${record.userId}`);
  };


  return (
    <div className="page-content">
      <h1 className="kb-title">Knowledge Base</h1>
      <Button type="primary" className="create-knowledge-button" onClick={() => openModal("create")}>
        Create New Knowledge Base
      </Button>
      <GenericTable
        data={knowledgeBaseData}
        searchKeys={["name", "description"]}
        sortableColumns={["name", "modalTopK", "chunkSize"]}
        filterableColumns={["embedding", "storageType"]}
        actions={["View"]}
        actionFunctions={[handleView]}

      />
      {isModalVisible && (
        <GenericModal
          isVisible={isModalVisible}
          handleOk={handleCreateOrEdit}
          handleCancel={handleCancel}
          title={modalMode === "create" ? "Create Knowledge Base" : "Edit Knowledge Base"}
          inputs={getModalInputs()}
          actions={["Submit", "Cancel"]}
          actionFunctions={[handleCreateOrEdit, handleCancel]}
          predefinedData={editingRecord || {}}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
