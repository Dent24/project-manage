import { useState } from 'react';
import { Col, Row, Card } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [onLoad, setOnLoad] = useState(true);

  if (onLoad) {
    const issueRef = ref(db, '/issues');
    const statusList = {
      notStart: 0,
      progress: 0,
      testing: 0,
      completed: 0,
      needFix: 0,
      notWork: 0,
      planning: 0
    };

    get(issueRef).then((snapshot) => {
      const originData = snapshot.val();
      Object.values(originData).forEach((issue) => {
        statusList[issue.status] += 1;
      });

      const stateAllIssue = allIssue;
      stateAllIssue.datasets[0].data = Object.values(statusList);
      setAllIssue(stateAllIssue);
      setOnLoad(false);
    }, { onlyOnce: true });
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title='目前項目狀態'>
          { onLoad ? '' : <Doughnut data={allIssue} /> }
        </Card>
      </Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
    </Row>
  )
}

export default Home;