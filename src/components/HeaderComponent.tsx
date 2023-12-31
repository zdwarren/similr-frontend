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
    const isRoot = location.pathname === '/';

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'white', fontSize: '24px' }}>
                <Link to="/" style={{ color: 'lightgray', fontSize: '30px', fontWeight: '500' }}>
                    {/* <img src="path_to_your_logo.png" alt="Logo" style={{ height: '64px' }} /> */}
                    <span>Similr.ai</span>
                </Link>
            </div>
            <Menu
                style={{
                    fontSize: '16px',
                    width: '100%',
                    display: 'flex', 
                    justifyContent: 'center', // Centers items
                }}
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={selectedKeys}>

                {(!isRoot || isLoggedIn) && (
                    <>
                        {/* <Menu.Item key="/profile">
                            <Link to="/profile">Profile</Link>
                        </Menu.Item> */}
                        <Menu.Item key="/rapidfire">
                            <Link to="/rapidfire">Questions</Link>
                        </Menu.Item>
                        <Menu.Item key="/results">
                            <Link to="/results">Results</Link>
                        </Menu.Item>
                        <Menu.Item key="/profile">
                            <Link to="/profile">Profile</Link>
                        </Menu.Item>
                        <Menu.Item key="/compare">
                            <Link to="/compare">Groups</Link>
                        </Menu.Item>
                        <Menu.Item key="/similr">
                            <Link to="/similr">Table</Link>
                        </Menu.Item>
                        <Menu.Item key="/similr-chart">
                            <Link to="/similr-chart">Chart</Link>
                        </Menu.Item>
                        <Menu.Item key="/recommendations">
                            <Link to="/recommendations">Recs</Link>
                        </Menu.Item>
                        {/* <Menu.Item key="/predict-choice">
                            <Link to="/predict-choice">Predict</Link>
                        </Menu.Item>
                        <Menu.Item key="/topwords">
                            <Link to="/topwords">Words</Link>
                        </Menu.Item> */}
                        <Menu.Item key="/meetpeople">
                            <Link to="/meetpeople">SimilrDate</Link>
                        </Menu.Item>
                    </>
                )}
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
            <div style={{ textAlign: 'right', paddingRight: '10px' }}>
                <span style={{ color: 'lightgray', fontWeight: '500', fontSize: '24px' }}>Beta</span>
            </div>
        </Header>
    );
};

export default HeaderComponent;
