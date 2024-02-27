import { useState } from 'react';
import { Typography, Table, Tag, Flex, Button, Modal, Form, Input, Select, Radio, message } from 'antd';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const { Title } = Typography;

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

const statusList = {
  notStart: { color: '#858585', text: '未開始' },
  progress: { color: '#df9c00', text: '進行中' },
  testing: { color: '#55c100', text: '測試中' },
  completed: { color: '#009ce3', text: '完成' },
  needFix: { color: '#de2828', text: '需修改' },
  notWork: { color: '#000000', text: '不執行' },
  planning: { color: '#de288c', text: '計畫中' }
}

const levelList = {
  1: { color: 'green', text: 'normal' },
  2: { color: 'orange', text: 'priority' },
  3: { color: 'red', text: 'urgent' }
}

const List = () => {
  const [userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const columns = [
    {
      title: '',
      dataIndex: 'level',
      key: 'level',
      render: (_, { level }) => (
        <>
          <Tag color={levelList[level].color}>{levelList[level].text}</Tag>
        </>
      ),
    },
    {
      title: '項目名稱',
      dataIndex: 'name',
      key: 'name',
      render: (_, { name }) => (
        <>
          <a>{name}</a>
        </>
      ),
    },
    {
      title: '指派對象',
      key: 'assign',
      dataIndex: 'assign',
      render: (_, { assign }) => (
        <>
          {user[assign]}
        </>
      ),
    },
    {
      title: '種類',
      key: 'type',
      dataIndex: 'type',
      render: (_, { type }) => (
        <>
          {
            type == 'Bug' ?
            <Tag color="red">Bug</Tag> :
            <Tag color="orange">Task</Tag>
          }
        </>
      ),
    },
    {
      title: '進度',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          <Tag color={statusList[status].color}>{statusList[status].text}</Tag>
        </>
      ),
    },
    {
      title: '建立時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];
  
  const data = [
    {
      key: 1709002744334,
      name: 'Issue 1',
      creator: 'test',
      assign: 'test',
      createdAt: '2024/2/27 上午10:59:04',
      completedAt: '2024/2/27 上午11:00:04',
      content: '第一個需求',
      status: 'completed',
      type: 'Bug',
      level: 1,
    },
    {
      key: 1709002744560,
      name: 'Issue 2',
      creator: 'test',
      assign: 'test2',
      createdAt: '2024/2/27 上午11:00:04',
      completedAt: '',
      content: '第二個需求',
      status: 'testing',
      type: 'Bug',
      level: 2,
    },
    {
      key: 20240226174600,
      name: 'Issue 3',
      creator: 'test2',
      assign: 'test',
      createdAt: '2024/2/27 上午11:10:04',
      completedAt: '',
      content: '第三個需求',
      status: 'notStart',
      type: 'Task',
      level: 3,
    },
  ];

  const userRef = ref(db, '/users');
  onValue(userRef, (snapshot) => {
    const userList = Object.values(snapshot.val()).reduce((result, { username, name }) => {
      result[username] = name;
      return result;
    }, {});
    setUser(userList)
  }, { onlyOnce: true });

  const [form] = Form.useForm();

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setAdding(true);
    try {
      const value = await form.validateFields();
      const create = new Date();
      const newIssue = {
        ...value,
        assign: value.assign || '',
        id: create.getTime(),
        creator: userInfo.username,
        createdAt: create.toLocaleString(),
        completedAt: '',
        status: 'notStart'
      }
      set(ref(db, '/issues/' + create.getTime()), newIssue)
        .then(() => {
          message.success('新增成功');
          setIsModalOpen(false);
          setAdding(false);
        })
        .catch(() => {
          message.error('新增失敗');
          setAdding(false);
        });
    } catch (error) {
      console.log(error)
      message.error('請確認是否填寫正確');
      setAdding(false);
    }
  };

  return (
    <div>
      <Flex justify='space-between' align='center'>
        <Title style={{marginBottom:0}} level={3}>專案清單</Title>
        <Button type="primary" onClick={openModal}>新增項目</Button>
      </Flex>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="新增項目"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={()=>setIsModalOpen(false)}
        closeIcon={false}
        keyboard={false}
        maskClosable={false}
        confirmLoading={adding}
      >
        <Form form={form}>
          <Form.Item
            label="項目名稱"
            name="name"
            rules={[{ required: true, message: '請輸入名稱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="指派對象"
            name="assign"
          >
            <Select>
              {Object.entries(user).map(([key, name]) => <Select.Option key={key} value={key}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label="內容"
            name="content"
            rules={[{ required: true, message: '請輸入任意內容' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="類型"
            name="type"
            rules={[{ required: true, message: '請輸入項目類型' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Bug">Bug</Radio.Button>
              <Radio.Button value="Task">Task</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="緊急程度"
            name="level"
            rules={[{ required: true, message: '請輸入緊急程度' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={1}>Normal</Radio.Button>
              <Radio.Button value={2}>Priority</Radio.Button>
              <Radio.Button value={3}>Urgent</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default List;