import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'

import kanbanCss from '../../assets/scss/kanban.module.scss'

const Column = ({ col: { id, list } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className={kanbanCss.column}>
          <h2>{id}</h2>
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