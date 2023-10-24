import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#F8B90D" : "#C4F4BD",
  };

  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      <h2 className="die-num">{props.value}</h2>
      <img
        className="die-image"
        src={props.imageURL}
        alt={`Dice number ${props.value}`}
      />
    </div>
  );
}
