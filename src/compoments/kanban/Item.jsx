import { Draggable } from 'react-beautiful-dnd'

import kanbanCss from '../../assets/scss/kanban.module.scss'

const Item = ({ issue, index }) => {
  return (
    <Draggable draggableId={`${issue.id}`} index={index}>
      {(provided) => (
        <div className={kanbanCss.item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{issue.name}</div>
      )}
    </Draggable>
  )
}

export default Item;