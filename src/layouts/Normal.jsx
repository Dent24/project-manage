import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme, message } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import normalCss from '../assets/scss/normal.module.scss'

const { Header, Sider, Content } = Layout;

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];

const Default = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  const navigate = useNavigate();

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

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{position:'relative'}}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={`${normalCss.collapsedButton} ${collapsed ? '' : normalCss.collapsed}`}
          />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
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