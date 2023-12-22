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
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 0, color: 'white', fontSize: '24px' }}>
                <Link to="/">
                    {/* <img src="path_to_your_logo.png" alt="Logo" style={{ height: '64px' }} /> */}
                    <h1>Similr.ai</h1>
                </Link>
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selectedKeys} className="header-menu">
                {/* <Menu.Item key="/profile">
                    <Link to="/profile">Profile</Link>
                </Menu.Item> */}
                <Menu.Item key="/rapidfire">
                    <Link to="/rapidfire">Rapid Fire</Link>
                </Menu.Item>
                <Menu.Item key="/whoami">
                    <Link to="/whoami">Who Am I</Link>
                </Menu.Item>
                <Menu.Item key="/compare">
                    <Link to="/compare">Compare</Link>
                </Menu.Item>
                <Menu.Item key="/similr">
                    <Link to="/similr">Similr</Link>
                </Menu.Item>
                <Menu.Item key="/recommendations">
                    <Link to="/recommendations">Recommendations</Link>
                </Menu.Item>
                <Menu.Item key="/predict-choice">
                    <Link to="/predict-choice">Predict Choice</Link>
                </Menu.Item>
                <Menu.Item key="/topwords">
                    <Link to="/topwords">Top Words</Link>
                </Menu.Item>
                <Menu.Item key="/meetpeople">
                    <Link to="/meetpeople">Meet People</Link>
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
            <div style={{ flex: 0, textAlign: 'right', paddingRight: '10px' }}>
                <span style={{ color: 'lightgray', fontWeight: 'bold', fontSize: '18px' }}>Beta</span>
            </div>
        </Header>
    );
};

export default HeaderComponent;
