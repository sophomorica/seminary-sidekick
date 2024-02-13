const PassageButton = ({ item, selected, handleDragStart, handleDrop, handleDragOver, matchedIds, type }) => (
  !matchedIds.includes(item.id) && (
    <button
      key={item.id}
      draggable={type === 'name'}
      onDragStart={type === 'name' ? (e) => handleDragStart(e, item.id) : null}
      onDrop={type === 'reference' ? (e) => handleDrop(e, item) : null}
      onDragOver={type === 'reference' ? (e) => handleDragOver(e) : null}
      className={`btn btn-outline-primary ${
        selected && selected.id === item.id
          ? "selected"
          : ""
      }`}
    >
      {item[type]}
    </button>
  )
);

export default PassageButton;