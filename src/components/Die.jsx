import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor:
      props.isHeld & !props.tenzies & props.isRunning
        ? "#F8B90D"
        : props.startGameScreen & !props.isRunning
        ? "#0b2434"
        : "#C4F4BD",
    cursor: props.isRunning ? "pointer" : "none",
    color:
      props.tenzies || props.startGameScreen & !props.isRunning
        ? "whitesmoke"
        : "inherit",
    pointerEvents: !props.isRunning || props.tenzies ? "none" : "auto",
  };

  return (
    <div
      className="die-face"
      id="die-face"
      style={styles}
      onClick={props.holdDice}
    >
      <h2 className="die-num">{props.value}</h2>
      <img
        className="die-image"
        src={props.imageURL}
        alt={`Dice number ${props.value}`}
      />
    </div>
  );
}
