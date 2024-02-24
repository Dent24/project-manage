import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, message } from 'antd';
import {
  UserAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import normalCss from '../assets/scss/normal.module.scss'

const { Sider, Content } = Layout;

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('首頁', '/', <HomeOutlined />),
  getItem('新增成員', '/addMember', <UserAddOutlined />),
];

const Default = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  const navigate = useNavigate();
  const location = useLocation();

  const menuKey = [location.pathname];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!userInfo.name) navigate('/login')
  }, [ userInfo ]);

  const logout = () => {
    localStorage.setItem('userInfo', JSON.stringify({}));
    navigate('/login');
    message.success('登出成功');
  }

  const menuClick = ({ key }) => {
    navigate(key);
  }

  return (
    <>
      <Layout style={{marginLeft:collapsed?'80px':'200px'}}>
        <Sider trigger={null} collapsible collapsed={collapsed} className={`${normalCss.sideBar} ${collapsed ? '' : normalCss.collapsed}`}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={`${normalCss.collapsedButton} ${collapsed ? '' : normalCss.collapsed}`}
          />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={menuKey}
            items={items}
            onClick={menuClick}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            className={`${normalCss.collapsedButton} ${collapsed ? '' : normalCss.collapsed} ${normalCss.logout}`}
          >{collapsed ? '' : 'Logout'}</Button>
        </Sider>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  )
}

export default Default;