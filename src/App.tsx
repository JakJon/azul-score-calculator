import React, { useState } from "react";
import "./App.css";
import Board from "./components/board/board";

function App() {
  const [score, setScore] = useState(0);

  function roundScore(): void {

  }

  function gameScore(): void {

  }

  function startOver(): void {

  }

  return (
    <div className="App">
      <h1>Azul Score Calculator</h1>
      <h1>Total Score: {score}</h1>
      <Board />
      <div className="floor-section">
        <h2>Amount of Tiles on Floor</h2>
        <select>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
        </select>
      </div>
      <div className="option-section">
        <h3 className="teal-option">End Round</h3>
        <h3 className="red-option">End Game</h3>
        <h3 className="orange-option">Start Over</h3>
      </div>
    </div>
  );
}

export default App;
