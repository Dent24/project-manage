import { useState } from 'react';
import { Typography, Space, Table, Tag } from 'antd';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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
  const [user, setUser] = useState({})

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
      title: 'ISSUE 名稱',
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
    const userList = Object.entries(snapshot.val()).reduce((result, [key, profile]) => {
      result[key] = profile.name;
      return result;
    }, {});
    setUser(userList)
  }, { onlyOnce: true })

  return (
    <div>
      <Title level={3}>專案清單</Title>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default List;