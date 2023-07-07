// components/Landing.tsx
import React, { useContext } from 'react';
import { Layout } from 'antd';
import HeaderComponent from './HeaderComponent';
import { AuthContext } from '../AuthContext'; // Update this import path if necessary

const { Content } = Layout;

const Landing: React.FC = () => {
    const { isLoggedIn, username } = useContext(AuthContext);

    return (
        <Layout className="layout">
            <HeaderComponent />
            <Content style={{ padding: '0 50px' }}>
                {isLoggedIn ? (
                    <div className="site-layout-content">Welcome back, {username}!</div>
                ) : (
                    <div className="site-layout-content">Welcome to the Dating App</div>
                )}
            </Content>
        </Layout>
    );
};

export default Landing;
