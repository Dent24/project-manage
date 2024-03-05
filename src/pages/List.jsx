import { useState } from 'react';
import { Typography, Table, Tag, Flex, Button, Modal, Form, Input, Select, Radio, message, Drawer, Space, Divider, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

import commonCss from '../assets/scss/common.module.scss'

const { Title } = Typography;
const { confirm } = Modal;

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
  const [onLoad, setOnLoad] = useState(true);
  const [issueList, setIssueList] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ level: 1, status: 'notStart' });
  const [isEdit, setIsEdit] = useState(false);

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
      render: (_, item) => (
        <>
          <a onClick={() => openDrawer(item)}>{item.name}</a>
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

  const issueRef = ref(db, '/issues');
  const userRef = ref(db, '/users');

  const getIssue = () => {
    onValue(issueRef, (snapshot) => {
      const origin = Object.values(snapshot.val()).map((issue) => ({...issue, key: issue.id}))
      setIssueList(origin);
    }, { onlyOnce: true });
  }

  if (onLoad) {
    setOnLoad(false);

    onValue(userRef, (snapshot) => {
      const userList = Object.values(snapshot.val()).reduce((result, { username, name }) => {
        result[username] = name;
        return result;
      }, {});
      setUser(userList)
    }, { onlyOnce: true });

    getIssue();
  }

  const [addForm] = Form.useForm();

  const openModal = () => {
    addForm.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setAdding(true);
    try {
      const value = await addForm.validateFields();
      isEdit ? updateIssue(value) :createIssue(value);
    } catch (error) {
      console.log(error)
      message.error('請確認是否填寫正確');
      setAdding(false);
    }
  };

  const createIssue = (value) => {
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
        getIssue();
      })
      .catch(() => {
        message.error('新增失敗');
        setAdding(false);
      });
  };

  const updateIssue = (value) => {
    update(ref(db, '/issues/' + drawerData.id), value)
      .then(() => {
        message.success('修改成功');
        setIsModalOpen(false);
        setAdding(false);
        getIssue();
      })
      .catch(() => {
        message.error('修改失敗');
        setAdding(false);
      });
  };

  const openDrawer = (issue) => {
    setDrawerData(issue);
    setIsDrawerOpen(true);
  };

  const editIssue = () => {
    addForm.setFieldsValue(drawerData);
    setIsEdit(true);
    setIsModalOpen(true);
    setIsDrawerOpen(false);
  };

  const removeIssue = () => {
    confirm({
      title: '請確認是否刪除以下項目',
      icon: <ExclamationCircleOutlined />,
      content: drawerData.name,
      okText: '確認',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        remove(ref(db, '/issues/' + drawerData.id));
        setIsDrawerOpen(false);
        getIssue();
      }
    });
  }

  return (
    <div>
      <Flex justify='space-between' align='center'>
        <Title style={{marginBottom:0}} level={3}>專案清單</Title>
        <Button type="primary" onClick={openModal}>新增項目</Button>
      </Flex>
      <Table columns={columns} dataSource={issueList} />
      <Modal
        title={isEdit ? '修改項目' : '新增項目'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={()=>setIsModalOpen(false)}
        closeIcon={false}
        keyboard={false}
        maskClosable={false}
        confirmLoading={adding}
      >
        <Form form={addForm}>
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
      <Drawer
        title={drawerData.name}
        placement="right"
        closeIcon={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Space>
            <Tooltip title="修改">
              <Button shape="circle" icon={<EditOutlined />} onClick={editIssue} />
            </Tooltip>
            <Tooltip title="刪除">
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={removeIssue} />
            </Tooltip>
          </Space>
        }
      >
        <div className={commonCss.oneRow}>
          <h4>名稱</h4>
          <p>{drawerData.name}</p>
        </div>
        <div className={commonCss.oneRow}>
          <h4>類型</h4>
          {
            drawerData.type == 'Bug' ?
            <Tag color="red">Bug</Tag> :
            <Tag color="orange">Task</Tag>
          }
        </div>
        <div className={commonCss.oneRow}>
          <h4>警急</h4>
          <Tag color={levelList[drawerData.level].color}>{levelList[drawerData.level].text}</Tag>
        </div>
        <div className={commonCss.oneRow}>
          <h4>狀態</h4>
          <Tag color={statusList[drawerData.status].color}>{statusList[drawerData.status].text}</Tag>
        </div>
        <Divider />
        <div style={{marginBottom:'12px'}}>
          <h4 style={{marginBottom:'4px'}}>需求內容</h4>
          <p>{drawerData.content}</p>
        </div>
        <Divider />
        <div className={commonCss.oneRow}>
          <h4>建立者</h4>
          <p>{user[drawerData.creator]}</p>
        </div>
        <div className={commonCss.oneRow}>
          <h4>建立時間</h4>
          <p>{drawerData.createdAt}</p>
        </div>
        <div className={commonCss.oneRow}>
          <h4>指派對象</h4>
          <p>{user[drawerData.assign]}</p>
        </div>
      </Drawer>
    </div>
  )
}

export default List;