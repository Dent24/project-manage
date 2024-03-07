import { useState } from 'react';
import { Typography } from 'antd';
import { DragDropContext } from "react-beautiful-dnd";
import kanbanCss from '../assets/scss/kanban.module.scss'

import Column from '../compoments/kanban/Column'

const { Title } = Typography;

const Kanban = () => {
  const [list, setList] = useState(['Item 1', 'Item 2', 'Item 3'])

  const onDragEnd = () => null

  return (
    <div>
      <Title level={3}>看板</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={kanbanCss.kanban}>
          <Column list={list} />
        </div>
      </DragDropContext>
    </div>
  )
}

export default Kanban;