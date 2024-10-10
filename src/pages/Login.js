import React, { useContext, useState } from 'react';
import { Button, Form, Input, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import '../assets/styleSheets/Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call your backend API to authenticate
      const { email, password } = values;
      const response = await axios.post(`${process.env.REACT_APP_API}/auth/signin`, {
        email,
        password,
      });

      // Extract token and user information from response
      const authToken = response.data.accessToken;
      const userData = { id: response.data.userId }; // Adjust based on API response

      // Store auth token and login user
      login(authToken, userData);
      localStorage.setItem('authToken', authToken); // Store as a string
      localStorage.setItem('user', JSON.stringify(userData));

      notification.success({
        message: 'Login Successful',
        description: `Welcome back, ${response.data.username}!`,
      });

      // Redirect after successful login
      navigate('/knowledge-base'); // Ensure this is called after successful login

    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: 'Invalid username or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {loading ? (
        <Spin tip="Logging in..." size="large" />
      ) : (
        <Form onFinish={onFinish} className="login-form">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input placeholder="Username" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password placeholder="Password" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Login;
