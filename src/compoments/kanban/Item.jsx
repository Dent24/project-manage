import { Draggable } from 'react-beautiful-dnd'
import { Card, Tag } from 'antd';

import kanbanCss from '../../assets/scss/kanban.module.scss'
import commonCss from '../../assets/scss/common.module.scss'

const levelList = {
  1: { color: 'green', text: 'normal' },
  2: { color: 'orange', text: 'priority' },
  3: { color: 'red', text: 'urgent' }
}

const Item = ({ issue, index, user }) => {
  return (
    <Draggable draggableId={`${issue.id}`} index={index}>
      {(provided) => (
        <Card
          title={issue.name}
          className={kanbanCss.item}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={commonCss.oneRow}>
            <h4>類型</h4>
            { issue.type == 'Bug' ? <Tag color="red">Bug</Tag> : <Tag color="orange">Task</Tag>}
          </div>
          <div className={commonCss.oneRow}>
            <h4>警急</h4>
            <Tag color={levelList[issue.level].color}>{levelList[issue.level].text}</Tag>
          </div>
          <div className={commonCss.oneRow}>
            <h4>建立者</h4>
            <p>{user[issue.creator]}</p>
          </div>
          <div className={commonCss.oneRow}>
            <h4>指派對象</h4>
            <p>{user[issue.assign]}</p>
          </div>
        </Card>
      )}
    </Draggable>
  )
}

export default Item;