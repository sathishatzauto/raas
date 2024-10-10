import React, { useContext } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  SettingOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../auth/AuthContext';
import '../assets/styleSheets/Navbar.css';

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  const items = [
    {
      label: <Link to="/knowledge-base">Knowledge Base</Link>,
      key: 'knowledge-base',
      icon: <ReadOutlined />,
    },
    {
      label: <Link to="/settings">Settings</Link>,
      key: 'settings',
      icon: <SettingOutlined />,
    },
    {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <Sider width={250} className="navbar-sider">
      <div className="navbar-header">
        <Title level={2} className="navbar-title">RAG</Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        className="navbar-menu"
        items={items} // Use the `items` prop here
      />
      <div className="navbar-footer">
        <div className="navbar-user">{user?.name}</div>
      </div>
    </Sider>
  );
};

export default Navbar;
