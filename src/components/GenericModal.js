// src/components/GenericModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, Select, message } from "antd";
import "../assets/styleSheets/GenericModal.css";

const { Option } = Select;

const GenericModal = ({
  isVisible,
  handleOk,
  handleCancel,
  title,
  inputs, // Array of input fields with attributes (label, name, type, require, hidden)
  actions, // Array of buttons like ['Submit', 'Cancel']
  actionFunctions, // Array of functions corresponding to the actions
  predefinedData = {}, // Optional predefined data for edit forms
}) => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [formData, setFormData] = useState(predefinedData || {});

  useEffect(() => {
    if (isVisible) {
      if (predefinedData && Object.keys(predefinedData).length > 0) {
        setFormData(predefinedData);
        form.setFieldsValue(predefinedData); // Set predefined values to the form
      } else {
        setFormData({});
        form.resetFields(); // Reset form if no predefined data
      }
    }
  }, [isVisible, predefinedData]);

  // Handle form value changes dynamically
  const handleValuesChange = (changedValues) => {
    const updatedData = { ...formData, ...changedValues };
    setFormData(updatedData);
    form.setFieldsValue(updatedData);
  };

  // Generate form items dynamically based on input props
  const formItems = inputs
    .filter((input) => !input.hidden || !input.hidden(formData)) // Conditional visibility
    .map((input) => (
      <Form.Item
        key={input.name}
        label={input.label}
        name={input.name}
        rules={
          input.require
            ? [{ required: true, message: `${input.label} is required` }]
            : []
        }
      >
        {input.type === "select" ? (
          <Select
            placeholder={input.placeholder || ""}
            onChange={(value) => handleValuesChange({ [input.name]: value })}
          >
            {input.options &&
              input.options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
          </Select>
        ) : (
          <Input
            type={input.type}
            onChange={(e) => handleValuesChange({ [input.name]: e.target.value })}
            placeholder={input.placeholder || ""}
          />
        )}
      </Form.Item>
    ));

  // Handle form submission
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        actionFunctions[0](values); // Call the first action (Submit action) with form values
      })
      .catch(() => {
        message.error("Please fill out the required fields.");
      });
  };

  return (
    <Modal
      title={title}
      visible={isVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={predefinedData}
        onValuesChange={handleValuesChange}
      >
        {formItems}
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        {actions &&
          actionFunctions &&
          actions.length === actionFunctions.length &&
          actions.map((action, index) => (
            <Button
              style={{ marginRight: "5px" }}
              key={action}
              onClick={() => (index === 0 ? onSubmit() : actionFunctions[index](formData))}
            >
              {action}
            </Button>
          ))}
      </div>
    </Modal>
  );
};

export default GenericModal;
