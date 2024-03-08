import { useState } from 'react';
import { Typography } from 'antd';
import { DragDropContext } from "react-beautiful-dnd";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";
import kanbanCss from '../assets/scss/kanban.module.scss'

import Column from '../compoments/kanban/Column'

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

const initialColumns = {
  todo: {
    id: 'todo',
    list: ['item 1', 'item 2', 'item 3']
  },
  doing: {
    id: 'doing',
    list: []
  },
  done: {
    id: 'done',
    list: []
  }
}

const statusList = {
  notStart: { id: 'notStart', text: '未開始', list: [] },
  planning: { id: 'planning', text: '計畫中', list: [] },
  progress: { id: 'progress', text: '進行中', list: [] },
  testing: { id: 'testing', text: '測試中', list: [] },
  completed: { id: 'completed', text: '完成', list: [] },
  needFix: { id: 'needFix', text: '需修改', list: [] },
  notWork: { id: 'notWork', text: '不執行', list: [] }
}

const Kanban = () => {
  const [columns, setColumns] = useState({});
  const [onLoad, setOnLoad] = useState(true);

  const issueRef = ref(db, '/issues');

  if (onLoad) {
    setOnLoad(false);
    get(issueRef).then((snapshot) => {
      Object.values(snapshot.val()).forEach((issue) => {
        statusList[issue.status].list.push(issue);
      });
      setColumns(statusList);
    });
  }

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
      const newStartList = start.list.filter((_, idx) => idx !== source.index)
      const newStartCol = { id: start.id, list: newStartList, text: start.text }

      const newEndList = end.list
      newEndList.splice(destination.index, 0, start.list[source.index])
      const newEndCol = { id: end.id, list: newEndList, text: end.text }

      setColumns(state => ({ ...state, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol }))
    }
    return null
  }

  return (
    <div className={kanbanCss.page}>
      <Title level={3}>看板</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={kanbanCss.kanban}>
        {Object.values(columns).map(col => (
          <Column col={col} key={col.id} />
        ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default Kanban;