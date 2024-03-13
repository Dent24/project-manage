import { useState } from 'react';
import { Col, Row, Card, Spin } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const data = {
  labels: ['未開始', '進行中', '測試中', '完成', '需修改', '不執行', '計畫中'],
  datasets: [
    {
      data: [],
      backgroundColor: [
        '#858585',
        '#df9c00',
        '#55c100',
        '#009ce3',
        '#de2828',
        '#000000',
        '#de288c'
      ]
    },
  ],
};

const horizonOption = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false
}

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
  const [allIssue, setAllIssue] = useState(data);
  const [assignIssue, setAssignIssue] = useState({});
  const [onLoad, setOnLoad] = useState(true);

  if (onLoad) {
    const issueRef = ref(db, '/issues');
    const userRef = ref(db, '/users');
    const statusList = {
      notStart: 0,
      progress: 0,
      testing: 0,
      completed: 0,
      needFix: 0,
      notWork: 0,
      planning: 0
    };

    Promise.all([get(userRef), get(issueRef)])
      .then((values) => {
        const userList = Object.values(values[0].val()).reduce((result, { username }) => {
          result[username] = { assign: 0, color: `rgba(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})` };
          return result;
        }, {});
        userList['none'] = { assign: 0, color: 'rgba(0, 0, 0)' };

        const originData = values[1].val();
        Object.values(originData).forEach((issue) => {
          statusList[issue.status] += 1;
          userList[issue.assign || 'none'].assign += 1
        });

        const stateAllIssue = allIssue;
        stateAllIssue.datasets[0].data = Object.values(statusList);
        setAllIssue(stateAllIssue);

        const stateAssignIssue = {
          labels: Object.values(values[0].val()).map((issue) => issue.name),
          datasets: [{
            label: '指派數量',
            data: Object.values(userList).map((user) => user.assign),
            backgroundColor: Object.values(userList).map((user) => user.color)
          }]
        }
        stateAssignIssue.labels.push('未指派');
        setAssignIssue(stateAssignIssue);
        setOnLoad(false);
      });
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title='目前項目狀態'>
          { onLoad ? '' : <Doughnut data={allIssue} /> }
        </Card>
      </Col>
      <Col span={6}>
        <Card title='指派對象分佈'>
          <div style={{height:'400px'}}>
          { onLoad ? '' : <Bar options={horizonOption} data={assignIssue} /> }
          </div>
        </Card>
      </Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
      <Spin spinning={onLoad} fullscreen />
    </Row>
  )
}

export default Home;