import { useState } from 'react';
import { Card, Button, Form, Input, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

import loginCss from '../assets/scss/login.module.scss'

const firebaseConfig = {
  apiKey: "AIzaSyAxLefC8OwMMzDoWthvaY7XylvpOLwUYGo",
  authDomain: "project-manage-c1482.firebaseapp.com",
  projectId: "project-manage-c1482",
  storageBucket: "project-manage-c1482.appspot.com",
  messagingSenderId: "444594290969",
  appId: "1:444594290969:web:0f62cc116fc778173a4588"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Login = () => {
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setSpinning(true);
    const userRef = ref(db, '/users/' + values.username);
    get(userRef).then((snapshot) => {
      if (!snapshot.val()) {
        message.error('無此用戶');
      } else {
        const user = snapshot.val()
        if (user.password === values.password) {
          localStorage.setItem('userInfo', JSON.stringify({name: user.name, username: values.username}));
          message.success('登入成功');
          navigate('/')
        } else if (!user.name) {
          message.warning('此帳號尚未註冊完成');
        } else {
          message.error('密碼錯誤');
        }
      }
      setSpinning(false);
    }, { onlyOnce: true })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card className={loginCss.loginCard} title="登入" bordered={false} style={{ width: 400 }}>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="帳號"
          name="username"
          rules={[{ required: true, message: '請輸入帳號' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button type="primary" htmlType="submit">登入</Button>
        </Form.Item>
      </Form>
      <Spin spinning={spinning} fullscreen />
    </Card>
  )
}

export default Login;