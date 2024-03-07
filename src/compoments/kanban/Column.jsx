import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'

import kanbanCss from '../../assets/scss/kanban.module.scss'

const Column = ({ list }) => {
  return (
    <Droppable droppableId='col-1'>
      {(provided) => (
        <div className={kanbanCss.column}>
          <h2>清單一</h2>
          <div className={kanbanCss.list} {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default Column;