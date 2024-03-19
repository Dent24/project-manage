import { useState } from 'react';
import { Typography, Card, Button, Form, Input, message, Spin } from 'antd';
import { ref, get, set } from "firebase/database";
import db from '../libs/dbLink'
import { CopyOutlined } from '@ant-design/icons';

import addMemberCss from '../assets/scss/addMember.module.scss'


const { Title } = Typography;

const AddMember = () => {
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState('success');
  const [help, setHelp] = useState('');
  const [url, setUrl] = useState('');

  const onFinish = (value) => {
    setStatus('success');
    setHelp('');
    setSpinning(true);

    const userRef = ref(db, '/users/' + value.username);
    get(userRef).then(async (snapshot) => {
      if (!snapshot.val()) {
        await set(ref(db, '/users/' + value.username), {
          username: value.username
        });
        message.success('新增成功');
      } else {
        setStatus('error');
        setHelp('已有此用戶');
        message.error('已有此用戶');
      }
      setUrl(window.location.host + '/project-manage/#/register?username=' + value.username);
      setSpinning(false);
    })
  };

  const onFinishFailed = (errorInfo) => {
    setStatus('error');
    setHelp('請輸入帳號');
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success('複製成功');
    } catch (error) {
      message.error('複製失敗');
    }
  }

  return (
    <div>
      <Title level={3}>新增成員</Title>
      <Card className={addMemberCss.formCard} style={{ width: 400 }}>
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
            validateStatus={status}
            help={help}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <Button type="primary" htmlType="submit">新增</Button>
          </Form.Item>
        </Form>
        { !!url &&
        <div>
          {url}
          <Button className={addMemberCss.copyBtn} type="primary" icon={<CopyOutlined />} size='small' onClick={copyUrl} />
        </div>
        }
        <Spin spinning={spinning} fullscreen />
      </Card>
    </div>
  )
}

export default AddMember;