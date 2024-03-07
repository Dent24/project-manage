import { Draggable } from 'react-beautiful-dnd'

import kanbanCss from '../../assets/scss/kanban.module.scss'

const Item = ({ text, index }) => {
  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <div className={kanbanCss.item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{text}</div>
      )}
    </Draggable>
  )
}

export default Item;