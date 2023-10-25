import React from "react";
import Die from "./components/Die.jsx";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import diceOne from "./assets/dice-one.png";
import diceTwo from "./assets/dice-two.png";
import diceThree from "./assets/dice-three.png";
import diceFour from "./assets/dice-four.png";
import diceFive from "./assets/dice-five.png";
import diceSix from "./assets/dice-six.png";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [gameTime, setGameTime] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(0);
  const [startGameScreen, setStartGameScreen] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    if (allHeld & allSameValue) {
      setTenzies(true);
      setIsRunning(false);
      setGameTime(time);
      setStartGameScreen(true);
      setShowConfetti(true);
    }
  }, [dice]);

  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  React.useEffect(() => {
    const lastTimeFromLocalStorage = JSON.parse(
      localStorage.getItem("bestTime")
    );
    console.log(lastTimeFromLocalStorage);
    console.log(gameTime);
    if (
      tenzies &&
      lastTimeFromLocalStorage != 0 &&
      gameTime < lastTimeFromLocalStorage
    ) {
      localStorage.setItem("bestTime", JSON.stringify(gameTime));
      setBestTime(gameTime);
    } else if (tenzies && lastTimeFromLocalStorage === 0 && gameTime > 0) {
      console.log(gameTime);
      localStorage.setItem("bestTime", JSON.stringify(gameTime));
      setBestTime(gameTime);
    }
  }, [gameTime]);

  React.useEffect(() => {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("bestTime"));
    if (
      dataFromLocalStorage === null ||
      (dataFromLocalStorage === 0 && gameTime > 0)
    ) {
      localStorage.setItem("bestTime", JSON.stringify(gameTime));
      setBestTime(gameTime);
    } else {
      setBestTime(dataFromLocalStorage);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
  }, [tenzies]);

  function generateNewDie() {
    let diceImage;
    let randomDie = Math.ceil(Math.random() * 6);

    switch (randomDie) {
      case 1:
        diceImage = diceOne;
        break;
      case 2:
        diceImage = diceTwo;
        break;
      case 3:
        diceImage = diceThree;
        break;
      case 4:
        diceImage = diceFour;
        break;
      case 5:
        diceImage = diceFive;
        break;
      case 6:
        diceImage = diceSix;
        break;
    }

    return {
      value: randomDie,
      isHeld: false,
      id: nanoid(),
      imageURL: diceImage,
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // Iterate over array of dice numbers = die,
  // diceElements will be an array of Die element each with the value prop
  // set to the same number as the item of the same index in the orginal dice array
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      imageURL={die.imageURL}
      tenzies={tenzies}
      isRunning={isRunning}
      startGameScreen={startGameScreen}
    />
  ));

  function rollDice() {
    setIsRunning(true);
    console.log(isRunning);
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice);
      setTime(0);
      setIsRunning(false);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  return (
    <main>
      {showConfetti && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" id="roll-dice" onClick={rollDice}>
        {tenzies && !isRunning
          ? "New game"
          : !tenzies && isRunning
          ? "Roll"
          : "Start game"}
      </button>
      <div className="game-timing">
        <div className="timing-container">
          <h4 className="timing">Current Timing</h4>
          <div className="timing-values">
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((time / 1000) % 100)).slice(-2)}</span>
          </div>
        </div>
        <div className="timing-container">
          <h4 className="timing">Best Timing:</h4>
          <div className="timing-values">
            <span>
              {("0" + Math.floor((bestTime / 60000) % 60)).slice(-2)}:
            </span>
            <span>{("0" + Math.floor((bestTime / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((bestTime / 1000) % 100)).slice(-2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
