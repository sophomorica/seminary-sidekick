import { memo, useCallback, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const style = {

  border: '1px solid gray',
  height: '15rem',
  width: '15rem',
  padding: '2rem',
  textAlign: 'center',
};

const PassageButton = memo(function PassageButton({ item, onDrop, lastDroppedItem, type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem, monitor) => {
      onDrop(draggedItem.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? 'lightblue' : '#fff';

  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor, opacity }}
      role="PassageButton"
    >
      <p>{item[type]}</p>

      {!canDrop && lastDroppedItem && <p>Last dropped: {lastDroppedItem.passage}</p>}
    </div>
  );
});

export const StatefulPassageButton = (props) => {
  const [lastDroppedItem, setLastDroppedItem] = useState(null);
  const handleDrop = useCallback((id) => {
    const item = props.items.find(item => item.id === id);
    setLastDroppedItem(item);
  }, [props.items]);

  return (
    <PassageButton
      {...props}
      lastDroppedItem={console.log(lastDroppedItem)}
      onDrop={handleDrop}
    />
  );
};

export default PassageButton;