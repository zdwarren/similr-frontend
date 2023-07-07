// components/HeaderComponent.tsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../AuthContext';
const { Header } = Layout;

const HeaderComponent: React.FC = () => {
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const location = useLocation();

    // Get the current path and use it to set the selected menu item
    const selectedKeys = [location.pathname];

    return (
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selectedKeys} className="header-menu">
                <Menu.Item key="/matches">
                    <Link to="/matches">Matches</Link>
                </Menu.Item>
                <Menu.Item key="/chat">
                    <Link to="/chat">Chat</Link>
                </Menu.Item>
                <Menu.Item key="/profile">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                {isLoggedIn ? (
                    <Menu.Item key="/logout" icon={<UserOutlined />} onClick={logout} className="menu-item-logout">
                        {username} (Logout)
                    </Menu.Item>
                ) : (
                    <>
                        <Menu.Item key="/login">
                            <Link to="/login">Login</Link>
                        </Menu.Item><Menu.Item key="/signup">
                            <Link to="/signup">Signup</Link>
                        </Menu.Item>
                    </>
                )}
            </Menu>
        </Header>
    );
};

export default HeaderComponent;
