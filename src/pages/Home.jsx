import { Col, Row, Card } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['未開始', '進行中', '測試中', '完成', '需修改', '不執行', '計畫中'],
  datasets: [
    {
      data: [12, 19, 3, 5, 2, 3, 5],
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

const options = {
  plugins: {
    datalabels: {
      display: false
    },
  },
}

const Home = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title='目前項目狀態'>
          <Doughnut data={data} options={options} />
        </Card>
      </Col>
      <Col span={8}>col-8</Col>
      <Col span={8}>col-8</Col>
    </Row>
  )
}

export default Home;