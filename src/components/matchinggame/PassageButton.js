import { useSpring, animated } from "@react-spring/web";


const PassageButton = ({
  item,
  selected,
  handleDragStart,
  handleDrop,
  handleDragOver,
  matchedIds,
  type,
}) => {
  function getRandomPosition() {
    // Generate a random number between 10 and 90
    const pos = Math.floor(Math.random() * 80) + 10;
    return `${pos}%`;
  }

  const props = useSpring({
    to: { top: getRandomPosition(), left: getRandomPosition() },
    from: { top: "0%", left: "0%" },
  });
  
  return (
      <animated.div
        // style={{ ...props, position: "absolute" }}
        draggable={type === "name" || type === "reference" ? true : false}
        onDragStart={
          type === "name" ? (e) => handleDragStart(e, item.id) : null
        }
        onDrop={type === "reference" ? (e) => handleDrop(e, item) : null}
        onDragOver={type === "reference" ? (e) => handleDragOver(e) : null}
        className={`btn ${
          type === "reference" ? "btn-outline-secondary" : "btn-outline-primary"
        } ${selected && selected.id === item.id ? "selected" : ""}`}
      >
        {item[type]}
      </animated.div>
  );
};

export default PassageButton;
