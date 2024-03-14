import { useState } from 'react';
import { Typography, Table, Tag, Flex, Button, Modal, Form, message, Col, Row, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";

import IssuePop from '../compoments/list/IssuePop';
import IssueDrawer from '../compoments/list/IssueDrawer';

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
    get(issueRef).then((snapshot) => {
      const origin = Object.values(snapshot.val()).map((issue) => ({...issue, key: issue.id}))
      setIssueList(origin);
    }, { onlyOnce: true });
  }

  if (onLoad) {
    setOnLoad(false);

    get(userRef).then((snapshot) => {
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

  const [filterForm] = Form.useForm();

  const filterList = (value) => {
    console.log(filterForm.getFieldValue())
  }

  return (
    <div>
      <Flex justify='space-between' align='center'>
        <Title style={{marginBottom:0}} level={3}>專案清單</Title>
        <Button type="primary" onClick={openModal}>新增項目</Button>
      </Flex>
      <Form form={filterForm} onValuesChange={filterList} style={{marginTop:24}}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="指派對象"
              name="assign"
            >
              <Select mode="multiple" allowClear>
                {Object.entries(user).map(([key, name]) => <Select.Option key={key} value={key}>{name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="種類"
              name="type"
            >
              <Select allowClear>
                <Select.Option key='type' value='type'>Type</Select.Option>
                <Select.Option key='bug' value='bug'>Bug</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="緊急程度"
              name="level"
            >
              <Select mode="multiple" allowClear>
                {Object.values(levelList).map((level) => <Select.Option key={level.text} value={level.text}>{level.text}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="進度"
              name="status"
            >
              <Select mode="multiple" allowClear>
                {Object.entries(statusList).map(([key, status]) => <Select.Option key={key} value={key}>{status.text}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} dataSource={issueList} />
      <IssuePop
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        adding={adding}
        addForm={addForm}
        user={user}
      />
      <IssueDrawer
        drawerData={drawerData}
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
        editIssue={editIssue}
        removeIssue={removeIssue}
        levelList={levelList}
        statusList={statusList}
        user={user}
        hasAction
      />
    </div>
  )
}

export default List;