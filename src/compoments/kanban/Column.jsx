import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'

import kanbanCss from '../../assets/scss/kanban.module.scss'

const Column = ({ col: { id, list, text } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className={kanbanCss.column}>
          <h2>{text}</h2>
          <div className={kanbanCss.list} {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((issue, index) => (
              <Item key={issue.id} issue={issue} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default Column;