import { useState } from 'react';
import { Typography } from 'antd';
import { DragDropContext } from "react-beautiful-dnd";
import kanbanCss from '../assets/scss/kanban.module.scss'

import Column from '../compoments/kanban/Column'

const { Title } = Typography;

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

const Kanban = () => {
  const [columns, setColumns] = useState(initialColumns)

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null

    if (destination.droppableId === source.droppableId && destination.index === source.index) return null

    const start = columns[source.droppableId]
    const end = columns[destination.droppableId]

    if (start === end) {
      const newList = start.list.filter((_, idx) => idx !== source.index)
      newList.splice(destination.index, 0, start.list[source.index])
      const newCol = { id: start.id, list: newList }

      setColumns(state => ({ ...state, [newCol.id]: newCol }))
    } else {
      const newStartList = start.list.filter((_, idx) => idx !== source.index)
      const newStartCol = { id: start.id, list: newStartList }

      const newEndList = end.list
      newEndList.splice(destination.index, 0, start.list[source.index])
      const newEndCol = { id: end.id, list: newEndList }

      setColumns(state => ({ ...state, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol }))
    }
    return null
  }

  return (
    <div>
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