import { useState } from 'react';
import { Card, Button, Form, Input, message, Spin } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

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

const Home = () => {
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setSpinning(true)
    const userRef = ref(db, '/users/' + username);
    get(userRef).then(async (snapshot) => {
      if (snapshot.val()) {
        const user = snapshot.val()
        if (!user.name) {
          await set(ref(db, '/users/' + username), {
            name: values.name,
            username: username,
            password: values.password
          })
          message.success('註冊成功');
        } else {
          message.error('已有此用戶');
        }
      } else {
        message.error('帳號失效，請與管理員確認');
      }
      navigate('/login')
    }, { onlyOnce: true })
  };

  const onFinishFailed = (errorInfo) => {
    message.warning('資料錯誤');
  };

  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');

  return (
    <Card className={loginCss.loginCard} title="註冊" bordered={false} style={{ width: 400 }}>
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
          label="名稱"
          name="name"
          rules={[{ required: true, message: '請輸入名稱' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="帳號"
          name="username"
        >
          <Input defaultValue={username} disabled={true} />
        </Form.Item>

        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="確認密碼"
          name="passwordCheck"
          dependencies={['password']}
          rules={[
            { required: true, message: '請確認密碼' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('請確認密碼'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button type="primary" htmlType="submit">註冊</Button>
        </Form.Item>
      </Form>
      <Spin spinning={spinning} fullscreen />
    </Card>
  )
}

export default Home;