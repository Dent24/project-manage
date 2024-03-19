import { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { DragDropContext } from "react-beautiful-dnd";
import _ from 'lodash'
import { ref, update, get } from "firebase/database";
import db from '../libs/dbLink'
import kanbanCss from '../assets/scss/kanban.module.scss'

import IssueDrawer from '../compoments/list/IssueDrawer';
import Column from '../compoments/kanban/Column'

const { Title } = Typography;

const statusList = {
  notStart: { id: 'notStart', text: '未開始', list: [] },
  planning: { id: 'planning', text: '計畫中', list: [] },
  progress: { id: 'progress', text: '進行中', list: [] },
  testing: { id: 'testing', text: '測試中', list: [] },
  completed: { id: 'completed', text: '完成', list: [] },
  needFix: { id: 'needFix', text: '需修改', list: [] },
  notWork: { id: 'notWork', text: '不執行', list: [] }
}

const levelList = {
  1: { color: 'green', text: 'normal' },
  2: { color: 'orange', text: 'priority' },
  3: { color: 'red', text: 'urgent' }
}

const Kanban = () => {
  const [columns, setColumns] = useState(statusList);
  const [user, setUser] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ level: 1, status: 'notStart' });
  const [spinning, setSpinning] = useState(false);

  const issueRef = ref(db, '/issues');
  const userRef = ref(db, '/users');

  useEffect(() => {
    const result = _.cloneDeep(statusList);

    const getData = async () => {
      const issueSnapShot = await get(issueRef);
      const userSnapShot = await get(userRef);

      Object.values(issueSnapShot.val()).forEach((issue) => {
        result[issue.status].list.push(issue);
      });
      setColumns(result);

      const userList = Object.values(userSnapShot.val()).reduce((result, { username, name }) => {
        result[username] = name;
        return result;
      }, {});
      setUser(userList);
    };

    getData();
  }, [])

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null

    if (destination.droppableId === source.droppableId && destination.index === source.index) return null

    const start = columns[source.droppableId]
    const end = columns[destination.droppableId]

    if (start === end) {
      const newList = start.list.filter((_, idx) => idx !== source.index)
      newList.splice(destination.index, 0, start.list[source.index])
      const newCol = { id: start.id, list: newList, text: start.text }

      setColumns(state => ({ ...state, [newCol.id]: newCol }))
    } else {
      setSpinning(true);
      update(ref(db, '/issues/' + start.list[source.index].id), { status: destination.droppableId })
        .then(() => {
          message.success('更新成功');
          setSpinning(false);
          const newStartList = start.list.filter((_, idx) => idx !== source.index)
          const newStartCol = { id: start.id, list: newStartList, text: start.text }
    
          const newEndList = end.list
          newEndList.splice(destination.index, 0, start.list[source.index])
          const newEndCol = { id: end.id, list: newEndList, text: end.text }
    
          setColumns(state => ({ ...state, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol }))
        })
        .catch(() => {
          message.error('更新失敗');
          setSpinning(false);
        });
    }
    return null
  }

  const openDrawer = (issue) => {
    setDrawerData(issue);
    setIsDrawerOpen(true);
  };

  return (
    <div className={kanbanCss.page}>
      <Title level={3}>看板</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={kanbanCss.kanban}>
        {Object.values(columns).map(col => (
          <Column col={col} key={col.id} user={user} openDrawer={openDrawer} />
        ))}
        </div>
      </DragDropContext>
      <IssueDrawer
        drawerData={drawerData}
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
        levelList={levelList}
        statusList={statusList}
        user={user}
      />
      <Spin spinning={spinning} fullscreen />
    </div>
  )
}

export default Kanban;