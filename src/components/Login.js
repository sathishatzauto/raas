import { Button, Form, Input, Modal, Radio, Spin, notification } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./AuthContext";

const SignIn = () => {
  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [forgetModal, setForgetModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { setAuthToken, setUserData, setOrgData } = useContext(AuthContext);
  const [orgModalVisible, setOrgModalVisible] = useState(false);
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);

  const userLogin = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const response = await axios.post(
        `${process.env.REACT_APP_API}api/auth/signin`,
        { email, password }
      );
      console.log("Sign-in response:", response.data);
      setUserId(response.data.userId);
      localStorage.setItem("authToken", JSON.stringify(response.data.accessToken));
      setAuthToken(response.data.accessToken);
      setUserOrganizations(response.data.userOrganizations);

      if (response.data.userOrganizations.length === 1) {
        // Auto-select organization if only one is available
        const singleOrgId = response.data.userOrganizations[0].id;
        setSelectedOrg(singleOrgId);
        localStorage.setItem("selectedOrg", JSON.stringify(singleOrgId));
        await handleOrgSelect(singleOrgId,response.data.userId); // Verify the single organization directly
      } else {
        // Show modal for multiple organizations
        setOrgModalVisible(true);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      notification.error({
        message: "Sign-in failed",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSelect = async (orgId = selectedOrg,user_Id) => {
    if (orgId) {
      localStorage.setItem("selectedOrg", JSON.stringify(orgId));
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        const response = await axios.post(
          `${process.env.REACT_APP_API}api/auth/verify-user`,
          {
            userId:userId?userId:user_Id,
            organizationId: orgId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrgModalVisible(false);
        setUserData(response.data.userInfo);
        setOrgData(response.data.orgInfo);
        localStorage.setItem("authToken", JSON.stringify(response.data.accessToken));
        notification.success({
          message: "Authentication Successful",
          description: `Welcome User`,
        });
        navigate('/');
      } catch (error) {
        console.error('Organization verification failed:', error);
        notification.error({
          message: "Organization verification failed",
          description: "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      notification.warning({
        message: "No Organization Selected",
        description: "Please select an organization to proceed.",
      });
    }
  };

  const handleCancel = () => {
    setForgetModal(false);
    forgotForm.resetFields();
  };

  const handleForgotPasswordSubmit = async () => {
    setLoading(true);
    forgotForm
      .validateFields()
      .then(async (values) => {
        await axios.post(`${process.env.REACT_APP_API}api/auth/forgot-password`, values);
        notification.success({
          message: 'Email Sent',
          description: 'A password reset link has been sent to your email.',
        });
        setForgetModal(false);
        forgotForm.resetFields();
      })
      .catch(errorInfo => {
        console.error('Validation Failed:', errorInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      {loading ? (
        <Spin tip="Loading..." size="large" style={{ display: 'block', margin: '100px auto' }} />
      ) : (
        <>
          <h1 className="title">ZautoAI Leading the AI Revolution</h1>
          <p className="subtitle">Welcome back! Let's continue making your work extraordinary</p>
          <Form
            form={form}
            onFinish={userLogin}
            className="form"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input type='password' placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="button">
                Sign In
              </Button>
            </Form.Item>
            <p className="forget-pass" onClick={() => setForgetModal(true)}>Forgot Password?</p>
          </Form>

          <Modal
            title="Forgot Password"
            visible={forgetModal}
            onCancel={handleCancel}
            onOk={handleForgotPasswordSubmit}
            okText="Submit"
            cancelText="Cancel"
          >
            <Form form={forgotForm} layout="vertical">
              <Form.Item
                name="email"
                label="Enter Your Email"
                rules={[
                  { required: true, message: 'Please enter your email address!' },
                  { type: 'email', message: 'Please enter a valid email address!' },
                ]}
              >
                <Input placeholder="Enter Your Email" />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Select Organization"
            visible={orgModalVisible}
            footer={null}
            onCancel={() => setOrgModalVisible(false)}
          >
            <Radio.Group
              onChange={e => setSelectedOrg(e.target.value)}
              value={selectedOrg}
            >
              {userOrganizations.map(org => (
                <Radio key={org.id} value={org.id}>
                  {org.name}
                </Radio>
              ))}
            </Radio.Group>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Button type="primary" onClick={() => setOrgModalVisible(false)} style={{ marginRight: '8px' }}>
                Cancel
              </Button>
              <Button type="primary" onClick={() => handleOrgSelect()}>
                Submit
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default SignIn;
