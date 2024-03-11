import { Tag, Button, Drawer, Space, Divider, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import commonCss from '../../assets/scss/common.module.scss'

const IssueDrawer = ({ drawerData, setIsDrawerOpen, isDrawerOpen, editIssue, removeIssue, levelList, statusList, user }) => {
  return (
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
      <div className={commonCss.oneRow}>
        <h4>完成時間</h4>
        <p>{drawerData.completedAt}</p>
      </div>
    </Drawer>
  )
}

export default IssueDrawer;